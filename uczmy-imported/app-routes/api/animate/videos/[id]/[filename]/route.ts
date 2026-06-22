import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createReadStream } from 'fs';

/**
 * API route to serve the rendered Manim videos and voice-over scripts
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string, filename: string } }
) {
    try {
        const { id, filename } = params;

        // Security check to prevent directory traversal attacks
        if (filename.includes('..') || id.includes('..')) {
            return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
        }

        // Construct the path to the file
        const filePath = path.join(
            process.cwd(),
            'tmp',
            id,
            filename
        );

        // Check if the file exists
        try {
            await fs.access(filePath);
        } catch (error) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Determine content type based on filename
        let contentType = 'video/mp4';
        if (filename.endsWith('.json')) {
            contentType = 'application/json';
        }

        // Read the file as binary
        const fileBuffer = await fs.readFile(filePath);
        const arrayBuffer = new Uint8Array(fileBuffer).buffer;

        // Return the file with appropriate content type
        return new NextResponse(arrayBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${filename}"`,
                'Cache-Control': 'public, max-age=31536000', // 1 year cache for better performance
            },
        });
    } catch (error) {
        console.error('Error serving file:', error);
        return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
    }
}
