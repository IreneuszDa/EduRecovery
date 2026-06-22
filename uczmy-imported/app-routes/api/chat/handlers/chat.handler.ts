import { NextResponse } from 'next/server';
import { Part } from '@google/generative-ai';
import { IChatSession } from '@/models/chatSession';
import Exam from '@/models/exam';
import { Message, ChatResponseMessage, ActionType } from '../chat.types';
import {
    generateChatResponse,
    generateFollowUpQuestions,
    getChatPrompt,
    getChatWithExamContextPrompt
} from '../services/gemini';
import { extractJsonFromString, sanitizeAndParseJson } from '../utils/json.utils';

// --- MODIFICATION: Added 'maturaSubject' to the function signature ---
export async function handleChat(
    chatSession: IChatSession,
    userParts: Part[],
    userMessage: Message,
    originalUserMessage: string,
    isNewChat: boolean,
    action: ActionType,
    maturaSubject: string | null // <-- Receive the subject from the main route handler
): Promise<NextResponse> {
    try {
        const formattedHistory = chatSession.messages
            .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
            .join('\n\n');

        let fullPrompt: string;
        let examContextFound = false;

        // 1. Check for a persistent `activeExamContextId`. This takes precedence.
        const exam = chatSession.activeExamContextId
            ? await Exam.findById(chatSession.activeExamContextId).lean()
            : null;

        // 2. Determine the correct prompt based on context.
        if (exam) {
            // A persistent exam context exists for this session. Use the specialized prompt.
            const examJson = JSON.stringify(exam);
            // --- MODIFICATION: Pass subject to the exam-context prompt generator ---
            fullPrompt = getChatWithExamContextPrompt(formattedHistory, originalUserMessage, examJson, maturaSubject);
            examContextFound = true;
        } else {
            // No active exam context. Check for 'learn' mode or standard chat.
            const isLearnMode = action === 'learn';
            // --- MODIFICATION: Pass subject to the standard/learn prompt generator ---
            fullPrompt = getChatPrompt(formattedHistory, originalUserMessage, isLearnMode, maturaSubject);
        }

        // Add user's message to the session before calling the AI
        chatSession.messages.push(userMessage);

        const aiContent = await generateChatResponse(fullPrompt);

        let proposedQuestions: string[] = [];

        // Only generate proposed questions in standard chat context
        if (!isNewChat && !examContextFound && action !== 'learn') {
            try {
                // --- MODIFICATION: Pass subject for more relevant follow-up questions ---
                const followUpResponseText = await generateFollowUpQuestions(originalUserMessage, aiContent, maturaSubject);
                const extractedJson = extractJsonFromString(followUpResponseText);
                if (extractedJson) {
                    const parsed = sanitizeAndParseJson<string[]>(extractedJson);
                    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                        proposedQuestions = parsed.slice(0, 3);
                    }
                }
            } catch (e) {
                console.warn("[PROPOSED_Q_WARN] Failed to parse follow-up questions JSON:", e);
            }
        }

        const aiMessageForClient: ChatResponseMessage = {
            role: 'assistant',
            content: aiContent.trim(),
        };

        if (proposedQuestions.length > 0) {
            aiMessageForClient.proposedQuestions = proposedQuestions;
        }

        // Add the AI's response to the session history.
        chatSession.messages.push(aiMessageForClient);

        // The main POST handler will save the updated chatSession.
        return NextResponse.json({ type: 'chat', message: aiMessageForClient });

    } catch (error) {
        console.error("Error in handleChat:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to handle chat response.");
    }
}