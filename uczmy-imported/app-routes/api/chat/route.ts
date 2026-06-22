import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'
import { connectMongoDB } from '@/lib/mongodb';
import { Part } from '@google/generative-ai';
import ChatSession, { IChatSession } from '@/models/chatSession';
import { Message, ActionType } from './chat.types';

// Import all handlers
import { handleChat } from './handlers/chat.handler';
import { handleGenerateExam } from './handlers/exam.handler';
import { handleGenerateFlashcards } from './handlers/flashcard.handler';
import { handleAnimateAction } from './handlers/animate.handler';

// Helper function to generate a title for a new chat
async function generateChatTitle(firstUserMessage: string, firstAiResponse: string): Promise<string> {
    try {
        const { chatModel } = await import('./services/gemini');
        const prompt = `Na podstawie tej rozmowy, stwórz bardzo krótki tytuł (maksymalnie 5 słów) po polsku. Odpowiedz tylko tytułem, bez żadnych dodatkowych słów. Użytkownik: "${firstUserMessage.substring(0, 150)}". Asystent: "${firstAiResponse.substring(0, 150)}"`;
        const result = await chatModel.generateContent(prompt);
        return result.response.text().replace(/["']/g, '').trim() || "Nowa rozmowa";
    } catch (error) {
        console.error("Error generating chat title:", error);
        return "Nowa rozmowa"; // Fallback title
    }
}

// GET handler remains unchanged
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');
        if (!sessionId) {
            return NextResponse.json({ history: [] });
        }
        await connectMongoDB();
        const chatSession = await ChatSession.findOne({ _id: sessionId, user: session.user.id }).lean();
        if (!chatSession) {
            return new NextResponse('Chat session not found', { status: 404 });
        }
        return NextResponse.json({ history: chatSession.messages || [] });
    } catch (error) {
        console.error('[CHAT_GET_HISTORY_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}


// --- MODIFIED POST HANDLER ---
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const userId = session.user.id;

        const formData = await req.formData();
        const action = (formData.get('action') as ActionType) || 'chat';
        const originalUserMessage = formData.get('message') as string;
        let chatSessionId = formData.get('chatSessionId') as string | null;
        const file = formData.get('file') as File | null;
        // MODIFICATION: Extract subject from form data
        const maturaSubject = formData.get('maturaSubject') as string | null;

        const geminiParts: Part[] = [];
        if (file) {
            const fileBuffer = await file.arrayBuffer();
            const base64Data = Buffer.from(fileBuffer).toString('base64');
            geminiParts.push({ inlineData: { mimeType: file.type, data: base64Data } });
        }
        if (originalUserMessage) {
            geminiParts.unshift({ text: originalUserMessage });
        }
        if (geminiParts.length === 0) {
            return new NextResponse('Message or file is required for this action', { status: 400 });
        }

        await connectMongoDB();

        let chatSession: IChatSession;
        let isNewChat = false;

        if (chatSessionId && chatSessionId !== 'null' && chatSessionId !== 'undefined') {
            const foundSession = await ChatSession.findById(chatSessionId);
            if (!foundSession || foundSession.user.toString() !== userId) {
                return new NextResponse('Chat session not found or unauthorized', { status: 404 });
            }
            chatSession = foundSession;
        } else {
            isNewChat = true;
            chatSession = new ChatSession({ user: userId, messages: [] });
        }

        let userMessageForHistoryContent = originalUserMessage;
        if (file) {
            userMessageForHistoryContent = originalUserMessage ? `${originalUserMessage}\n\n*Załączono plik: ${file.name}*` : `*Załączono plik: ${file.name}*`;
        }
        const userMessage: Message = { role: 'user', content: userMessageForHistoryContent.trim() };

        // Dispatch to the appropriate handler, now passing the subject.
        let response: NextResponse;
        switch (action) {
            case 'generateFlashcards':
                // MODIFICATION: Pass subject to handler
                response = await handleGenerateFlashcards(userId, geminiParts, chatSession, userMessage, maturaSubject);
                break;
            case 'generateExam':
                // MODIFICATION: Pass subject to handler
                response = await handleGenerateExam(userId, geminiParts, chatSession, userMessage, file, maturaSubject);
                break;
            case 'animate':
                // Handle animation generation
                response = await handleAnimateAction(userId, geminiParts, chatSession, userMessage, originalUserMessage);
                break;
            case 'learn':
            case 'chat':
            default:
                // MODIFICATION: Pass subject and action to handler
                response = await handleChat(chatSession, geminiParts, userMessage, originalUserMessage, isNewChat, action, maturaSubject);
                break;
        }

        // --- CENTRALIZED SAVE & FINALIZATION LOGIC ---

        let finalTitle = chatSession.title; // Get current or default title

        if (isNewChat && chatSession.messages.length >= 2) {
            const firstUserMsg = chatSession.messages[0].content;
            const firstAiMsg = chatSession.messages[1].content;
            const newTitle = await generateChatTitle(firstUserMsg, firstAiMsg);
            chatSession.title = newTitle;
            finalTitle = newTitle;
        }

        await chatSession.save();

        const responseData = await response.json();

        if (isNewChat) {
            responseData.newSession = {
                _id: (chatSession._id as string | { toString(): string }).toString(),
                title: finalTitle,
            };
        }

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('[CHAT_POST_API_ERROR]', error);
        const errorMessage = error instanceof Error ? error.message : "An internal server error occurred.";
        return new NextResponse(JSON.stringify({ message: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}