// FILE: app/api/drive/folders/route.ts
// STATUS: FIXED

import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getAuthenticatedClient } from '@/lib/google';
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth';
import { connectMongoDB } from '@/lib/mongodb';
import User, { IUser } from '@/models/user';

export async function GET() {
    const client = await getAuthenticatedClient(authOptions);

    if (!client) {
        return NextResponse.json({ error: "Authorization Required" }, { status: 401 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "User session not found." }, { status: 401 });
    }

    try {
        await connectMongoDB();

        // --- FIX: Explicitly type the result of the .lean() query ---
        // This tells TypeScript what to expect, solving potential type errors.
        const user = await User.findById(session.user.id)
            .select('googleDrive.driveEmail')
            .lean<IUser | null>();

        const driveEmail = user?.googleDrive?.driveEmail || null;

        const drive = google.drive({ version: 'v3', auth: client });

        const response = await drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder' and trashed = false",
            fields: 'files(id, name)',
            orderBy: 'name',
            pageSize: 100,
        });

        // Return a structured object with both folders and the user's email.
        return NextResponse.json({
            folders: response.data.files || [],
            driveEmail: driveEmail
        });

    } catch (error) {
        console.error("API Error during folder fetch:", error);
        return NextResponse.json({ error: "Failed to load folders from Google Drive." }, { status: 500 });
    }
}