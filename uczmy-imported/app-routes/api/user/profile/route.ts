import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth'
import User from "@/models/user";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req: Request) {
    try {
        // Ensure connection to the database
        await connectMongoDB();

        // Get the server-side session using the authOptions you provided
        const session = await getServerSession(authOptions);

        // --- MODIFICATION 1 ---
        // Protect the route: check for a valid session and the user's ID
        // The ID is now available thanks to your callbacks in authOptions.
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Brak autoryzacji." }, { status: 401 });
        }

        // --- MODIFICATION 2 ---
        // Find the user by their unique ID from the session token instead of by email.
        // This is faster, more reliable, and the standard way to look up a document.
        const user = await User.findById(session.user.id).select(
            "name email streakCount lastLogin"
        );

        if (!user) {
            return NextResponse.json({ message: "Użytkownik nie znaleziony." }, { status: 404 });
        }

        // Return the user data
        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        console.error("Błąd podczas pobierania profilu użytkownika:", error);
        return NextResponse.json(
            { message: "Wystąpił wewnętrzny błąd serwera." },
            { status: 500 }
        );
    }
}