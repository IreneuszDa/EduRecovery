// models/waitlist.ts

import mongoose, { Schema, Document, models, Model } from 'mongoose';

// 1. Definicja interfejsu dla dokumentu (opcjonalne, ale zalecane dla TypeScript)
export interface IWaitlist extends Document {
    email: string;
    createdAt: Date;
}

// 2. Definicja schematu Mongoose
const WaitlistSchema: Schema<IWaitlist> = new Schema({
    email: {
        type: String,
        required: [true, 'Adres e-mail jest wymagany.'],
        unique: true, // Zapewnia, że każdy e-mail jest unikalny w kolekcji
        trim: true,   // Usuwa białe znaki z początku i końca
        lowercase: true, // Zapisuje e-maile małymi literami
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Proszę podać prawidłowy adres e-mail.'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// 3. Tworzenie i eksportowanie modelu
// Zapobiega ponownemu kompilowaniu modelu przy "hot-reloads" w Next.js
const Waitlist: Model<IWaitlist> = models.Waitlist || mongoose.model<IWaitlist>('Waitlist', WaitlistSchema);

export default Waitlist;