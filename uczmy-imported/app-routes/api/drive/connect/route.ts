import { NextResponse } from 'next/server';
import { oauth2Client } from '@/lib/google';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json(
            { error: 'Brak ID użytkownika (userId) w zapytaniu.' },
            { status: 400 }
        );
    }

    // Define all required permissions (scopes) for the application.
    const scopes = [
        'https://www.googleapis.com/auth/drive.readonly', // Essential for reading files/folders
        'https://www.googleapis.com/auth/userinfo.email',   // To get the user's Google email
        'https://www.googleapis.com/auth/userinfo.profile'  // To get basic profile info
    ];

    const authorizationUrl = oauth2Client.generateAuthUrl({
        // 'offline' is required to receive a refresh_token for long-term access.
        access_type: 'offline',
        scope: scopes,

        // --- THIS LINE WAS THE SOURCE OF THE BUG AND HAS BEEN REMOVED ---
        // include_granted_scopes: true,

        // This parameter forces the Google consent screen to always be displayed,
        // which guarantees that a new refresh_token is issued with all requested scopes.
        prompt: 'consent',

        // Pass the user's ID to the callback for identification.
        state: userId,
    });

    return NextResponse.redirect(authorizationUrl);
}