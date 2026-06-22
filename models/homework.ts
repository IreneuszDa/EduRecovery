// @/models/homework.ts
// AI-generated homework with auto-grading support

import mongoose, { Schema, Document, models, Model } from "mongoose";

/**
 * Interface for individual homework questions
 */
export interface IHomeworkQuestion {
    content: string;
    type: 'open' | 'multiple_choice' | 'fill_blank' | 'true_false';
    options?: { [key: string]: string }; // For multiple choice
    correctAnswer?: string;
    points: number;
    aiHint?: string; // Socratic hint for struggling students
}

/**
 * Interface for student answers
 */
export interface IHomeworkAnswer {
    questionIndex: number;
    answer: string;
    isCorrect?: boolean;
    aiScore?: number; // 0-100 for open-ended
    aiComment?: string; // AI feedback in Polish
    submittedAt: Date;
}

/**
 * Interface for homework submissions
 */
export interface IHomeworkSubmission {
    student: mongoose.Types.ObjectId;
    answers: IHomeworkAnswer[];
    startedAt: Date;
    submittedAt?: Date;
    totalScore: number;
    maxScore: number;
    percentageScore: number;
    aiOverallComment?: string;
    isCompleted: boolean;
    timeSpentMinutes?: number;
}

/**
 * Interface for the Homework document
 */
export interface IHomework extends Document {
    title: string;
    topic: string;
    description?: string;

    // Relations
    class: mongoose.Types.ObjectId;
    teacher: mongoose.Types.ObjectId;
    school: mongoose.Types.ObjectId;

    // AI-generated content
    questions: IHomeworkQuestion[];
    isAIGenerated: boolean;
    aiGenerationPrompt?: string; // Hidden from students

    // Approval workflow
    status: 'draft' | 'pending_approval' | 'approved' | 'sent';
    approvedAt?: Date;
    approvedBy?: mongoose.Types.ObjectId;

    // Timing
    deadline: Date;
    allowLateSubmission: boolean;
    lateSubmissionPenalty: number; // Percentage deduction

    // Submissions
    submissions: IHomeworkSubmission[];

    // Anti-cheat settings
    preventCopyPaste: boolean;
    shuffleQuestions: boolean;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const homeworkQuestionSchema = new Schema<IHomeworkQuestion>({
    content: { type: String, required: true },
    type: {
        type: String,
        enum: ['open', 'multiple_choice', 'fill_blank', 'true_false'],
        required: true
    },
    options: { type: Map, of: String },
    correctAnswer: { type: String },
    points: { type: Number, required: true, min: 1 },
    aiHint: { type: String },
}, { _id: true });

const homeworkAnswerSchema = new Schema<IHomeworkAnswer>({
    questionIndex: { type: Number, required: true },
    answer: { type: String, required: true },
    isCorrect: { type: Boolean },
    aiScore: { type: Number, min: 0, max: 100 },
    aiComment: { type: String },
    submittedAt: { type: Date, default: Date.now },
}, { _id: false });

const homeworkSubmissionSchema = new Schema<IHomeworkSubmission>({
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answers: [homeworkAnswerSchema],
    startedAt: { type: Date, required: true },
    submittedAt: { type: Date },
    totalScore: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    percentageScore: { type: Number, default: 0 },
    aiOverallComment: { type: String },
    isCompleted: { type: Boolean, default: false },
    timeSpentMinutes: { type: Number },
}, { _id: true });

const homeworkSchema = new Schema<IHomework>(
    {
        title: {
            type: String,
            required: [true, "Tytuł pracy domowej jest wymagany."],
            trim: true,
            maxlength: [200, "Tytuł może mieć maksymalnie 200 znaków."],
        },
        topic: {
            type: String,
            required: [true, "Temat pracy domowej jest wymagany."],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },

        // Relations - multi-tenancy ensured by school reference
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

        // AI-generated questions
        questions: {
            type: [homeworkQuestionSchema],
            default: [],
            validate: {
                validator: (v: IHomeworkQuestion[]) => v.length <= 20,
                message: "Praca domowa może mieć maksymalnie 20 pytań.",
            },
        },
        isAIGenerated: {
            type: Boolean,
            default: false,
        },
        aiGenerationPrompt: {
            type: String,
            select: false, // Never expose to frontend by default
        },

        // Approval workflow
        status: {
            type: String,
            enum: ['draft', 'pending_approval', 'approved', 'sent'],
            default: 'draft',
        },
        approvedAt: { type: Date },
        approvedBy: { type: Schema.Types.ObjectId, ref: "User" },

        // Timing
        deadline: {
            type: Date,
            required: [true, "Termin oddania jest wymagany."],
        },
        allowLateSubmission: {
            type: Boolean,
            default: true,
        },
        lateSubmissionPenalty: {
            type: Number,
            default: 10, // 10% per day late
            min: 0,
            max: 100,
        },

        // Submissions
        submissions: {
            type: [homeworkSubmissionSchema],
            default: [],
        },

        // Anti-cheat
        preventCopyPaste: {
            type: Boolean,
            default: true,
        },
        shuffleQuestions: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Indexes for efficient queries
homeworkSchema.index({ school: 1, class: 1 });
homeworkSchema.index({ teacher: 1 });
homeworkSchema.index({ deadline: 1, status: 1 });
homeworkSchema.index({ "submissions.student": 1 });

const Homework: Model<IHomework> =
    models.Homework || mongoose.model<IHomework>("Homework", homeworkSchema);

export default Homework;
