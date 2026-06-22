import { NextResponse } from 'next/server';
import FlashcardSet from '@/models/flashcardSet';
import { generateFlashcards } from '../services/gemini';
import { extractJsonFromString, sanitizeAndParseJson } from '../utils/json.utils';
import { Message } from '../chat.types';
import { Part } from '@google/generative-ai';
import { IChatSession } from '@/models/chatSession';

interface FlashcardResponse {
    title: string;
    description: string;
    cards: { term: string; definition: string; }[];
}

// --- MODIFICATION: Added 'maturaSubject' to the function signature ---
export async function handleGenerateFlashcards(
    userId: string,
    userParts: Part[],
    chatSession: IChatSession,
    userMessage: Message,
    maturaSubject: string | null // <-- Receive the subject context
): Promise<NextResponse> {
    // 1. Format the existing chat history.
    const formattedHistory = chatSession.messages
        .map(m => (m.role === 'user' ? `User: ${m.content}` : `Assistant: ${m.content}`))
        .join('\n\n');

    // 2. Add user's current message to the session history.
    chatSession.messages.push(userMessage);

    // 3. Generate the flashcards, now with subject context.
    // --- MODIFICATION: Pass subject to the Gemini service ---
    const aiResponseText = await generateFlashcards(userParts, formattedHistory, maturaSubject);

    if (!aiResponseText) {
        throw new Error("AI did not return content for flashcards.");
    }

    const jsonString = extractJsonFromString(aiResponseText);
    if (!jsonString) {
        console.error("Failed to extract JSON from flashcard response:", aiResponseText);
        throw new Error("AI response did not contain a valid JSON block for flashcards.");
    }

    const { title, cards: aiCards } = sanitizeAndParseJson<FlashcardResponse>(jsonString);

    if (!title || !aiCards || !Array.isArray(aiCards)) {
        throw new Error("Invalid data format from AI for flashcards: Missing 'title' or 'cards' array.");
    }

    const formattedCards = aiCards
        .map(card => (card?.term && card?.definition) ? { term: String(card.term).trim(), definition: String(card.definition).trim() } : null)
        .filter((card): card is { term: string; definition: string; } => card !== null);

    let confirmationMessage: Message;

    if (formattedCards.length === 0) {
        // Create a failure message if no cards were generated.
        confirmationMessage = {
            role: 'assistant',
            content: "Przepraszam, nie udało mi się stworzyć poprawnych fiszek. Spróbuj sformułować prośbę inaczej lub użyj innego pliku."
        };
    } else {
        // Create the flashcard set in the database.
        const newSet = await FlashcardSet.create({ title, cards: formattedCards, user: userId, isPublic: false });

        // Create the success message with the link format.
        confirmationMessage = {
            role: 'assistant',
            content: `Znakomicie! Stworzyłem zestaw fiszek zatytułowany "${newSet.title}".`,
            linkType: 0, // 0 represents flashcards
            linkId: newSet._id.toString()
        };
    }

    // Add the final confirmation (or failure) message to the session history.
    chatSession.messages.push(confirmationMessage);

    // The main route dispatcher will handle saving the session.
    return NextResponse.json({ type: 'chat', message: confirmationMessage });
}