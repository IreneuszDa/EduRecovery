import mongoose, { Schema } from 'mongoose';

export interface Animation {
    _id?: string;
    userId: string;
    prompt: string;
    originalPrompt?: string; // Store the user's original prompt
    manimCode?: string; // Now optional as we generate it dynamically
    videoUrl: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
    errorMessage?: string;
}

const AnimationSchema = new Schema<Animation>({
    userId: { type: String, required: true },
    prompt: { type: String, required: true },
    originalPrompt: { type: String }, // Optional field for original user prompt
    manimCode: { type: String }, // Now optional
    videoUrl: { type: String, default: '' },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    errorMessage: { type: String },
}, {
    timestamps: true
});

// Check if the model is already defined (for Next.js hot reloading)
export default mongoose.models.Animation || mongoose.model<Animation>('Animation', AnimationSchema);
