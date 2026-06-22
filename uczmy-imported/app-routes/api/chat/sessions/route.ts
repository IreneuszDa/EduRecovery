import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'
import { connectMongoDB } from '@/lib/mongodb';
import ChatSession from '@/models/chatSession';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        await connectMongoDB();

        const sessions = await ChatSession.find({ user: session.user.id })
            .select('title createdAt')
            .sort({ updatedAt: -1 }) // Show most recent first
            .lean();

        return NextResponse.json(sessions);

    } catch (error) {
        console.error('[GET_CHAT_SESSIONS_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}