// FILE: @/models/user.ts
// STATUS: CORRECTED & VERIFIED

import mongoose, { Schema, Document, models } from "mongoose";

/**
 * TypeScript interface for the Google Drive connection data.
 * This ensures type safety across your application.
 */
export interface IGoogleDriveData {
    accessToken: string;
    // The refresh token is essential for maintaining long-term access without user interaction.
    refreshToken: string;
    // Expiry date of the accessToken, stored as a timestamp.
    expiryDate: number;
    // The email of the connected Google account (e.g., "example@gmail.com").
    driveEmail: string;
}

/**
 * Interface for the entire User document.
 */
export interface IUser extends Document {
    name: string;
    // User's email for your application (e.g., "user@example.com").
    email: string;
    password?: string;
    // 0 = student, 1 = teacher, 2 = parent
    profileType: number;
    streakCount: number;
    lastLogin?: Date;
    // School affiliation for multi-tenancy (B2B model)
    school?: mongoose.Types.ObjectId;
    // For parent accounts - array of their children (student users)
    children?: mongoose.Types.ObjectId[];
    // For student accounts - parent's email for linking
    parentEmail?: string;
    // The googleDrive field is optional and uses the interface defined above.
    googleDrive?: IGoogleDriveData;
}


const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Imię jest wymagane."],
        },
        email: {
            type: String,
            required: [true, "Adres email jest wymagany."],
            unique: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Proszę podać prawidłowy adres email.'],
        },
        password: {
            type: String,
            // Password is not required if authentication is handled by an OAuth provider.
            // This logic can be adjusted based on your specific authentication setup.
            required: function (this: IUser) {
                return !this.isModified('password') && !this.googleDrive;
            },
            minlength: [8, "Hasło musi mieć co najmniej 8 znaków."]
        },
        profileType: {
            type: Number,
            required: [true, "Typ profilu jest wymagany."],
            enum: [0, 1, 2], // 0 = student, 1 = teacher, 2 = parent
            default: 0,
        },
        streakCount: {
            type: Number,
            default: 0,
        },
        lastLogin: {
            type: Date,
        },
        // School affiliation for multi-tenancy (B2B model)
        school: {
            type: Schema.Types.ObjectId,
            ref: "SchoolOrganization",
            required: false,
        },
        // For parent accounts - linked children (student users)
        children: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        // For student accounts - parent's email for linking
        parentEmail: {
            type: String,
            required: false,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Proszę podać prawidłowy adres email rodzica.'],
        },
        // --- FIELDS FOR STORING THE GOOGLE DRIVE CONNECTION ---
        googleDrive: {
            // This data is only stored when a user explicitly connects their account.
            type: {
                accessToken: { type: String, required: true },
                refreshToken: { type: String, required: true },
                expiryDate: { type: Number, required: true },
                driveEmail: { type: String, required: true },
            },
            required: false, // The entire googleDrive object is optional.
        },
    },
    { timestamps: true }
);

const User = models.User || mongoose.model<IUser>("User", userSchema);

export default User;