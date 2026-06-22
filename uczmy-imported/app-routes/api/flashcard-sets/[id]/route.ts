import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import FlashcardSet from "@/models/flashcardSet";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth'

// --- GET: Fetch a single flashcard set by its ID ---
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Brak autoryzacji" }, { status: 401 });
    }
    const userId = session.user.id;

    try {
        await connectMongoDB();
        const { id } = params;
        const set = await FlashcardSet.findById(id);

        if (!set) {
            return NextResponse.json({ message: "Nie znaleziono zestawu fiszek." }, { status: 404 });
        }

        // Security Check: Ensure the user owns the set OR the set is public
        if (set.user.toString() !== userId && !set.isPublic) {
            return NextResponse.json({ message: "Brak uprawnień do wyświetlenia tego zestawu." }, { status: 403 });
        }

        return NextResponse.json(set, { status: 200 });

    } catch (error) {
        console.error("Error fetching single set:", error);
        return NextResponse.json({ message: "Wystąpił wewnętrzny błąd serwera." }, { status: 500 });
    }
}


// --- PATCH: Update a flashcard set (e.g., title, isPublic) ---
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Brak autoryzacji" }, { status: 401 });
    }
    const userId = session.user.id;

    try {
        await connectMongoDB();
        const { id } = params;
        const body = await request.json();

        const set = await FlashcardSet.findById(id);

        if (!set) {
            return NextResponse.json({ message: "Nie znaleziono zestawu." }, { status: 404 });
        }

        // Security Check: Only the owner can update the set
        if (set.user.toString() !== userId) {
            return NextResponse.json({ message: "Brak uprawnień do edycji tego zestawu." }, { status: 403 });
        }

        // Update fields if they exist in the request body
        if (typeof body.isPublic === 'boolean') {
            set.isPublic = body.isPublic;
        }
        if (typeof body.title === 'string' && body.title.trim() !== '') {
            set.title = body.title.trim();
        }

        const updatedSet = await set.save();
        return NextResponse.json(updatedSet, { status: 200 });

    } catch (error) {
        console.error("Error updating set:", error);
        return NextResponse.json({ message: "Wystąpił wewnętrzny błąd serwera." }, { status: 500 });
    }
}

// --- DELETE: Delete a flashcard set ---
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Brak autoryzacji" }, { status: 401 });
    }
    const userId = session.user.id;

    try {
        await connectMongoDB();
        const { id } = params;

        const set = await FlashcardSet.findById(id);

        if (!set) {
            return NextResponse.json({ message: "Nie znaleziono zestawu." }, { status: 404 });
        }

        // Security Check: Only the owner can delete the set
        if (set.user.toString() !== userId) {
            return NextResponse.json({ message: "Brak uprawnień do usunięcia tego zestawu." }, { status: 403 });
        }

        await FlashcardSet.findByIdAndDelete(id);



        return NextResponse.json({ message: "Zestaw został usunięty." }, { status: 200 });

    } catch (error) {
        console.error("Error deleting set:", error);
        return NextResponse.json({ message: "Wystąpił wewnętrzny błąd serwera." }, { status: 500 });
    }
}