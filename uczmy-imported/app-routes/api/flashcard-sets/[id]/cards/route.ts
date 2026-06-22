import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import FlashcardSet from "@/models/flashcardSet";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth'

/**
 * @route POST /api/flashcard-sets/[id]/cards
 * @description Adds a new, manually created flashcard to a specific set.
 * @param {NextRequest} request - The incoming request, containing the term and definition in the body.
 * @param {object} params - The route parameters, containing the flashcard set ID.
 * @returns {NextResponse} - The newly created card object or an error message.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    // 1. Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Brak autoryzacji. Musisz być zalogowany." }, { status: 401 });
    }
    const userId = session.user.id;

    try {
        // 2. Parse and validate the request body
        const { term, definition } = await request.json();

        if (!term || typeof term !== 'string' || term.trim() === '') {
            return NextResponse.json({ message: "Termin (awers) jest wymagany." }, { status: 400 });
        }
        if (!definition || typeof definition !== 'string' || definition.trim() === '') {
            return NextResponse.json({ message: "Definicja (rewers) jest wymagana." }, { status: 400 });
        }

        await connectMongoDB();

        const { id } = params; // The ID of the flashcard set from the URL
        const set = await FlashcardSet.findById(id);

        if (!set) {
            return NextResponse.json({ message: "Nie znaleziono zestawu fiszek." }, { status: 404 });
        }

        // 3. Authorize the user (check if they own the set)
        if (set.user.toString() !== userId) {
            return NextResponse.json(
                { message: "Brak uprawnień do dodawania fiszek w tym zestawie." },
                { status: 403 }
            );
        }

        // 4. Create and add the new card
        // The card schema expects `term` and `definition`, which matches our validation.
        const newCard = {
            term: term.trim(),
            definition: definition.trim(),
        };

        // Add the new card to the 'cards' array in the set
        set.cards.push(newCard);

        // Save the updated set document
        await set.save();

        // Retrieve the card we just added. It will be the last one in the array.
        // This is useful because it now includes the auto-generated `_id` from MongoDB.
        const createdCard = set.cards[set.cards.length - 1];

        // 5. Respond with the newly created card and a 201 status
        return NextResponse.json(createdCard, { status: 201 }); // 201 Created

    } catch (error: any) {
        console.error("Error adding manual flashcard:", error);

        // Handle potential JSON parsing errors
        if (error instanceof SyntaxError) {
            return NextResponse.json({ message: "Nieprawidłowy format danych JSON." }, { status: 400 });
        }

        return NextResponse.json({
            message: "Wystąpił wewnętrzny błąd serwera podczas dodawania fiszki."
        }, { status: 500 });
    }
}