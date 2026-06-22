import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import ActivationKey from "@/models/activationKey"; // --- IMPORT: For activation keys ---
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        // --- STEP 1: Destructure all required fields, including the new activation key ---
        const { name, email, password, profileType, activationKey } = await req.json();

        // --- STEP 2: Add validation for the activation key ---
        if (!activationKey) {
            return NextResponse.json(
                { message: "Klucz aktywacyjny jest wymagany." },
                { status: 400 }
            );
        }

        // --- Existing server-side validations (no changes needed) ---
        if (!name || !email || !password || profileType === undefined) {
            return NextResponse.json(
                { message: "Wszystkie pola (imię, email, hasło, typ profilu) są wymagane." },
                { status: 400 }
            );
        }
        if (profileType !== 0 && profileType !== 1 && profileType !== 2) {
            return NextResponse.json(
                { message: "Nieprawidłowy typ profilu." },
                { status: 400 }
            );
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Nieprawidłowy format adresu email." },
                { status: 400 }
            );
        }
        if (password.length < 8) {
            return NextResponse.json(
                { message: "Hasło musi mieć co najmniej 8 znaków." },
                { status: 400 }
            );
        }

        await connectMongoDB();

        // --- STEP 3: Check if the activation key is valid ---
        // Find the key in the database. If it doesn't exist, it's invalid or already used.
        const keyDoc = await ActivationKey.findOne({ key: activationKey });
        if (!keyDoc) {
            return NextResponse.json(
                { message: "Nieprawidłowy lub już wykorzystany klucz aktywacyjny." },
                { status: 403 } // 403 Forbidden is a good status code here
            );
        }

        // --- Check for existing user (no changes needed) ---
        const existingUser = await User.findOne({ email: email }).exec();
        if (existingUser) {
            return NextResponse.json(
                { message: "Użytkownik o tym adresie email już istnieje." },
                { status: 409 } // 409 Conflict
            );
        }

        // --- Create the user (no changes needed) ---
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword, profileType });

        // --- STEP 4: Invalidate the key by deleting it ---
        // This is the critical step that makes the key single-use.
        // It only happens after the user has been successfully created.
        await ActivationKey.deleteOne({ _id: keyDoc._id });

        return NextResponse.json({ message: "Konto utworzone pomyślnie!" }, { status: 201 });

    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json(
            { message: "Wystąpił błąd podczas rejestracji użytkownika." },
            { status: 500 }
        );
    }
}