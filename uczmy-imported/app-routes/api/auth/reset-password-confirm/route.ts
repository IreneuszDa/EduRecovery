import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// Zod schema do walidacji danych wejściowych
const setPasswordSchema = z.object({
    password: z.string().min(8, { message: 'Hasło musi mieć co najmniej 8 znaków.' }),
    token: z.string().min(1, { message: 'Token jest wymagany.' }),
});

export async function POST(request: Request) {
    try {
        await connectMongoDB();

        const body = await request.json();
        const validation = setPasswordSchema.safeParse(body);

        // Walidacja danych
        if (!validation.success) {
            return NextResponse.json(
                { success: false, message: validation.error.flatten().fieldErrors.password?.[0] || 'Nieprawidłowe dane wejściowe.' },
                { status: 400 }
            );
        }

        const { password, token } = validation.data;

        // 1. Zahaszuj token otrzymany od klienta, aby dopasować go do tokena w bazie danych
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // 2. Znajdź użytkownika na podstawie zahaszowanego tokena i sprawdź, czy nie wygasł
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }, // Sprawdź, czy data ważności jest w przyszłości
        });

        // 3. Jeśli użytkownik nie istnieje lub token wygasł, zwróć błąd
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Token jest nieprawidłowy lub wygasł. Spróbuj ponownie poprosić o reset hasła.' },
                { status: 400 }
            );
        }

        // 4. Jeśli token jest prawidłowy, zahaszuj nowe hasło
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Zaktualizuj hasło użytkownika
        user.password = hashedPassword;

        // 6. Wyczyść pola tokena, aby nie można go było ponownie użyć
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        // 7. Zapisz zmiany w bazie danych
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Hasło zostało pomyślnie zresetowane. Możesz się teraz zalogować.',
        });

    } catch (error) {
        console.error('Błąd API resetowania hasła:', error);
        return NextResponse.json(
            { success: false, message: 'Wystąpił błąd serwera. Spróbuj ponownie później.' },
            { status: 500 }
        );
    }
}