// @/app/api/exams/[id]/route.ts

import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Exam from "@/models/exam";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth'

interface Params {
    id: string;
}

/**
 * @route   GET /api/exams/[id]
 * @desc    Get a single exam by ID
 * @access  Protected - User must be the owner of the exam
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const { id } = params;
        await connectMongoDB();

        const exam = await Exam.findById(id);

        if (!exam) {
            return NextResponse.json({ message: "Exam not found" }, { status: 404 });
        }

        // SECURITY: Check if the logged-in user is the owner of the exam
        if (exam.user.toString() !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({ exam });

    } catch (error) {
        console.error("GET /api/exams/[id] Error:", error);
        return NextResponse.json({ message: "An error occurred while fetching the exam." }, { status: 500 });
    }
}

/**
 * @route   PATCH /api/exams/[id]
 * @desc    Update an exam (title, subject, questions, visibility, etc.)
 * @access  Protected - User must be the owner of the exam
 */
export async function PATCH(request: NextRequest, { params }: { params: Params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json(); // Get all update data from the body

        await connectMongoDB();

        const examToUpdate = await Exam.findById(id);

        if (!examToUpdate) {
            return NextResponse.json({ message: "Exam not found for update" }, { status: 404 });
        }

        // SECURITY: Check if the logged-in user is the owner of the exam
        if (examToUpdate.user.toString() !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const updatedExam = await Exam.findByIdAndUpdate(id, body, { new: true, runValidators: true });

        return NextResponse.json({ message: "Exam updated successfully", exam: updatedExam }, { status: 200 });

    } catch (error) {
        console.error("PATCH /api/exams/[id] Error:", error);
        return NextResponse.json({ message: "An error occurred while updating the exam." }, { status: 500 });
    }
}


/**
 * @route   DELETE /api/exams/[id]
 * @desc    Delete an exam by ID
 * @access  Protected - User must be the owner of the exam
 */
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const { id } = params;
        await connectMongoDB();

        const examToDelete = await Exam.findById(id);

        if (!examToDelete) {
            return NextResponse.json({ message: "Exam not found" }, { status: 404 });
        }

        // SECURITY: Check if the logged-in user is the owner of the exam
        if (examToDelete.user.toString() !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await Exam.findByIdAndDelete(id);

        return NextResponse.json({ message: "Exam deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("DELETE /api/exams/[id] Error:", error);
        return NextResponse.json({ message: "An error occurred while deleting the exam." }, { status: 500 });
    }
}