import { NextResponse } from 'next/server';
import { oauth2Client } from '@/lib/google';
import { google } from 'googleapis';
import { connectMongoDB } from '@/lib/mongodb';
import User, { IGoogleDriveData } from '@/models/user';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const userId = searchParams.get('state');

    if (!code) {
        return NextResponse.json({ error: 'Brak kodu autoryzacyjnego w zapytaniu.' }, { status: 400 });
    }

    if (!userId) {
        return NextResponse.json({ error: 'Brak ID użytkownika w parametrze state.' }, { status: 400 });
    }

    try {
        // 1. Exchange the authorization code for tokens.
        const { tokens } = await oauth2Client.getToken(code);

        // 2. CRITICAL: Verify that a refresh_token was received.
        if (!tokens.refresh_token) {
            console.error("CRITICAL ERROR: No refresh_token received from Google. Ensure 'prompt: consent' is used.", tokens);
            throw new Error("Nie udało się uzyskać wymaganego tokenu odświeżającego (refresh_token).");
        }

        // --- THE DEFINITIVE FIX ---
        // 3. CRITICAL: Verify that all required scopes were actually granted by the user.
        const requiredScopes = [
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ];
        const grantedScopes = tokens.scope?.split(' ') || [];
        const hasAllRequiredScopes = requiredScopes.every(scope => grantedScopes.includes(scope));

        if (!hasAllRequiredScopes) {
            console.error("CRITICAL ERROR: User did not grant all required scopes.", { required: requiredScopes, granted: grantedScopes });
            // This prevents a "poisoned" refresh_token from being saved.
            throw new Error("Nie przyznano wszystkich wymaganych uprawnień. Nie można ukończyć połączenia.");
        }

        // 4. Set credentials for this request.
        oauth2Client.setCredentials(tokens);

        // 5. Get user info (email) with the new credentials.
        const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
        const { data: userInfo } = await oauth2.userinfo.get();
        const driveEmail = userInfo.email;

        if (!driveEmail) {
            throw new Error("Nie udało się uzyskać adresu email z połączonego konta Google.");
        }

        await connectMongoDB();

        // 6. Prepare the data for the database.
        const driveData: IGoogleDriveData = {
            accessToken: tokens.access_token!,
            refreshToken: tokens.refresh_token,
            expiryDate: tokens.expiry_date!,
            driveEmail: driveEmail,
        };

        // 7. Save the verified, valid data to the user's document.
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { googleDrive: driveData } },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: `Nie znaleziono użytkownika o ID: ${userId}` }, { status: 404 });
        }

        // 8. Redirect back to the app with a success message.
        const redirectUrl = new URL('/dashboard/files?status=drive-connected-successfully', request.url);
        return NextResponse.redirect(redirectUrl);

    } catch (error: any) {
        console.error("Error during Google Drive callback processing:", error);
        // Redirect with an error message so the user knows what happened.
        const errorMessage = encodeURIComponent(error.message || 'error-connecting-drive');
        const redirectUrl = new URL(`/dashboard/files?status=${errorMessage}`, request.url);
        return NextResponse.redirect(redirectUrl);
    }
}