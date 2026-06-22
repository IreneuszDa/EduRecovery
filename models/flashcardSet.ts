import mongoose, { Schema, models, Document } from "mongoose";

export interface ICard extends Document {
    term: string; // <-- MUST BE 'term'
    definition: string; // <-- MUST BE 'definition'
}

// The schema should match the interface
const cardSchema = new Schema<ICard>({
    term: { type: String, required: true }, // <-- Change 'front' to 'term'
    definition: { type: String, required: true }, // <-- Change 'back' to 'definition'
});

const flashcardSetSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Tytuł zestawu jest wymagany."],
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        cards: {
            type: [cardSchema], // <-- Uses the corrected schema above
            default: [],
        },
        // ... other fields remain the same
        category: {
            type: String,
            default: "Ogólne",
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const FlashcardSet = models.FlashcardSet || mongoose.model("FlashcardSet", flashcardSetSchema);

export default FlashcardSet;