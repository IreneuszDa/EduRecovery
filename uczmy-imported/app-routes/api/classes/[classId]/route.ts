import { NextResponse, NextRequest } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import Class from "@/models/class";
import User from '@/models/user';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth'

// Define the type for the route parameters
interface RouteParams {
    params: {
        classId: string;
    };
}

/**
 * @route   GET /api/classes/[classId]
 * @desc    Fetch a single class by ID, accessible by its teacher or a member student
 * @access  Protected
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        // Security Check: User must be logged in.
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const profileType = session.user.profileType;
        const { classId } = params;

        if (!classId) {
            return NextResponse.json({ message: "Class ID is required" }, { status: 400 });
        }

        await connectMongoDB();

        // SECURITY: Build a query that finds the class AND verifies the user is either the owner (teacher) or a member (student).
        const query = {
            _id: classId,
            $or: [
                { teacher: userId },
                { students: userId }
            ]
        };

        // Find the class and populate the teacher's name from the User collection.
        const classDoc = await Class.findOne(query)
            .populate({
                path: 'teacher',
                model: User,
                select: 'name' // Only select the 'name' field
            })
            .lean(); // Use .lean() for faster, plain object results

        if (!classDoc) {
            // This message is intentionally generic for security.
            return NextResponse.json({ message: "Class not found or you don't have access." }, { status: 404 });
        }

        // Format the response for the frontend
        const responseClass = {
            _id: classDoc._id.toString(),
            name: classDoc.name,
            subject: classDoc.subject,
            // Conditionally return the join code only if the user is the teacher
            joinCode: profileType === 1 ? classDoc.joinCode : undefined,
            // Provide the teacher's name for the student's view
            // FIX: Cast to 'unknown' first to bypass the strict type check, then to the expected populated type.
            teacherName: ((classDoc.teacher as unknown) as { name: string })?.name || null,
        };

        return NextResponse.json({ success: true, class: responseClass });

    } catch (error) {
        console.error(`GET /api/classes/${params.classId} Error:`, error);
        return NextResponse.json({ message: "An error occurred while fetching the class." }, { status: 500 });
    }
}


/**
 * @route   PATCH /api/classes/[classId]
 * @desc    Update a class's details (name, subject)
 * @access  Protected - Teacher must be the owner
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        // Security Check: User must be a logged-in teacher
        if (!session || !session.user?.id || session.user.profileType !== 1) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const teacherId = session.user.id;
        const { classId } = params;
        const body = await request.json();
        const { name, subject } = body;

        // Validation
        if (!name || !subject) {
            return NextResponse.json({ message: "Name and subject are required fields." }, { status: 400 });
        }

        await connectMongoDB();

        // SECURITY: Update the class only if the teacher is the owner.
        const updatedClass = await Class.findOneAndUpdate(
            { _id: classId, teacher: teacherId }, // Filter by ID and owner
            { $set: { name, subject } }, // Data to update
            { new: true, runValidators: true } // Options: return updated doc, run schema validation
        );

        if (!updatedClass) {
            return NextResponse.json({ message: "Class not found or you are not the owner." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Class updated successfully.", class: updatedClass });

    } catch (error: any) {
        console.error(`PATCH /api/classes/${params.classId} Error:`, error);
        if (error.name === 'ValidationError') {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }
        return NextResponse.json({ message: "An error occurred while updating the class." }, { status: 500 });
    }
}


/**
 * @route   DELETE /api/classes/[classId]
 * @desc    Delete a single class
 * @access  Protected - Teacher must be the owner
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        // Security Check: User must be a logged-in teacher
        if (!session || !session.user?.id || session.user.profileType !== 1) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const teacherId = session.user.id;
        const { classId } = params;

        await connectMongoDB();

        // SECURITY: Delete the class only if the teacher is the owner.
        const result = await Class.deleteOne({ _id: classId, teacher: teacherId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Class not found or you are not authorized to delete it." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Class deleted successfully." }, { status: 200 });

    } catch (error) {
        console.error(`DELETE /api/classes/${params.classId} Error:`, error);
        return NextResponse.json({ message: "An error occurred while deleting the class." }, { status: 500 });
    }
}