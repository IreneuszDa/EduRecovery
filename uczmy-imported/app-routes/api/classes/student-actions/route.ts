import { NextResponse, NextRequest } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import Class from "@/models/class";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth'
// Change the mongoose import to get the 'Types' namespace for clarity
import mongoose, { Types } from 'mongoose';

// --- Best Practice: Define an interface for your lean document ---
// This tells TypeScript the exact shape of the plain JavaScript object
// you expect from the database after calling .lean()
interface ILeanClass {
    _id: Types.ObjectId;
    students: Types.ObjectId[];
    // You can add other properties like name, subject etc. if you need them
}

/**
 * @route   POST /api/classes/student-actions
 * @desc    Allows a student to join or leave a class
 * @access  Protected (Student only)
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id || session.user.profileType === 1) {
            return NextResponse.json({ message: "Not authorized for this action" }, { status: 403 });
        }

        const studentId = session.user.id;
        const body = await request.json();
        const { action, joinCode, classId } = body;

        await connectMongoDB();

        // Use the imported 'Types' namespace for clarity
        const studentObjectId = new Types.ObjectId(studentId);

        if (action === 'JOIN') {
            if (!joinCode) {
                return NextResponse.json({ message: "Join code is required" }, { status: 400 });
            }

            // --- FIX: Use .lean<T>() to get a correctly typed plain object ---
            // This explicitly tells TypeScript that the result will match the ILeanClass interface.
            const classToJoin = await Class.findOne({ joinCode: joinCode.toUpperCase() }).lean<ILeanClass>();

            if (!classToJoin) {
                return NextResponse.json({ message: "Nie znaleziono klasy o podanym kodzie." }, { status: 404 });
            }

            // Now, TypeScript correctly knows `classToJoin.students` is `Types.ObjectId[]`,
            // so the .some() method works without any type errors.
            if (classToJoin.students.some(id => id.equals(studentObjectId))) {
                return NextResponse.json({ message: "Jesteś już w tej klasie." }, { status: 409 });
            }

            // Use the original _id from the lean document for the update
            await Class.updateOne({ _id: classToJoin._id }, { $addToSet: { students: studentObjectId } });

            return NextResponse.json({ success: true, message: "Pomyślnie dołączono do klasy." }, { status: 200 });

        } else if (action === 'LEAVE') {
            if (!classId) {
                return NextResponse.json({ message: "Class ID is required" }, { status: 400 });
            }

            await Class.updateOne({ _id: classId }, { $pull: { students: studentObjectId } });

            return NextResponse.json({ success: true, message: "Pomyślnie opuszczono klasę." }, { status: 200 });

        } else {
            return NextResponse.json({ message: "Invalid action." }, { status: 400 });
        }

    } catch (error) {
        console.error("Student action error:", error);
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}