// lib/mailer.ts

import { Resend } from 'resend';

export async function sendPasswordResetEmail({ email, token }: { email: string, token: string }) {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM;

    if (!resendApiKey) {
        throw new Error('RESEND_API_KEY is not configured. EduRecovery UA MVP does not send password reset emails.');
    }

    if (!fromEmail) {
        throw new Error('Server configuration error: Missing sender email.');
    }

    const resend = new Resend(resendApiKey);
    const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password-confirm?token=${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: `EduRecovery UA <${fromEmail}>`,
            to: [email],
            subject: 'Resetowanie hasła na EduRecovery UA',
            html: `
                <h1>Resetowanie hasła</h1>
                <p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.</p>
                <p>Kliknij poniższy link, aby ustawić nowe hasło:</p>
                <a href="${resetLink}" style="background-color: #1f2937; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px;">
                    Ustaw nowe hasło
                </a>
                <p>Link jest ważny przez 15 minut.</p>
                <p>Jeśli nie prosiłeś/aś o zresetowanie hasła, zignoruj tę wiadomość.</p>
            `,
        });

        if (error) {
            console.error('Resend API Error:', error);
            throw new Error('Could not send email due to API error.');
        }

        console.log('Password reset email sent successfully! Message ID:', data?.id);

    } catch (err) {
        // Catch any other unexpected errors during the process
        console.error('Failed to send password reset email:', err);
        throw new Error('Could not send email.');
    }
}
