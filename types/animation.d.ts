// Type for Animation model to help TypeScript
import { Document } from 'mongoose';

export interface IAnimation extends Document {
    userId: string;
    prompt: string;
    manimCode: string;
    videoUrl: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
    errorMessage?: string;
}
