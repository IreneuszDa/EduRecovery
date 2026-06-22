// @/models/schoolOrganization.ts
// School organization model for B2B multi-tenancy with white-labeling support

import mongoose, { Schema, Document, models, Model } from "mongoose";

/**
 * Settings interface for school-specific configuration
 */
export interface ISchoolSettings {
    allowStudentChat: boolean;
    requireParentApproval: boolean;
    enableBookings: boolean;
    maxApiCallsPerStudent: number;
    socraticMethodEnforced: boolean;
}

/**
 * White-label theme settings
 */
export interface IWhiteLabelTheme {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkMode: boolean;
}

/**
 * Interface for the SchoolOrganization document
 */
export interface ISchoolOrganization extends Document {
    name: string;
    slug: string; // For white-label subdomain/identification
    email: string;
    phone?: string;
    address?: string;

    // White-labeling
    theme: IWhiteLabelTheme;

    // Team members
    owner: mongoose.Types.ObjectId;
    teachers: mongoose.Types.ObjectId[];

    // API usage tracking for cost control
    apiUsageLimit: number;
    currentApiUsage: number;
    apiUsageResetDate: Date;

    // Subscription status
    subscriptionStatus: 'trial' | 'active' | 'suspended' | 'cancelled';
    subscriptionExpiresAt?: Date;

    // School-specific settings
    settings: ISchoolSettings;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const schoolSettingsSchema = new Schema<ISchoolSettings>({
    allowStudentChat: { type: Boolean, default: true },
    requireParentApproval: { type: Boolean, default: false },
    enableBookings: { type: Boolean, default: true },
    maxApiCallsPerStudent: { type: Number, default: 100 }, // Per day
    socraticMethodEnforced: { type: Boolean, default: true },
}, { _id: false });

const whiteLabelThemeSchema = new Schema<IWhiteLabelTheme>({
    logo: { type: String },
    primaryColor: { type: String, default: '#3B82F6' }, // Blue
    secondaryColor: { type: String, default: '#1E40AF' },
    accentColor: { type: String, default: '#F59E0B' }, // Amber
    darkMode: { type: Boolean, default: false },
}, { _id: false });

const schoolOrganizationSchema = new Schema<ISchoolOrganization>(
    {
        name: {
            type: String,
            required: [true, "Nazwa szkoły jest wymagana."],
            trim: true,
            maxlength: [100, "Nazwa szkoły może mieć maksymalnie 100 znaków."],
        },
        slug: {
            type: String,
            required: [true, "Slug szkoły jest wymagany."],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9-]+$/, "Slug może zawierać tylko małe litery, cyfry i myślniki."],
        },
        email: {
            type: String,
            required: [true, "Email szkoły jest wymagany."],
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Proszę podać prawidłowy adres email."],
        },
        phone: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },

        // White-labeling theme
        theme: {
            type: whiteLabelThemeSchema,
            default: () => ({}),
        },

        // Owner (admin) - typically the teacher who created the school
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Właściciel szkoły jest wymagany."],
        },

        // Teachers associated with this school
        teachers: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],

        // API usage tracking for cost control (ekonomia API)
        apiUsageLimit: {
            type: Number,
            default: 10000, // Monthly limit
            min: [0, "Limit musi być nieujemny."],
        },
        currentApiUsage: {
            type: Number,
            default: 0,
            min: [0, "Użycie musi być nieujemne."],
        },
        apiUsageResetDate: {
            type: Date,
            default: () => {
                const now = new Date();
                return new Date(now.getFullYear(), now.getMonth() + 1, 1);
            },
        },

        // Subscription management
        subscriptionStatus: {
            type: String,
            enum: ['trial', 'active', 'suspended', 'cancelled'],
            default: 'trial',
        },
        subscriptionExpiresAt: {
            type: Date,
        },

        // School-specific settings
        settings: {
            type: schoolSettingsSchema,
            default: () => ({}),
        },
    },
    { timestamps: true }
);

// Note: slug already has unique:true which creates an index automatically

// Index for finding schools by owner
schoolOrganizationSchema.index({ owner: 1 });

// Compound index for subscription checks
schoolOrganizationSchema.index({ subscriptionStatus: 1, subscriptionExpiresAt: 1 });

const SchoolOrganization: Model<ISchoolOrganization> =
    models.SchoolOrganization || mongoose.model<ISchoolOrganization>("SchoolOrganization", schoolOrganizationSchema);

export default SchoolOrganization;
