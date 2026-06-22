// app/api/auth/login/google/route.ts
import { NextResponse } from 'next/server';

// --- THIS IS FOR DEMONSTRATION ONLY ---
// In a real app, you'd handle OAuth callback from Google,
// verify the token, and then find or create a user in your database.
const MOCK_GOOGLE_USER = {
    id: 'google-user-123',
    email: 'googleuser@example.com',
    name: 'Google User',
};
// --- END DEMO DATA ---

export async function POST(request: Request) {
    // In a real Google OAuth flow, the frontend might send an ID token
    // obtained from the Google Sign-In library.
    // const { idToken } = await request.json();
    // You would then verify this token with Google's servers.

    try {
        console.log('Google login attempt (simulated backend)');

        // Simulate successful Google authentication and user lookup/creation
        const user = MOCK_GOOGLE_USER;

        // Simulate session/token generation
        const sessionToken = `mock-google-session-token-for-${user.id}`;
        console.log(`User ${user.email} logged in via Google. Session token: ${sessionToken}`);

        // As above, in a real app, set an HttpOnly cookie
        return NextResponse.json({
            success: true,
            message: 'Zalogowano pomyślnie przez Google!',
            user: { id: user.id, email: user.email, name: user.name },
        });

    } catch (error) {
        console.error('Google Login API error:', error);
        return NextResponse.json(
            { success: false, message: 'Wystąpił błąd serwera podczas logowania Google.' },
            { status: 500 }
        );
    }
}