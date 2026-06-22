import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'
import { connectMongoDB } from '@/lib/mongodb';
import FlashcardSet from '@/models/flashcardSet';
import { flashcardModel } from '@/app/api/chat/services/gemini';
import { extractJsonFromString, sanitizeAndParseJson } from '@/app/api/chat/utils/json.utils';

// This is a more specialized system prompt for adding cards to an *existing* set.
const addCardsSystemPrompt = `
Jesteś asystentem AI, który generuje edukacyjne fiszki.
Użytkownik chce dodać nowe fiszki do istniejącego już zestawu.
Na podstawie podanego tematu i żądanej liczby, wygeneruj listę fiszek.
Każda fiszka musi mieć klucz "term" oraz "definition".
Twoja odpowiedź MUSI być WYŁĄCZNIE poprawną tablicą JSON zawierającą obiekty.
ABSOLUTNIE NIE dodawaj żadnego tekstu wprowadzającego, wyjaśnień ani formatowania markdown, jak \`\`\`json.
Twoja odpowiedź musi zaczynać się od znaku '[' i kończyć się znakiem ']'.
Format każdego obiektu w tablicy musi być następujący: { "term": "...", "definition": "..." }
Wygeneruj dokładnie tyle fiszek, o ile prosi użytkownik. Upewnij się, że cały tekst jest po polsku.
`;

interface ICard {
    term: string;
    definition: string;
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    // 1. Authentication and Authorization
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Brak autoryzacji." }, { status: 401 });
    }
    const userId = session.user.id;
    const { id: setId } = params;

    if (!setId) {
        return NextResponse.json({ message: "ID zestawu jest wymagane." }, { status: 400 });
    }

    try {
        // 2. Get and validate request body
        const body = await request.json();
        const { topic, numberOfCards } = body;

        if (!topic || typeof topic !== 'string' || topic.trim() === '') {
            return NextResponse.json({ message: "Temat jest wymagany." }, { status: 400 });
        }
        if (!numberOfCards || typeof numberOfCards !== 'number' || numberOfCards < 1 || numberOfCards > 20) {
            return NextResponse.json({ message: "Liczba fiszek musi być między 1 a 20." }, { status: 400 });
        }

        // 3. Connect to DB and find the set
        await connectMongoDB();
        const set = await FlashcardSet.findById(setId);

        if (!set) {
            return NextResponse.json({ message: "Nie znaleziono zestawu fiszek." }, { status: 404 });
        }

        // Security check: ensure the user owns the set
        if (set.user.toString() !== userId) {
            return NextResponse.json({ message: "Brak uprawnień do modyfikacji tego zestawu." }, { status: 403 });
        }

        // 4. Generate content with AI
        const userPrompt = `Temat: "${topic}". Liczba fiszek do wygenerowania: ${numberOfCards}.`;

        const result = await flashcardModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: addCardsSystemPrompt }, { text: userPrompt }] }]
        });

        const aiResponseText = result.response.text();
        const jsonString = extractJsonFromString(aiResponseText);

        if (!jsonString) {
            console.error("AI Generation Error: No JSON found in response.", { aiResponseText });
            throw new Error("Nie udało się wygenerować fiszek. Odpowiedź AI nie zawierała poprawnego formatu JSON.");
        }

        const aiCards = sanitizeAndParseJson<ICard[]>(jsonString);

        if (!Array.isArray(aiCards)) {
            console.error("AI Generation Error: Parsed JSON is not an array.", { jsonString });
            throw new Error("Format danych od AI jest nieprawidłowy. Oczekiwano tablicy fiszek.");
        }

        // 5. Sanitize and format the new cards
        const formattedNewCards = aiCards
            .map(card => (card?.term && card?.definition) ? { term: String(card.term).trim(), definition: String(card.definition).trim() } : null)
            .filter((card): card is ICard => card !== null && card.term !== '' && card.definition !== '');

        if (formattedNewCards.length === 0) {
            throw new Error("AI nie wygenerowało żadnych poprawnych fiszek. Spróbuj ponownie lub zmień temat.");
        }

        // 6. Update the set in the database
        set.cards.push(...formattedNewCards);
        const updatedSet = await set.save();

        // 7. Return the full, updated set to the client
        return NextResponse.json(updatedSet, { status: 200 });

    } catch (error) {
        console.error("[FLASHCARD_GENERATE_CARDS_ERROR]", error);
        const errorMessage = error instanceof Error ? error.message : "Wystąpił nieoczekiwany błąd podczas generowania fiszek.";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}