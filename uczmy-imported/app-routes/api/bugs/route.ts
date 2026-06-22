// app/api/bugs/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth'
import { connectMongoDB } from "@/lib/mongodb";
import BugReport from "@/models/bugReport";

export async function POST(request: Request) {
    try {
        // 1. Uwierzytelnienie: Sprawdź, czy użytkownik jest zalogowany
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Brak autoryzacji. Musisz być zalogowany." }, { status: 401 });
        }

        // 2. Parsowanie danych wejściowych
        const { description, pathname } = await request.json();

        if (!description || !pathname) {
            return NextResponse.json({ error: "Opis oraz ścieżka (pathname) są wymagane." }, { status: 400 });
        }

        // 3. Połączenie z bazą danych
        await connectMongoDB();

        // 4. Utworzenie nowego dokumentu zgłoszenia
        const newBugReport = new BugReport({
            description,
            pathname,
            userEmail: session.user.email,
            userName: session.user.name,
            userId: session.user.id, // Upewnij się, że Twoja sesja zawiera ID użytkownika
        });

        // 5. Zapis do bazy danych
        await newBugReport.save();

        console.log("Nowe zgłoszenie błędu zostało zapisane:", newBugReport);

        // 6. Zwrócenie odpowiedzi o sukcesie
        return NextResponse.json({ message: "Zgłoszenie błędu zostało pomyślnie wysłane." }, { status: 201 });

    } catch (error) {
        console.error("Błąd podczas tworzenia zgłoszenia błędu:", error);
        return NextResponse.json({ error: "Wystąpił wewnętrzny błąd serwera." }, { status: 500 });
    }
}