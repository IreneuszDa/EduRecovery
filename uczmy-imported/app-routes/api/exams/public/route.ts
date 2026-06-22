// @/app/api/exams/public/route.ts

import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import Exam from "@/models/exam";

/**
 * @route   GET /api/exams/public
 * @desc    Get all public exams, regardless of owner
 * @access  Public (accessible to any logged-in user)
 */
export async function GET() {
    try {
        await connectMongoDB();

        // Find all exams where isPublic is true.
        // We also use .populate() to get the creator's name for display.
        // Ensure your User model has a 'name' field.
        const publicExams = await Exam.find({ isPublic: true })
            .populate('user', 'name') // <-- Fetches user's name
            .sort({ createdAt: -1 });

        return NextResponse.json({ exams: publicExams });

    } catch (error) {
        console.error("Failed to fetch public exams:", error);
        return NextResponse.json({ message: 'Nie udało się pobrać publicznych egzaminów.' }, { status: 500 });
    }
}