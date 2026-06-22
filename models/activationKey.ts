import mongoose, { Schema, Document, models } from "mongoose";

export interface IActivationKey extends Document {
    key: string;
    isUsed: boolean;
    createdAt: Date;
}

const ActivationKeySchema = new Schema<IActivationKey>({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    // The 'createdAt' field with a TTL index is a robust way to have keys automatically expire.
    // MongoDB's TTL feature will automatically remove documents after the specified number of seconds.
    // Here, keys will expire after 7 days (604800 seconds).
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800, // 7 days in seconds
    }
});

const ActivationKey = models.ActivationKey || mongoose.model<IActivationKey>("ActivationKey", ActivationKeySchema);

export default ActivationKey;