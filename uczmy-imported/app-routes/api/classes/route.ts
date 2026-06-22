import { NextResponse, NextRequest } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import Class from "@/models/class";
import User from '@/models/user'; // Import User model
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth'
import mongoose from 'mongoose';

const generateJoinCode = (length = 6) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * @route   GET /api/classes
 * @desc    Fetch classes for the logged-in user (teacher's own, or student's joined)
 * @access  Protected
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const profileType = session.user.profileType;

        await connectMongoDB();

        let classDocs;

        if (profileType === 1) { // Teacher
            classDocs = await Class.find({ teacher: userId }).sort({ createdAt: -1 }).lean();
        } else { // Student
            classDocs = await Class.find({ students: userId })
                .sort({ createdAt: -1 })
                .populate({ path: 'teacher', model: User, select: 'name' }) // Populate teacher's name
                .lean();
        }

        const classes = classDocs.map((doc: any) => ({
            _id: doc._id.toString(),
            name: doc.name,
            subject: doc.subject,
            createdAt: doc.createdAt.toISOString(),
            joinCode: doc.joinCode,
            studentCount: doc.students.length,
            // For students, add teacher's name to the response
            teacherName: doc.teacher?.name || null,
        }));

        return NextResponse.json({ classes });
    } catch (error) {
        console.error("Failed to fetch classes:", error);
        return NextResponse.json({ message: 'Nie udało się pobrać klas.' }, { status: 500 });
    }
}

/**
 * @route   POST /api/classes
 * @desc    Create a new blank class (Teacher only)
 * @access  Protected (Teacher only)
 */
export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id || session.user.profileType !== 1) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const teacherId = session.user.id;
        await connectMongoDB();

        let joinCode;
        let isCodeUnique = false;
        while (!isCodeUnique) {
            joinCode = generateJoinCode();
            const existingClass = await Class.findOne({ joinCode });
            if (!existingClass) isCodeUnique = true;
        }

        const newClass = new Class({
            name: 'Nowa klasa bez nazwy',
            subject: 'Przedmiot',
            teacher: teacherId,
            students: [],
            joinCode: joinCode,
        });

        await newClass.save();

        const responseClass = {
            _id: (newClass._id as mongoose.Types.ObjectId).toString(),
            name: newClass.name,
            subject: newClass.subject,
            createdAt: newClass.createdAt.toISOString(),
            joinCode: newClass.joinCode,
            studentCount: 0,
        };

        return NextResponse.json({ success: true, class: responseClass }, { status: 201 });
    } catch (error) {
        console.error("Failed to create class:", error);
        return NextResponse.json({ message: 'Wystąpił błąd serwera.' }, { status: 500 });
    }
}

/**
 * @route   DELETE /api/classes
 * @desc    Delete multiple classes by their IDs (Teacher only)
 * @access  Protected (Teacher only)
 */
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id || session.user.profileType !== 1) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const teacherId = session.user.id;
        const body = await request.json();
        const { ids } = body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
        }

        await connectMongoDB();

        const result = await Class.deleteMany({ _id: { $in: ids }, teacher: teacherId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "No classes found to delete or not authorized." }, { status: 404 });
        }

        return NextResponse.json({ message: `Successfully deleted ${result.deletedCount} classes.` }, { status: 200 });
    } catch (error) {
        console.error("DELETE /api/classes (bulk) Error:", error);
        return NextResponse.json({ message: "An error occurred." }, { status: 500 });
    }
}