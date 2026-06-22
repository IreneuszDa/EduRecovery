import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { testAnimationRendering } from '@/lib/animate/animation-test';

/**
 * Test API route for manually triggering animation rendering
 * This is useful for debugging animation generation issues
 */
export async function POST(req: NextRequest) {
    try {
        // Verify authentication (only allow admins in production)
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the prompt from the request
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Test the animation rendering
        const result = await testAnimationRendering(prompt);

        // Return the result
        return NextResponse.json({
            success: true,
            videoUrl: result
        });
    } catch (error) {
        console.error('Error in test animation API route:', error);
        return NextResponse.json({
            error: 'Failed to render test animation',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
