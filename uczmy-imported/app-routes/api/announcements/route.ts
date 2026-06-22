// @/app/api/announcements/route.ts
// API endpoint for announcement CRUD operations

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectMongoDB } from '@/lib/mongodb';
import { UserRoles } from '@/lib/rbac';
import { getSchoolContext, withSchoolFilter } from '@/lib/multiTenancy';
import Announcement from '@/models/announcement';

// GET - List announcements
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Nie jesteś zalogowany.' }, { status: 401 });
        }

        const schoolId = await getSchoolContext(session.user.id);
        if (!schoolId) {
            return NextResponse.json({ error: 'Nie należysz do żadnej szkoły.' }, { status: 403 });
        }

        await connectMongoDB();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');
        const unreadOnly = searchParams.get('unread') === 'true';

        // Build query based on user role
        let query: any = withSchoolFilter({ isActive: true }, schoolId);

        // Filter by target audience based on role
        const role = session.user.profileType;
        if (role === UserRoles.PARENT) {
            query.targetAudience = { $in: ['all', 'parents'] };
        } else if (role === UserRoles.STUDENT) {
            query.targetAudience = { $in: ['all', 'students'] };
        }

        // For unread filter (parents/students)
        if (unreadOnly && role !== UserRoles.TEACHER) {
            query['readBy.user'] = { $ne: session.user.id };
        }

        const announcements = await Announcement.find(query)
            .populate('author', 'name')
            .populate('class', 'name')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();

        // Add isRead flag for non-teachers
        const enrichedAnnouncements = announcements.map((ann: any) => ({
            ...ann,
            isRead: role === UserRoles.TEACHER ? true :
                ann.readBy?.some((r: any) => r.user?.toString() === session.user.id),
        }));

        const total = await Announcement.countDocuments(query);

        return NextResponse.json({
            success: true,
            announcements: enrichedAnnouncements,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (error) {
        console.error('[ANNOUNCEMENTS_GET] Error:', error);
        return NextResponse.json({ error: 'Wystąpił błąd.' }, { status: 500 });
    }
}

// POST - Create announcement (teachers only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Nie jesteś zalogowany.' }, { status: 401 });
        }

        if (session.user.profileType !== UserRoles.TEACHER) {
            return NextResponse.json({ error: 'Tylko nauczyciele mogą tworzyć ogłoszenia.' }, { status: 403 });
        }

        const schoolId = await getSchoolContext(session.user.id);
        if (!schoolId) {
            return NextResponse.json({ error: 'Nie należysz do żadnej szkoły.' }, { status: 403 });
        }

        await connectMongoDB();

        const body = await request.json();
        const { title, content, priority, targetAudience, classId, sendEmail } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Tytuł i treść są wymagane.' }, { status: 400 });
        }

        const announcement = await Announcement.create({
            school: schoolId,
            class: classId || null,
            author: session.user.id,
            title,
            content,
            priority: priority || 'normal',
            targetAudience: targetAudience || 'all',
            isActive: true,
        });

        // TODO: Send email notifications if sendEmail is true
        if (sendEmail) {
            console.log('[ANNOUNCEMENTS] Email notification requested for:', announcement._id);
            // Implement email sending logic here
        }

        return NextResponse.json({
            success: true,
            announcement,
        }, { status: 201 });

    } catch (error) {
        console.error('[ANNOUNCEMENTS_POST] Error:', error);
        return NextResponse.json({ error: 'Wystąpił błąd.' }, { status: 500 });
    }
}
