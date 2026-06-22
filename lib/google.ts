import { google, Auth } from 'googleapis';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';
import { getServerSession, NextAuthOptions } from 'next-auth';

// --- CENTRAL CONFIGURATION OF ENVIRONMENT VARIABLES ---
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_DRIVE_REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;

/**
 * Global OAuth2 client instance.
 * Primarily used to generate the authorization URL.
 */
export const oauth2Client = new Auth.OAuth2Client(
    GOOGLE_CLIENT_ID || "missing-google-client-id",
    GOOGLE_CLIENT_SECRET || "missing-google-client-secret",
    GOOGLE_DRIVE_REDIRECT_URI || "http://localhost:3000/api/drive/callback"
);

/**
 * Retrieves an authenticated Google API client for the currently logged-in user.
 * It robustly handles token expiration by explicitly refreshing the token on each call.
 * If the refresh fails (e.g., user revoked access), it clears the invalid credentials.
 */
export async function getAuthenticatedClient(authOptions: NextAuthOptions): Promise<Auth.OAuth2Client | null> {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_DRIVE_REDIRECT_URI) {
        throw new Error("Google Drive integration is not configured for the EduRecovery UA MVP.");
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        console.log("getAuthenticatedClient: No session or user ID found.");
        return null;
    }

    await connectMongoDB();
    // Fetch the full user document so we can update it if the token is refreshed.
    const user = await User.findById(session.user.id);

    const refreshToken = user?.googleDrive?.refreshToken;

    if (!refreshToken) {
        console.log(`getAuthenticatedClient: User ${user?.email || session.user.id} does not have a refresh token.`);
        return null;
    }

    // Create a new, request-specific client instance.
    const client = new Auth.OAuth2Client(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_DRIVE_REDIRECT_URI
    );

    // Set the refresh token to prepare for refreshing.
    client.setCredentials({
        refresh_token: refreshToken,
    });

    try {
        // --- THE FIX ---
        // Explicitly refresh the access token to ensure it's always valid for the request.
        console.log("Attempting to refresh Google token...");
        const { credentials } = await client.refreshAccessToken();

        // Update the client instance with the newly acquired credentials.
        client.setCredentials(credentials);

        // Persist the new credentials back to the database for future use.
        // The 'credentials' object uses snake_case, so we map to our camelCase schema.
        user.googleDrive.accessToken = credentials.access_token!;
        user.googleDrive.expiryDate = credentials.expiry_date!;

        // A new refresh token is sometimes provided during the refresh flow.
        if (credentials.refresh_token) {
            user.googleDrive.refreshToken = credentials.refresh_token;
        }
        await user.save();
        console.log("Tokens successfully refreshed and saved.");

        return client;

    } catch (error) {
        console.error("Error refreshing access token. The user may have revoked permissions.", error);

        // If refreshing fails, the refresh token is invalid. Clear it from the database.
        user.googleDrive = undefined;
        await user.save();

        return null;
    }
}
