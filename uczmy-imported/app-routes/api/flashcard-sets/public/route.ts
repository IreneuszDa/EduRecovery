// @/app/api/flashcard-sets/public/route.ts

import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import FlashcardSet from "@/models/flashcardSet";

/**
 * @route   GET /api/flashcard-sets/public
 * @desc    Get all public flashcard sets
 * @access  Public (accessible to any logged-in user)
 */
export async function GET() {
    try {
        await connectMongoDB();

        // Find all sets where isPublic is true.
        // We use .populate() to get the creator's name for display.
        // This requires your User model to have a 'name' field.
        const publicSets = await FlashcardSet.find({ isPublic: true })
            .populate('user', 'name') // Fetches the user's name
            .sort({ createdAt: -1 });

        return NextResponse.json({ sets: publicSets });

    } catch (error) {
        console.error("Failed to fetch public flashcard sets:", error);
        return NextResponse.json({ message: 'Nie udało się pobrać publicznych zestawów fiszek.' }, { status: 500 });
    }
}