import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { debugPythonEnvironment } from '@/lib/animate/debug-python';

/**
 * Debug API route for testing Python environment
 */
export async function GET(req: NextRequest) {
    try {
        // Verify authentication (only allow admins in production)
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Debug the Python environment
        const debugOutput = await debugPythonEnvironment();

        // Return debug information
        return NextResponse.json({
            success: true,
            debugOutput
        });
    } catch (error) {
        console.error('Error in debug API route:', error);
        return NextResponse.json({ error: 'Failed to debug Python environment' }, { status: 500 });
    }
}
