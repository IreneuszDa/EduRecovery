// @/models/class.ts

import mongoose, { Schema, models, Document, Model } from "mongoose";

// Interface for the Class document
export interface IClass extends Document {
    name: string;
    subject: string;
    description?: string;
    teacher: mongoose.Schema.Types.ObjectId;
    school: mongoose.Schema.Types.ObjectId; // For multi-tenancy
    students: mongoose.Schema.Types.ObjectId[];
    joinCode: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const classSchema = new Schema<IClass>(
    {
        name: {
            type: String,
            required: [true, "Nazwa klasy jest wymagana."],
            trim: true,
            maxlength: [100, "Nazwa klasy może mieć maksymalnie 100 znaków."],
        },
        subject: {
            type: String,
            required: [true, "Przedmiot jest wymagany."],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Opis może mieć maksymalnie 500 znaków."],
        },
        // Link to the teacher (User model) who created the class
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // School reference for multi-tenancy
        school: {
            type: Schema.Types.ObjectId,
            ref: "SchoolOrganization",
            required: [true, "Szkoła jest wymagana."],
        },
        // Array of students (User model) enrolled in the class
        students: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        // Unique code for students to join the class (e.g., KRAKOW-ANG-GR1)
        joinCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Indexes for efficient multi-tenancy queries
classSchema.index({ school: 1, teacher: 1 });
// Note: joinCode already has unique:true which creates an index automatically

// To prevent model overwrite errors in Next.js, check if the model already exists
const Class: Model<IClass> = models.Class || mongoose.model<IClass>("Class", classSchema);

export default Class;