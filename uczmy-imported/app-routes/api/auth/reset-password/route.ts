import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';
import { sendPasswordResetEmail } from '@/lib/mailer';
import crypto from 'crypto';

const resetPasswordSchema = z.object({
    email: z.string().email({ message: 'Nieprawidłowy adres email.' }),
});

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const body = await request.json();
        const validation = resetPasswordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, message: validation.error.flatten().fieldErrors.email?.[0] || 'Nieprawidłowe dane wejściowe.' },
                { status: 400 }
            );
        }

        const { email } = validation.data;
        const user = await User.findOne({ email });

        if (user) {
            // 1. Generate a secure, unique token
            const resetToken = crypto.randomBytes(32).toString('hex');

            // 2. Hash the token before saving it to the database for security
            const passwordResetToken = crypto
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');

            // 3. Set an expiry date (e.g., 15 minutes from now)
            const passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

            // 4. Save the hashed token and expiry to the user document in the DB
            user.passwordResetToken = passwordResetToken;
            user.passwordResetExpires = passwordResetExpires;
            await user.save();

            // 5. Send the email with the UN-HASHED token
            await sendPasswordResetEmail({ email: user.email, token: resetToken });
        }

        // SECURITY: Always return a generic success message to prevent user enumeration
        return NextResponse.json({
            success: true,
            message: 'Jeśli konto z tym adresem e-mail istnieje, wysłaliśmy na nie link do zresetowania hasła.',
        });

    } catch (error) {
        console.error('Password Reset API error:', error);
        return NextResponse.json(
            { success: false, message: 'Wystąpił błąd serwera. Spróbuj ponownie później.' },
            { status: 500 }
        );
    }
}