// app/api/auth/login/email/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

// --- THIS IS FOR DEMONSTRATION ONLY ---
// In a real app, this would come from a database and passwords would be hashed.
const MOCK_USERS = [
    {
        id: '1',
        email: 'user@example.com',
        // In a real app, this would be a HASHED password.
        // For bcrypt, you'd compare: await bcrypt.compare(password, hashedPasswordFromDB)
        password: 'password123',
        name: 'Test User',
    },
    {
        id: '2',
        email: 'uczymy@example.com',
        password: 'strongpassword!',
        name: 'Uczymy Admin',
    },
];
// --- END DEMO DATA ---

const loginSchema = z.object({
    email: z.string().email({ message: 'Nieprawidłowy adres email.' }),
    password: z.string().min(6, { message: 'Hasło musi mieć co najmniej 6 znaków.' }),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, errors: validation.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { email, password } = validation.data;

        // Simulate database lookup
        const user = MOCK_USERS.find((u) => u.email === email);

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Nieprawidłowy email lub hasło.' },
                { status: 401 } // Unauthorized
            );
        }

        // Simulate password check (INSECURE - DO NOT USE IN PRODUCTION)
        // In a real app, use bcrypt.compare(password, user.hashedPassword)
        if (user.password !== password) {
            return NextResponse.json(
                { success: false, message: 'Nieprawidłowy email lub hasło.' },
                { status: 401 }
            );
        }

        // Simulate session/token generation
        // In a real app, you'd create a JWT or session here
        const sessionToken = `mock-session-token-for-${user.id}`;
        console.log(`User ${user.email} logged in. Session token: ${sessionToken}`);

        // For a real app, you'd set an HttpOnly cookie with the token
        // const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
        // response.cookies.set('sessionToken', sessionToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', sameSite: 'lax' });
        // return response;

        return NextResponse.json({
            success: true,
            message: 'Zalogowano pomyślnie!',
            user: { id: user.id, email: user.email, name: user.name }, // Don't send password back!
        });

    } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json(
            { success: false, message: 'Wystąpił błąd serwera.' },
            { status: 500 }
        );
    }
}