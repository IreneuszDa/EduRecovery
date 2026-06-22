// @/models/exam.ts

import mongoose, { Schema, models, Document } from "mongoose";

// 1. THE ENUM NOW USES NUMERIC VALUES.
// These numbers will be stored in the database, saving space.
export enum QuestionType {
    MultipleChoice = 0,
    TrueFalse = 1,
    OpenEnded = 2,
    FillInTheBlank = 3,
}

// Interfaces reference the numeric-based enum
export interface IBaseQuestion extends Document {
    questionNumber: string;
    points: string;
    content: string;
    imageUrl?: string;
    questionType: QuestionType; // This will be a number like 0, 1, 2, etc.
}

// 2. THE BASE SCHEMA FOR THE DISCRIMINATOR.
// We MUST explicitly define `questionType` as a Number in the base schema.
// Otherwise, Mongoose would default to creating a String field for the discriminator key.
const baseQuestionSchema = new Schema<IBaseQuestion>({
    questionNumber: { type: String, required: [true, "Numer pytania jest wymagany."] },
    points: { type: String, required: [true, "Liczba punktów jest wymagana."] },
    content: { type: String, required: [false, "Treść pytania jest wymagana."] },
    imageUrl: { type: String },
    // Explicitly define the discriminator key's type and constraints
    questionType: {
        type: Number,
        required: true,
        // Ensure only the numbers defined in the enum are valid
        enum: Object.values(QuestionType).filter(v => typeof v === 'number')
    }
}, { discriminatorKey: 'questionType' }); // 'questionType' is still the key Mongoose uses


// --- Specific Question Schemas (No changes needed) ---
export interface IMultipleChoiceQuestion extends IBaseQuestion {
    options: { [key: string]: string };
    correctAnswer: string;
}
const multipleChoiceSchema = new Schema<IMultipleChoiceQuestion>({
    options: { type: Map, of: String, required: true },
    correctAnswer: { type: String, required: true },
});

export interface ITrueFalseQuestion extends IBaseQuestion {
    statements: { statementText: string; isCorrect: boolean; }[];
}
const trueFalseSchema = new Schema<ITrueFalseQuestion>({
    statements: [{ _id: false, statementText: { type: String, required: true }, isCorrect: { type: Boolean, required: true } }],
});

export interface IOpenEndedQuestion extends IBaseQuestion {
    solutionSteps: string;
    finalAnswer: string;
}
const openEndedSchema = new Schema<IOpenEndedQuestion>({
    solutionSteps: { type: String },
    finalAnswer: { type: String },
});

export interface IFillInTheBlankQuestion extends IBaseQuestion {
    correctAnswers: string[];
}
const fillInTheBlankSchema = new Schema<IFillInTheBlankQuestion>({
    correctAnswers: [{ type: String }],
});


// --- Main Exam Interface and Schema ---
export interface IExam extends Document {
    title: string;
    subject: string;
    isPublic: boolean;
    user: mongoose.Schema.Types.ObjectId;
    questions: (IMultipleChoiceQuestion | ITrueFalseQuestion | IOpenEndedQuestion | IFillInTheBlankQuestion)[];
}

const examSchema = new Schema<IExam>(
    {
        title: { type: String, required: true },
        subject: { type: String, required: true },
        isPublic: { type: Boolean, required: true, default: false },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        questions: {
            type: [baseQuestionSchema],
            default: [],
        },
    },
    { timestamps: true }
);

// 3. APPLY DISCRIMINATORS
// These calls now use the numeric values from the enum (e.g., 0, 1, 2, 3).
// Mongoose correctly maps the numeric `questionType` value to the corresponding schema.
examSchema.path<any>('questions').discriminator(QuestionType.MultipleChoice, multipleChoiceSchema);
examSchema.path<any>('questions').discriminator(QuestionType.TrueFalse, trueFalseSchema);
examSchema.path<any>('questions').discriminator(QuestionType.OpenEnded, openEndedSchema);
examSchema.path<any>('questions').discriminator(QuestionType.FillInTheBlank, fillInTheBlankSchema);


const Exam = models.Exam || mongoose.model<IExam>("Exam", examSchema);

export default Exam;