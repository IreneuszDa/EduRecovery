import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'
import { connectMongoDB } from '@/lib/mongodb';
import FlashcardSet from '@/models/flashcardSet';
import User from '@/models/user';
import { flashcardModel } from '@/app/api/chat/services/gemini';
import { extractJsonFromString, sanitizeAndParseJson } from '@/app/api/chat/utils/json.utils';

// Prompt for generating cards for a NEW set.
const createSetSystemPrompt = `
Jesteś asystentem AI specjalizującym się w tworzeniu materiałów edukacyjnych w formie fiszek.
Na podstawie podanego przez użytkownika tematu i żądanej liczby fiszek, wygeneruj listę fiszek.
Każda fiszka musi zawierać klucz "term" (pojęcie) oraz "definition" (definicja).
Twoja odpowiedź MUSI być WYŁĄCZNIE poprawną tablicą obiektów JSON.
ABSOLUTNIE nie dołączaj żadnych dodatkowych tekstów, wyjaśnień, ani formatowania markdown, takiego jak \`\`\`json.
Twoja odpowiedź musi zaczynać się od znaku '[' i kończyć znakiem ']'.
Format JSON musi być idealnie zgodny z tym przykładem: [{ "term": "Stolica Polski", "definition": "Warszawa" }, { "term": "Stolica Niemiec", "definition": "Berlin" }]
Wygeneruj dokładnie tyle fiszek, o ile prosi użytkownik. Upewnij się, że cały tekst jest w języku polskim.
`;

interface ICard {
    term: string;
    definition: string;
}

export async function POST(request: NextRequest) {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Brak autoryzacji." }, { status: 401 });
    }

    try {
        // 2. Body validation
        const body = await request.json();
        const { title, topic, numberOfCards, isPublic } = body;

        if (!title || typeof title !== 'string' || title.trim() === '') {
            return NextResponse.json({ message: "Tytuł zestawu jest wymagany." }, { status: 400 });
        }
        if (!topic || typeof topic !== 'string' || topic.trim() === '') {
            return NextResponse.json({ message: "Temat jest wymagany." }, { status: 400 });
        }
        if (!numberOfCards || typeof numberOfCards !== 'number' || numberOfCards < 1 || numberOfCards > 20) {
            return NextResponse.json({ message: "Liczba fiszek musi być między 1 a 20." }, { status: 400 });
        }
        if (typeof isPublic !== 'boolean') {
            return NextResponse.json({ message: "Nieprawidłowa wartość 'isPublic'." }, { status: 400 });
        }

        // 3. Database connection and user retrieval
        await connectMongoDB();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "Użytkownik nie znaleziony." }, { status: 404 });
        }

        // 4. AI Generation
        const userPrompt = `Temat: "${topic}". Liczba fiszek do wygenerowania: ${numberOfCards}.`;
        const result = await flashcardModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: createSetSystemPrompt }, { text: userPrompt }] }]
        });
        const aiResponseText = result.response.text();
        const jsonString = extractJsonFromString(aiResponseText);

        if (!jsonString) {
            console.error("AI Generation Error (generate-with-ai): No JSON found in response.", { aiResponseText });
            throw new Error("Nie udało się wygenerować fiszek. Odpowiedź AI nie zawierała poprawnego formatu JSON.");
        }

        const aiCards = sanitizeAndParseJson<ICard[]>(jsonString);

        if (!Array.isArray(aiCards)) {
            console.error("AI Generation Error (generate-with-ai): Parsed JSON is not an array.", { jsonString });
            throw new Error("Format danych od AI jest nieprawidłowy. Oczekiwano tablicy fiszek.");
        }

        const formattedCards = aiCards
            .map(card => (card?.term && card?.definition) ? { term: String(card.term).trim(), definition: String(card.definition).trim() } : null)
            .filter((card): card is ICard => card !== null && card.term !== '' && card.definition !== '');

        if (formattedCards.length === 0) {
            throw new Error("AI nie wygenerowało żadnych poprawnych fiszek. Spróbuj ponownie lub zmień temat.");
        }

        // 5. Create and save the new set
        const newSet = new FlashcardSet({
            title: title.trim(),
            category: topic.trim().substring(0, 50), // Use topic as a category, truncated
            user: user._id,
            isPublic: isPublic,
            cards: formattedCards,
        });

        await newSet.save();

        // 6. Return the new set
        return NextResponse.json(newSet, { status: 201 });

    } catch (error) {
        console.error("[FLASHCARD_GENERATE_SET_ERROR]", error);
        const errorMessage = error instanceof Error ? error.message : "Wystąpił nieoczekiwany błąd podczas generowania zestawu.";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}