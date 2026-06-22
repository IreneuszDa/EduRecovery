// @/app/api/exams/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import Exam from "@/models/exam";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth'

// ============================================================================
//  EXISTING HANDLERS (Unchanged)
// ============================================================================

// GET handler to fetch ONLY the logged-in user's exams
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }
        const userId = session.user.id;
        await connectMongoDB();
        const exams = await Exam.find({ user: userId }).sort({ createdAt: -1 });
        return NextResponse.json({ exams });
    } catch (error) {
        console.error("Failed to fetch exams:", error);
        return NextResponse.json({ message: 'Nie udało się pobrać egzaminów.' }, { status: 500 });
    }
}

// POST handler to create a new blank exam associated with the logged-in user
export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }
        const userId = session.user.id;
        await connectMongoDB();
        const newExam = new Exam({
            title: 'Nowy egzamin bez tytułu',
            subject: 'Przedmiot',
            isPublic: false,
            user: userId, // <-- Associate exam with user
            questions: [],
        });
        await newExam.save();
        return NextResponse.json(
            { success: true, message: 'Exam created successfully', exam: newExam },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Failed to create exam:", error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }
        return NextResponse.json(
            { success: false, message: 'Wystąpił błąd serwera podczas tworzenia egzaminu.' },
            { status: 500 }
        );
    }
}


// ============================================================================
//  NEW HANDLERS FOR BULK ACTIONS (Required for Selection Bar)
// ============================================================================

/**
 * @route   PATCH /api/exams
 * @desc    Update multiple exams (e.g., change visibility)
 * @access  Protected - User must be the owner of the exams
 */
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const { ids, isPublic } = body;

        // Basic validation
        if (!Array.isArray(ids) || ids.length === 0 || typeof isPublic !== 'boolean') {
            return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
        }

        await connectMongoDB();

        // SECURITY: Update only the exams that belong to the logged-in user.
        const result = await Exam.updateMany(
            { _id: { $in: ids }, user: userId },
            { $set: { isPublic: isPublic } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "No matching exams found to update or not authorized." }, { status: 404 });
        }

        return NextResponse.json({ message: `Successfully updated ${result.modifiedCount} exams.`, data: result }, { status: 200 });
    } catch (error) {
        console.error("PATCH /api/exams (bulk) Error:", error);
        return NextResponse.json({ message: "An error occurred while bulk-updating exams." }, { status: 500 });
    }
}


/**
 * @route   DELETE /api/exams
 * @desc    Delete multiple exams by their IDs
 * @access  Protected - User must be the owner of the exams
 */
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const { ids } = body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: "Invalid request body: 'ids' must be a non-empty array." }, { status: 400 });
        }

        await connectMongoDB();

        // SECURITY: Delete only the exams that belong to the logged-in user.
        const result = await Exam.deleteMany({ _id: { $in: ids }, user: userId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "No exams found to delete or not authorized." }, { status: 404 });
        }

        return NextResponse.json({ message: `Successfully deleted ${result.deletedCount} exams.` }, { status: 200 });
    } catch (error) {
        console.error("DELETE /api/exams (bulk) Error:", error);
        return NextResponse.json({ message: "An error occurred while bulk-deleting exams." }, { status: 500 });
    }
}