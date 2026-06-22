// @/models/announcement.ts
// One-way announcement model (Tablica Ogłoszeń)

import mongoose, { Schema, Document, models, Model } from "mongoose";

/**
 * Interface for the Announcement document
 */
export interface IAnnouncement extends Document {
    // Relations
    school: mongoose.Types.ObjectId;
    class?: mongoose.Types.ObjectId; // null = all school
    author: mongoose.Types.ObjectId;

    // Content
    title: string;
    content: string;
    priority: 'normal' | 'important' | 'urgent';

    // Recipients tracking
    targetAudience: 'parents' | 'students' | 'all';
    recipientParents: mongoose.Types.ObjectId[];

    // Read tracking
    readBy: {
        user: mongoose.Types.ObjectId;
        readAt: Date;
    }[];

    // Notification status
    emailSent: boolean;
    emailSentAt?: Date;
    pushSent: boolean;
    pushSentAt?: Date;

    // Scheduling
    scheduledFor?: Date;
    sentAt?: Date;

    // Expiry
    expiresAt?: Date;
    isActive: boolean;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const readStatusSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    readAt: { type: Date, default: Date.now },
}, { _id: false });

const announcementSchema = new Schema<IAnnouncement>(
    {
        // Relations - multi-tenancy
        school: {
            type: Schema.Types.ObjectId,
            ref: "SchoolOrganization",
            required: [true, "Szkoła jest wymagana."],
        },
        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            // null means announcement is for entire school
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Autor jest wymagany."],
        },

        // Content
        title: {
            type: String,
            required: [true, "Tytuł ogłoszenia jest wymagany."],
            trim: true,
            maxlength: [150, "Tytuł może mieć maksymalnie 150 znaków."],
        },
        content: {
            type: String,
            required: [true, "Treść ogłoszenia jest wymagana."],
            trim: true,
            maxlength: [2000, "Treść może mieć maksymalnie 2000 znaków."],
        },
        priority: {
            type: String,
            enum: ['normal', 'important', 'urgent'],
            default: 'normal',
        },

        // Target audience
        targetAudience: {
            type: String,
            enum: ['parents', 'students', 'all'],
            default: 'parents',
        },
        recipientParents: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],

        // Read tracking
        readBy: {
            type: [readStatusSchema],
            default: [],
        },

        // Notification tracking
        emailSent: {
            type: Boolean,
            default: false,
        },
        emailSentAt: { type: Date },
        pushSent: {
            type: Boolean,
            default: false,
        },
        pushSentAt: { type: Date },

        // Scheduling
        scheduledFor: { type: Date },
        sentAt: { type: Date },

        // Expiry
        expiresAt: { type: Date },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Indexes for efficient queries
announcementSchema.index({ school: 1, isActive: 1, sentAt: -1 });
announcementSchema.index({ class: 1, isActive: 1 });
announcementSchema.index({ recipientParents: 1 });
announcementSchema.index({ "readBy.user": 1 });
announcementSchema.index({ scheduledFor: 1, emailSent: 1 }); // For cron job

const Announcement: Model<IAnnouncement> =
    models.Announcement || mongoose.model<IAnnouncement>("Announcement", announcementSchema);

export default Announcement;
