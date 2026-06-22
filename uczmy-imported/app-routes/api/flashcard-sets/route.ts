import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth'
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import FlashcardSet from "@/models/flashcardSet";

// --- GET: Fetch all flashcard sets for the logged-in user ---
export async function GET() {
    // ... (no changes to this function)
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    try {
        await connectMongoDB();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const sets = await FlashcardSet.find({ user: user._id }).sort({ createdAt: -1 });

        return NextResponse.json(sets);
    } catch (error) {
        console.error("Error fetching flashcard sets:", error);
        return NextResponse.json({ message: "An error occurred while fetching sets." }, { status: 500 });
    }
}

// --- POST: Create a new flashcard set ---
export async function POST(req: Request) {
    // ... (no changes to this function)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    try {
        const { title, isPublic } = await req.json();

        if (!title || title.trim() === "") {
            return NextResponse.json({ message: "Tytuł jest wymagany." }, { status: 400 });
        }

        if (typeof isPublic !== 'boolean') {
            return NextResponse.json({ message: "Invalid 'isPublic' value provided. It must be true or false." }, { status: 400 });
        }

        await connectMongoDB();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const newSet = new FlashcardSet({
            title,
            user: user._id,
            isPublic: isPublic,
        });
        await newSet.save();


        return NextResponse.json(newSet, { status: 201 });
    } catch (error) {
        console.error("Error creating flashcard set:", error);
        return NextResponse.json({ message: "An error occurred while creating the set." }, { status: 500 });
    }
}

// --- NEW ---
// --- PATCH: Bulk update visibility of flashcard sets ---
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    try {
        const { ids, isPublic } = await req.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: "No set IDs provided for update." }, { status: 400 });
        }
        if (typeof isPublic !== 'boolean') {
            return NextResponse.json({ message: "Invalid 'isPublic' value provided." }, { status: 400 });
        }

        await connectMongoDB();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Update many sets, but crucially, ensure they belong to the logged-in user
        const result = await FlashcardSet.updateMany(
            { _id: { $in: ids }, user: user._id },
            { $set: { isPublic: isPublic } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "No matching sets found to update for this user." }, { status: 404 });
        }

        return NextResponse.json({ message: `${result.modifiedCount} sets updated successfully.` });

    } catch (error) {
        console.error("Error bulk updating flashcard sets:", error);
        return NextResponse.json({ message: "An error occurred while updating sets." }, { status: 500 });
    }
}

// --- NEW ---
// --- DELETE: Bulk delete flashcard sets ---
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    try {
        const { ids } = await req.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: "No set IDs provided for deletion." }, { status: 400 });
        }

        await connectMongoDB();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // 1. Delete the sets that match the IDs and belong to the user
        const deleteResult = await FlashcardSet.deleteMany({
            _id: { $in: ids },
            user: user._id // Security: ensures user can only delete their own sets
        });

        if (deleteResult.deletedCount === 0) {
            return NextResponse.json({ message: "No matching sets found to delete for this user." }, { status: 404 });
        }

        // 2. Remove the references to these sets from the user's document


        return NextResponse.json({ message: `${deleteResult.deletedCount} sets deleted successfully.` });

    } catch (error) {
        console.error("Error bulk deleting flashcard sets:", error);
        return NextResponse.json({ message: "An error occurred while deleting sets." }, { status: 500 });
    }
}