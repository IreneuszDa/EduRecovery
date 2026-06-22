// @/models/progressReport.ts
// Progress Report model for PDF generation and parent progress tracking

import mongoose, { Schema, Document, models, Model } from "mongoose";

/**
 * Individual subject/class progress
 */
export interface ISubjectProgress {
    class: mongoose.Types.ObjectId;
    className: string;
    subject: string;
    attendance: number; // Percentage
    homeworkCompletion: number; // Percentage
    averageScore: number; // Percentage
    lessonsAttended: number;
    lessonsTotal: number;
    topicsCovered: string[];
    teacherComment?: string;
}

/**
 * Interface for the ProgressReport document
 */
export interface IProgressReport extends Document {
    student: mongoose.Types.ObjectId;
    school: mongoose.Types.ObjectId;
    parent?: mongoose.Types.ObjectId;

    // Report period
    periodStart: Date;
    periodEnd: Date;
    reportType: 'weekly' | 'monthly' | 'semester' | 'custom';

    // Overall stats
    overallAttendance: number;
    overallHomeworkCompletion: number;
    overallAverageScore: number;
    currentStreak: number;
    totalPoints: number;

    // Breakdown by subject/class
    subjectProgress: ISubjectProgress[];

    // Achievements earned in this period
    achievements: string[];

    // Gamification milestones
    levelReached: number;

    // PDF generation
    pdfGenerated: boolean;
    pdfUrl?: string;
    pdfGeneratedAt?: Date;

    // Sharing
    sharedWithParent: boolean;
    sharedAt?: Date;
    viewedByParent: boolean;
    viewedAt?: Date;

    // Metadata
    generatedBy: 'system' | 'teacher' | 'parent_request';
    createdAt: Date;
    updatedAt: Date;
}

const subjectProgressSchema = new Schema<ISubjectProgress>({
    class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    className: { type: String, required: true },
    subject: { type: String, required: true },
    attendance: { type: Number, default: 0, min: 0, max: 100 },
    homeworkCompletion: { type: Number, default: 0, min: 0, max: 100 },
    averageScore: { type: Number, default: 0, min: 0, max: 100 },
    lessonsAttended: { type: Number, default: 0 },
    lessonsTotal: { type: Number, default: 0 },
    topicsCovered: [{ type: String }],
    teacherComment: { type: String, maxlength: 500 },
}, { _id: false });

const progressReportSchema = new Schema<IProgressReport>(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Uczeń jest wymagany.'],
        },
        school: {
            type: Schema.Types.ObjectId,
            ref: 'SchoolOrganization',
            required: [true, 'Szkoła jest wymagana.'],
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        // Report period
        periodStart: {
            type: Date,
            required: [true, 'Data początkowa jest wymagana.'],
        },
        periodEnd: {
            type: Date,
            required: [true, 'Data końcowa jest wymagana.'],
        },
        reportType: {
            type: String,
            enum: ['weekly', 'monthly', 'semester', 'custom'],
            default: 'monthly',
        },

        // Overall statistics
        overallAttendance: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        overallHomeworkCompletion: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        overallAverageScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        currentStreak: {
            type: Number,
            default: 0,
        },
        totalPoints: {
            type: Number,
            default: 0,
        },

        // Subject breakdown
        subjectProgress: [subjectProgressSchema],

        // Achievements
        achievements: [{
            type: String,
        }],

        // Gamification
        levelReached: {
            type: Number,
            default: 1,
        },

        // PDF generation
        pdfGenerated: {
            type: Boolean,
            default: false,
        },
        pdfUrl: {
            type: String,
        },
        pdfGeneratedAt: {
            type: Date,
        },

        // Sharing status
        sharedWithParent: {
            type: Boolean,
            default: false,
        },
        sharedAt: {
            type: Date,
        },
        viewedByParent: {
            type: Boolean,
            default: false,
        },
        viewedAt: {
            type: Date,
        },

        // Generation source
        generatedBy: {
            type: String,
            enum: ['system', 'teacher', 'parent_request'],
            default: 'system',
        },
    },
    { timestamps: true }
);

// Indexes for efficient queries
progressReportSchema.index({ student: 1, periodStart: -1 });
progressReportSchema.index({ school: 1, student: 1 });
progressReportSchema.index({ parent: 1, sharedWithParent: 1 });

// Virtual for report title
progressReportSchema.virtual('title').get(function () {
    const start = this.periodStart.toLocaleDateString('pl-PL');
    const end = this.periodEnd.toLocaleDateString('pl-PL');
    return `Raport ${start} - ${end}`;
});

const ProgressReport: Model<IProgressReport> =
    models.ProgressReport || mongoose.model<IProgressReport>('ProgressReport', progressReportSchema);

export default ProgressReport;
