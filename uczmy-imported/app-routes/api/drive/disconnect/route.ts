// FILE: app/api/drive/disconnect/route.ts
// STATUS: FIXED

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';
import { oauth2Client } from '@/lib/google';

/**
 * Handles the unlinking of a user's Google Drive account.
 * Method: POST
 */
export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Authorization Required" }, { status: 401 });
    }

    try {
        await connectMongoDB();

        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        const refreshToken = user.googleDrive?.refreshToken;

        if (refreshToken) {
            // 1. Clear the Google Drive data from our database first.
            user.googleDrive = undefined;
            await user.save();

            // 2. Best Practice: Revoke the token with Google's servers.
            try {
                await oauth2Client.revokeToken(refreshToken);
                console.log(`Successfully revoked Google token for user ${user.email}`);

                // --- THIS IS THE FIX ---
                // 3. CRITICAL: Reset the credentials on the global client instance.
                // Passing an empty object replaces the existing credentials with an
                // empty set, correctly clearing the client's state for the next request.
                oauth2Client.setCredentials({});

            } catch (revokeError) {
                console.error(`Failed to revoke Google token for user ${user.email}. This may happen if access was already revoked.`, revokeError);
            }

            return NextResponse.json({ message: "Successfully disconnected Google Drive account." });

        } else {
            return NextResponse.json({ message: "No Google Drive account was connected." });
        }

    } catch (error) {
        console.error("API Error during Google Drive disconnect:", error);
        return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
    }
}