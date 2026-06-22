import { notFound, redirect } from 'next/navigation';

// Server-side imports for secure data fetching
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectMongoDB } from '@/lib/mongodb';
// Import the Exam model and the IExam interface
import ExamModel, { IExam } from '@/models/exam';

// Import the client component
import LearnPageClient from '@/components/exams/LearnPageClient';

// ============================================================================
// TYPE DEFINITIONS (Unchanged)
// ============================================================================
interface LearnExamPageProps {
    params: { id: string };
}

// ============================================================================
// PAGE COMPONENT (SERVER COMPONENT - CORRECTED)
// ============================================================================
export default async function LearnExamPage({ params }: LearnExamPageProps) {
    const { id } = params;

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        redirect('/');
    }

    await connectMongoDB();

    // FIX: Use .lean<IExam>() to get a properly typed plain JavaScript object.
    // This explicitly tells TypeScript that the result will have the shape of IExam (or be null),
    // which resolves the "Property does not exist" errors.
    const exam = await ExamModel.findById(id).lean<IExam>();

    // 1. First, check if the exam exists at all.
    if (!exam) {
        notFound();
    }

    // 2. Next, check for permission. A user can access the exam if it is public
    //    OR if they are the owner of the exam.
    const isOwner = exam.user?.toString() === session.user.id;
    const isPublic = exam.isPublic === true;

    if (!isPublic && !isOwner) {
        // If the exam is NOT public and the user is NOT the owner, deny access.
        notFound();
    }

    // Calculate total points on the server
    const totalPoints = exam.questions.reduce((sum: number, q: any) => {
        const points = parseInt(q.points?.split('-').pop() || '0', 10);
        return sum + (isNaN(points) ? 0 : points);
    }, 0);

    // The Server Component's only job is to fetch data and pass it
    // to the Client Component. JSON.stringify ensures the object is serializable.
    return (
        <LearnPageClient
            exam={JSON.parse(JSON.stringify(exam))}
            totalPoints={totalPoints}
        />
    );
}