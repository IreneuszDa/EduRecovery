import { Part } from '@google/generative-ai';
import { chatModel, examModel, flashcardModel, followUpModel } from './models';
import { flashcardSystemPrompt, examSystemPrompt, getFollowUpPrompt, getChatPrompt, getChatWithExamContextPrompt } from './prompts';

export async function generateChatResponse(fullPrompt: string): Promise<string> {
    const result = await chatModel.generateContent(fullPrompt);
    return result.response.text();
}

// --- MODIFICATION: Add 'subject' parameter ---
export async function generateFlashcards(userParts: Part[], history: string, subject: string | null): Promise<string> {
    // --- MODIFICATION: Inject subject into prompt ---
    const finalPrompt = flashcardSystemPrompt
        .replace('{CHAT_HISTORY}', history || "Brak historii.")
        .replace('{SUBJECT}', subject || 'ogólny'); // Provide a fallback

    const result = await flashcardModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: finalPrompt }, ...userParts] }]
    });
    return result.response.text();
}

// --- MODIFICATION: Add 'subject' parameter ---
export async function generateExam(userParts: Part[], history: string, subject: string | null): Promise<string> {
    // --- MODIFICATION: Inject subject into prompt ---
    const finalPrompt = examSystemPrompt
        .replace('{CHAT_HISTORY}', history || "Brak historii.")
        .replace('{SUBJECT}', subject || 'Ogólny'); // Provide a fallback

    const result = await examModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: finalPrompt }, ...userParts] }]
    });
    return result.response.text();
}

// --- MODIFICATION: Add 'subject' parameter ---
export async function generateFollowUpQuestions(userMessage: string, aiResponse: string, subject: string | null): Promise<string> {
    if (!userMessage.trim()) return "[]";
    // --- MODIFICATION: Pass subject to prompt generator ---
    const prompt = getFollowUpPrompt(userMessage, aiResponse, subject);
    const result = await followUpModel.generateContent(prompt);
    return result.response.text();
}