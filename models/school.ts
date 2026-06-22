import mongoose, { Schema, Document } from "mongoose";

// Definiujemy interfejs dla naszego dokumentu School, aby zapewnić type safety
export interface ISchool extends Document {
  name: string;
  email: string;
  school: string;
  location: string;
  students: number;
  message: string;
}

// Tworzymy schemat (schema) dla modelu School
const SchoolSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Imię i nazwisko są wymagane."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Adres e-mail jest wymagany."],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Proszę podać prawidłowy adres e-mail.'],
  },
  school: {
    type: String,
    required: [true, "Nazwa szkoły jest wymagana."],
    trim: true,
  },
  location: {
    type: String,
    required: [true, "Miasto i województwo są wymagane."],
    trim: true,
  },
  students: {
    type: Number,
    required: [true, "Liczba uczniów jest wymagana."],
    min: [1, "Liczba uczniów musi być większa od 0."],
  },
  message: {
    type: String,
    required: [true, "Wiadomość jest wymagana."],
  },
}, {
  timestamps: true, // Automatycznie dodaje pola createdAt i updatedAt
});

// Eksportujemy model School. Sprawdzamy, czy model już istnieje, aby uniknąć błędów przy hot-reloading w Next.js
export default mongoose.models.School || mongoose.model<ISchool>("School", SchoolSchema);