// models/bugReport.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IBugReport extends Document {
    description: string;
    pathname: string;
    userEmail: string;
    userName?: string;
    userId: mongoose.Schema.Types.ObjectId;
    status: 'new' | 'in_progress' | 'resolved' | 'closed';
}

const BugReportSchema: Schema = new Schema({
    description: {
        type: String,
        required: [true, "Opis błędu jest wymagany."],
        trim: true,
    },
    pathname: {
        type: String,
        required: [true, "Ścieżka (pathname) jest wymagana."],
    },
    userEmail: {
        type: String,
        required: [true, "Email użytkownika jest wymagany."],
    },
    userName: {
        type: String,
    },
    // Referencja do głównego modelu użytkownika (jeśli go posiadasz)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Zmień 'User' na nazwę swojego modelu użytkownika
        required: true,
    },
    status: {
        type: String,
        enum: ['new', 'in_progress', 'resolved', 'closed'],
        default: 'new',
    }
}, {
    timestamps: true // Automatycznie dodaje pola createdAt i updatedAt
});

// Zapobiega ponownemu kompilowaniu modelu przy hot-reload w Next.js
const BugReport = mongoose.models.BugReport || mongoose.model<IBugReport>("BugReport", BugReportSchema);

export default BugReport;