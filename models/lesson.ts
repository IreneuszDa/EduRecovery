// @/models/lesson.ts
// Lesson log/journal model (Dziennik Lekcyjny)

import mongoose, { Schema, Document, models, Model } from "mongoose";

/**
 * Interface for student attendance record
 */
export interface IAttendanceRecord {
    student: mongoose.Types.ObjectId;
    present: boolean;
    note?: 'active' | 'sleepy' | 'unprepared' | 'excellent' | 'needs_attention';
    customNote?: string;
}

/**
 * Interface for the Lesson document
 */
export interface ILesson extends Document {
    // Relations
    class: mongoose.Types.ObjectId;
    teacher: mongoose.Types.ObjectId;
    school: mongoose.Types.ObjectId;

    // Lesson details
    date: Date;
    duration: number; // in minutes
    topic: string;
    topicDetails?: string;

    // Attendance tracking
    attendance: IAttendanceRecord[];

    // Teacher notes (not visible to parents/students)
    privateNotes?: string;

    // Materials used (can link to homework/flashcards)
    relatedHomework?: mongoose.Types.ObjectId[];
    relatedFlashcards?: mongoose.Types.ObjectId[];

    // Auto-generated summary for parents
    parentSummary?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const attendanceRecordSchema = new Schema<IAttendanceRecord>({
    student: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    present: {
        type: Boolean,
        required: true,
        default: true
    },
    note: {
        type: String,
        enum: ['active', 'sleepy', 'unprepared', 'excellent', 'needs_attention']
    },
    customNote: { type: String, maxlength: 200 },
}, { _id: false });

const lessonSchema = new Schema<ILesson>(
    {
        // Relations - multi-tenancy
        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: [true, "Klasa jest wymagana."],
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Nauczyciel jest wymagany."],
        },
        school: {
            type: Schema.Types.ObjectId,
            ref: "SchoolOrganization",
            required: [true, "Szkoła jest wymagana."],
        },

        // Lesson details
        date: {
            type: Date,
            required: [true, "Data lekcji jest wymagana."],
        },
        duration: {
            type: Number,
            required: [true, "Czas trwania jest wymagany."],
            min: [15, "Minimalna długość lekcji to 15 minut."],
            max: [180, "Maksymalna długość lekcji to 180 minut."],
            default: 45,
        },
        topic: {
            type: String,
            required: [true, "Temat lekcji jest wymagany."],
            trim: true,
            maxlength: [300, "Temat może mieć maksymalnie 300 znaków."],
        },
        topicDetails: {
            type: String,
            trim: true,
            maxlength: [2000, "Szczegóły tematu mogą mieć maksymalnie 2000 znaków."],
        },

        // Attendance
        attendance: {
            type: [attendanceRecordSchema],
            default: [],
        },

        // Private teacher notes
        privateNotes: {
            type: String,
            select: false, // Hidden by default
        },

        // Related materials
        relatedHomework: [{
            type: Schema.Types.ObjectId,
            ref: "Homework",
        }],
        relatedFlashcards: [{
            type: Schema.Types.ObjectId,
            ref: "FlashcardSet",
        }],

        // Parent-facing summary
        parentSummary: {
            type: String,
            maxlength: [500, "Podsumowanie dla rodzica może mieć maksymalnie 500 znaków."],
        },
    },
    { timestamps: true }
);

// Indexes for efficient queries
lessonSchema.index({ school: 1, class: 1, date: -1 });
lessonSchema.index({ teacher: 1, date: -1 });
lessonSchema.index({ "attendance.student": 1 });

const Lesson: Model<ILesson> =
    models.Lesson || mongoose.model<ILesson>("Lesson", lessonSchema);

export default Lesson;
