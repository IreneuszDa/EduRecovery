// /app/api/school-submission/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import School from "@/models/school"; // POPRAWIONA ŚCIEŻKA IMPORTU

export async function POST(req: NextRequest) {
  try {
    // Pobieramy dane z ciała żądania
    const body = await req.json();
    const { name, email, school, location, students, message } = body;

    // Sprawdzamy, czy wszystkie wymagane pola zostały przesłane
    if (!name || !email || !school || !location || !students || !message) {
      return NextResponse.json({ message: "Wszystkie pola są wymagane." }, { status: 400 });
    }

    // Łączymy się z bazą danych MongoDB
    await connectMongoDB();

    // Tworzymy nowy dokument w kolekcji School
    await School.create({ name, email, school, location, students, message });

    // Zwracamy pomyślną odpowiedź
    return NextResponse.json({ message: "Zgłoszenie szkoły zostało pomyślnie wysłane." }, { status: 201 });
  } catch (error) {
    console.error("Błąd podczas zapisywania zgłoszenia:", error);

    // Sprawdzamy, czy błąd jest błędem walidacji Mongoose
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ message: "Błąd walidacji danych.", error: error.message }, { status: 400 });
    }

    // Zwracamy ogólny błąd serwera
    return NextResponse.json({ message: "Wystąpił błąd serwera." }, { status: 500 });
  }
}