import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import ContactMessage from "@/models/contact"; // Importujemy nowy model wiadomości

export async function POST(req: NextRequest) {
  try {
    // Pobieramy dane z ciała żądania
    const body = await req.json();
    const { name, email, message } = body;

    // Sprawdzamy, czy wszystkie wymagane pola zostały przesłane
    if (!name || !email || !message) {
      return NextResponse.json({ message: "Wszystkie pola formularza są wymagane." }, { status: 400 });
    }

    // Łączymy się z bazą danych MongoDB
    await connectMongoDB();

    // Tworzymy nowy dokument w kolekcji ContactMessage
    await ContactMessage.create({ name, email, message });

    // Zwracamy pomyślną odpowiedź
    return NextResponse.json({ message: "Wiadomość została pomyślnie wysłana." }, { status: 201 });

  } catch (error) {
    console.error("Błąd podczas zapisywania wiadomości kontaktowej:", error);

    // Sprawdzamy, czy błąd jest błędem walidacji Mongoose
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ message: "Błąd walidacji danych.", error: error.message }, { status: 400 });
    }

    // Zwracamy ogólny błąd serwera
    return NextResponse.json({ message: "Wystąpił błąd serwera podczas wysyłania wiadomości." }, { status: 500 });
  }
}