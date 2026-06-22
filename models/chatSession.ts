import mongoose, { Schema, models, Document, Model, Types } from "mongoose";

// Sub-schema for individual messages remains the same
const messageSchema = new Schema({
    role: { type: String, required: true, enum: ['user', 'assistant'] },
    content: { type: String, required: true },
    linkType: { type: Number, enum: [0, 1, 2] }, // 0 for flashcards, 1 for exams, 2 for animations
    linkId: { type: String }
}, { _id: false });

// Interface for a ChatSession document
export interface IChatSession extends Document {
    user: Types.ObjectId;
    title: string;
    messages: {
        role: 'user' | 'assistant';
        content: string;
        linkType?: 0 | 1 | 2; // 0 for flashcards, 1 for exams, 2 for animations
        linkId?: string;
    }[];
    // --- MODIFICATION START ---
    // This field will store the ID of the exam the user is currently discussing.
    activeExamContextId?: Types.ObjectId;
    // --- MODIFICATION END ---
    createdAt: Date;
    updatedAt: Date;
}

const chatSessionSchema = new Schema<IChatSession>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            default: "Nowa rozmowa"
        },
        messages: {
            type: [messageSchema],
            default: [],
        },
        // --- MODIFICATION START ---
        // Add the new field to the Mongoose schema.
        activeExamContextId: {
            type: Schema.Types.ObjectId,
            ref: 'Exam', // This creates a formal reference to your Exam model
            required: false, // It is not required; sessions can exist without an exam context
        }
        // --- MODIFICATION END ---
    },
    { timestamps: true }
);

const ChatSession: Model<IChatSession> = models.ChatSession || mongoose.model<IChatSession>("ChatSession", chatSessionSchema);

export default ChatSession;