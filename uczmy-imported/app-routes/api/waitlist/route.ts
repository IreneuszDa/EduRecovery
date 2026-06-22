// app/api/waitlist/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Waitlist from '@/models/waitlist';

// Funkcja pomocnicza do walidacji email
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        // --- Walidacja po stronie serwera ---
        if (!email || typeof email !== 'string') {
            return NextResponse.json({ message: 'Adres e-mail jest wymagany.' }, { status: 400 });
        }
        if (!isValidEmail(email)) {
            return NextResponse.json({ message: 'Proszę podać prawidłowy adres e-mail.' }, { status: 400 });
        }

        await connectMongoDB();

        // --- Inteligentne sprawdzanie duplikatów ---
        const existingEntry = await Waitlist.findOne({ email: email.toLowerCase() });
        if (existingEntry) {
            return NextResponse.json({ message: 'Ten adres e-mail jest już na naszej liście!' }, { status: 409 }); // 409 Conflict
        }

        // --- Zapis nowego adresu e-mail ---
        await Waitlist.create({ email });

        return NextResponse.json(
            { message: 'Dziękujemy! Zostałeś dodany do naszej listy oczekujących.' },
            { status: 201 } // 201 Created
        );

    } catch (error) {
        console.error('Błąd podczas zapisu do listy oczekujących:', error);
        // Generyczny błąd, aby nie ujawniać szczegółów implementacji
        return NextResponse.json({ message: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.' }, { status: 500 });
    }
}