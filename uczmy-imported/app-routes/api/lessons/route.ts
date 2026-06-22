// @/app/api/lessons/route.ts
// API endpoint for lesson CRUD operations

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectMongoDB } from '@/lib/mongodb';
import { withRoles, UserRoles } from '@/lib/rbac';
import { getSchoolContext, withSchoolFilter } from '@/lib/multiTenancy';
import Lesson from '@/models/lesson';
import Class from '@/models/class';

// GET - List lessons (filtered by school and optionally by class)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Nie jesteś zalogowany.' }, { status: 401 });
        }

        // Only teachers can access lessons
        if (session.user.profileType !== UserRoles.TEACHER) {
            return NextResponse.json({ error: 'Brak uprawnień.' }, { status: 403 });
        }

        const schoolId = await getSchoolContext(session.user.id);
        if (!schoolId) {
            return NextResponse.json({ error: 'Nie należysz do żadnej szkoły.' }, { status: 403 });
        }

        await connectMongoDB();

        const { searchParams } = new URL(request.url);
        const classId = searchParams.get('classId');
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');

        // Build query with school filter
        const query = withSchoolFilter(
            { teacher: session.user.id },
            schoolId
        );

        if (classId) {
            query.class = classId;
        }

        const lessons = await Lesson.find(query)
            .populate('class', 'name subject')
            .sort({ date: -1 })
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();

        const total = await Lesson.countDocuments(query);

        return NextResponse.json({
            success: true,
            lessons,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (error) {
        console.error('[LESSONS_GET] Error:', error);
        return NextResponse.json({ error: 'Wystąpił błąd.' }, { status: 500 });
    }
}

// POST - Create new lesson entry
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Nie jesteś zalogowany.' }, { status: 401 });
        }

        if (session.user.profileType !== UserRoles.TEACHER) {
            return NextResponse.json({ error: 'Brak uprawnień.' }, { status: 403 });
        }

        const schoolId = await getSchoolContext(session.user.id);
        if (!schoolId) {
            return NextResponse.json({ error: 'Nie należysz do żadnej szkoły.' }, { status: 403 });
        }

        await connectMongoDB();

        const body = await request.json();
        const { classId, date, duration, topic, topicDetails, attendance, privateNotes, parentSummary } = body;

        // Validate required fields
        if (!classId || !date || !topic) {
            return NextResponse.json({
                error: 'Klasa, data i temat są wymagane.'
            }, { status: 400 });
        }

        // Verify class belongs to this school and teacher
        const classDoc = await Class.findOne({
            _id: classId,
            school: schoolId,
            teacher: session.user.id,
        });

        if (!classDoc) {
            return NextResponse.json({ error: 'Nie znaleziono klasy.' }, { status: 404 });
        }

        // Create lesson
        const lesson = await Lesson.create({
            class: classId,
            teacher: session.user.id,
            school: schoolId,
            date: new Date(date),
            duration: duration || 45,
            topic,
            topicDetails,
            attendance: attendance || [],
            privateNotes,
            parentSummary,
        });

        return NextResponse.json({
            success: true,
            lesson,
        }, { status: 201 });

    } catch (error) {
        console.error('[LESSONS_POST] Error:', error);
        return NextResponse.json({ error: 'Wystąpił błąd.' }, { status: 500 });
    }
}
