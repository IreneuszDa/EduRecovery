// @/app/api/reports/generate/route.ts
// API endpoint for generating progress reports (PDF)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectMongoDB } from '@/lib/mongodb';
import { UserRoles } from '@/lib/rbac';
import { getSchoolContext } from '@/lib/multiTenancy';
import ProgressReport from '@/models/progressReport';
import User from '@/models/user';
import Lesson from '@/models/lesson';
import Homework from '@/models/homework';

// POST - Generate a new progress report
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Nie jesteś zalogowany.' }, { status: 401 });
        }

        // Parents can request reports for their children
        // Teachers can generate reports for their students
        const isParent = session.user.profileType === UserRoles.PARENT;
        const isTeacher = session.user.profileType === UserRoles.TEACHER;

        if (!isParent && !isTeacher) {
            return NextResponse.json({
                error: 'Tylko rodzice i nauczyciele mogą generować raporty.'
            }, { status: 403 });
        }

        const userId = session.user.id;
        if (!userId) {
            return NextResponse.json({ error: 'Brak ID użytkownika.' }, { status: 401 });
        }

        const schoolId = await getSchoolContext(userId);
        if (!schoolId) {
            return NextResponse.json({ error: 'Nie należysz do żadnej szkoły.' }, { status: 403 });
        }

        await connectMongoDB();

        const body = await request.json();
        const { studentId, periodStart, periodEnd, reportType } = body;

        if (!studentId) {
            return NextResponse.json({ error: 'ID ucznia jest wymagany.' }, { status: 400 });
        }

        // Verify access to student
        const student = await User.findOne({
            _id: studentId,
            school: schoolId,
            profileType: UserRoles.STUDENT,
        });

        if (!student) {
            return NextResponse.json({ error: 'Nie znaleziono ucznia.' }, { status: 404 });
        }

        // For parents, verify they are the parent of this student
        if (isParent) {
            const parent = await User.findById(session.user.id);
            if (!parent?.children?.includes(studentId)) {
                return NextResponse.json({
                    error: 'Nie masz dostępu do tego ucznia.'
                }, { status: 403 });
            }
        }

        // Calculate date range
        const start = periodStart ? new Date(periodStart) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = periodEnd ? new Date(periodEnd) : new Date();

        // Gather data for the report
        const lessons = await Lesson.find({
            school: schoolId,
            date: { $gte: start, $lte: end },
            'attendance.student': studentId,
        }).populate('class', 'name subject');

        const homeworks = await Homework.find({
            school: schoolId,
            deadline: { $gte: start, $lte: end },
            'submissions.student': studentId,
        });

        // Calculate statistics
        let totalLessons = 0;
        let attendedLessons = 0;
        let totalHomework = homeworks.length;
        let completedHomework = 0;
        let totalScore = 0;
        let gradedHomework = 0;
        const topicsCovered: string[] = [];
        const subjectProgress: any[] = [];

        // Process lessons
        lessons.forEach((lesson: any) => {
            totalLessons++;
            const attendance = lesson.attendance?.find(
                (a: any) => a.student?.toString() === studentId
            );
            if (attendance?.present) {
                attendedLessons++;
            }
            if (lesson.topic && !topicsCovered.includes(lesson.topic)) {
                topicsCovered.push(lesson.topic);
            }
        });

        // Process homework
        homeworks.forEach((hw: any) => {
            const submission = hw.submissions?.find(
                (s: any) => s.student?.toString() === studentId
            );
            if (submission?.isCompleted) {
                completedHomework++;
            }
            if (submission?.totalScore !== undefined) {
                totalScore += submission.totalScore;
                gradedHomework++;
            }
        });

        // Calculate percentages
        const overallAttendance = totalLessons > 0
            ? Math.round((attendedLessons / totalLessons) * 100)
            : 100;
        const overallHomeworkCompletion = totalHomework > 0
            ? Math.round((completedHomework / totalHomework) * 100)
            : 100;
        const overallAverageScore = gradedHomework > 0
            ? Math.round(totalScore / gradedHomework)
            : 0;

        // Create the report
        const report = await ProgressReport.create({
            student: studentId,
            school: schoolId,
            parent: isParent ? session.user.id : undefined,
            periodStart: start,
            periodEnd: end,
            reportType: reportType || 'monthly',
            overallAttendance,
            overallHomeworkCompletion,
            overallAverageScore,
            currentStreak: student.currentStreak || 0,
            totalPoints: student.totalPoints || 0,
            subjectProgress,
            achievements: [],
            levelReached: Math.floor((student.totalPoints || 0) / 100) + 1,
            pdfGenerated: false,
            sharedWithParent: isParent,
            sharedAt: isParent ? new Date() : undefined,
            generatedBy: isParent ? 'parent_request' : 'teacher',
        });

        // TODO: Generate actual PDF using a library like pdfkit or puppeteer
        // For now, we return the report data that can be rendered client-side

        return NextResponse.json({
            success: true,
            report: {
                id: report._id,
                studentName: student.name,
                periodStart: start,
                periodEnd: end,
                overallAttendance,
                overallHomeworkCompletion,
                overallAverageScore,
                currentStreak: student.currentStreak || 0,
                totalPoints: student.totalPoints || 0,
                topicsCovered,
                lessonsTotal: totalLessons,
                lessonsAttended: attendedLessons,
                homeworkTotal: totalHomework,
                homeworkCompleted: completedHomework,
            },
        }, { status: 201 });

    } catch (error) {
        console.error('[REPORTS_GENERATE] Error:', error);
        return NextResponse.json({ error: 'Wystąpił błąd.' }, { status: 500 });
    }
}

// GET - List reports for a student
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Nie jesteś zalogowany.' }, { status: 401 });
        }

        const userId = session.user.id;
        if (!userId) {
            return NextResponse.json({ error: 'Brak ID użytkownika.' }, { status: 401 });
        }

        const schoolId = await getSchoolContext(userId);
        if (!schoolId) {
            return NextResponse.json({ error: 'Nie należysz do żadnej szkoły.' }, { status: 403 });
        }

        await connectMongoDB();

        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get('studentId');

        let query: any = { school: schoolId };

        // Filter by role
        if (session.user.profileType === UserRoles.PARENT) {
            query.parent = session.user.id;
            query.sharedWithParent = true;
        } else if (session.user.profileType === UserRoles.STUDENT) {
            query.student = session.user.id;
        } else if (studentId) {
            query.student = studentId;
        }

        const reports = await ProgressReport.find(query)
            .populate('student', 'name')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        return NextResponse.json({
            success: true,
            reports,
        });

    } catch (error) {
        console.error('[REPORTS_GET] Error:', error);
        return NextResponse.json({ error: 'Wystąpił błąd.' }, { status: 500 });
    }
}
