// @/models/booking.ts
// Workshop booking slots and reservations model

import mongoose, { Schema, Document, models, Model } from "mongoose";

/**
 * Interface for individual reservations
 */
export interface IReservation {
    parent: mongoose.Types.ObjectId;
    student: mongoose.Types.ObjectId;
    reservedAt: Date;
    confirmationSent: boolean;
    status: 'confirmed' | 'cancelled' | 'attended' | 'no_show';
    notes?: string;
}

/**
 * Interface for the BookingSlot document
 */
export interface IBookingSlot extends Document {
    // Relations
    school: mongoose.Types.ObjectId;
    teacher?: mongoose.Types.ObjectId;

    // Slot details
    title: string;
    description?: string;
    slotType: 'workshop' | 'consultation' | 'extra_lesson' | 'event';

    // Timing
    date: Date;
    startTime: string; // "14:00"
    endTime: string; // "15:30"
    duration: number; // in minutes

    // Capacity
    maxParticipants: number;
    currentParticipants: number;

    // Reservations
    reservations: IReservation[];

    // Availability
    isAvailable: boolean;
    registrationDeadline?: Date;

    // Location
    location?: string;
    isOnline: boolean;
    onlineLink?: string;

    // Pricing (for future use - no payment processing now)
    isFree: boolean;
    price?: number;
    currency?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const reservationSchema = new Schema<IReservation>({
    parent: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reservedAt: {
        type: Date,
        default: Date.now
    },
    confirmationSent: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'attended', 'no_show'],
        default: 'confirmed',
    },
    notes: { type: String, maxlength: 500 },
}, { _id: true });

const bookingSlotSchema = new Schema<IBookingSlot>(
    {
        // Relations - multi-tenancy
        school: {
            type: Schema.Types.ObjectId,
            ref: "SchoolOrganization",
            required: [true, "Szkoła jest wymagana."],
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        // Slot details
        title: {
            type: String,
            required: [true, "Tytuł jest wymagany."],
            trim: true,
            maxlength: [150, "Tytuł może mieć maksymalnie 150 znaków."],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, "Opis może mieć maksymalnie 1000 znaków."],
        },
        slotType: {
            type: String,
            enum: ['workshop', 'consultation', 'extra_lesson', 'event'],
            default: 'workshop',
        },

        // Timing
        date: {
            type: Date,
            required: [true, "Data jest wymagana."],
        },
        startTime: {
            type: String,
            required: [true, "Godzina rozpoczęcia jest wymagana."],
            match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format: HH:MM"],
        },
        endTime: {
            type: String,
            required: [true, "Godzina zakończenia jest wymagana."],
            match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format: HH:MM"],
        },
        duration: {
            type: Number,
            required: true,
            min: [15, "Minimalna długość to 15 minut."],
        },

        // Capacity
        maxParticipants: {
            type: Number,
            required: [true, "Maksymalna liczba uczestników jest wymagana."],
            min: [1, "Musi być co najmniej 1 uczestnik."],
        },
        currentParticipants: {
            type: Number,
            default: 0,
            min: 0,
        },

        // Reservations
        reservations: {
            type: [reservationSchema],
            default: [],
        },

        // Availability
        isAvailable: {
            type: Boolean,
            default: true,
        },
        registrationDeadline: { type: Date },

        // Location
        location: { type: String, trim: true },
        isOnline: {
            type: Boolean,
            default: false,
        },
        onlineLink: {
            type: String,
            select: false, // Only visible to registered participants
        },

        // Pricing (no actual payment - just for display)
        isFree: {
            type: Boolean,
            default: true,
        },
        price: { type: Number, min: 0 },
        currency: {
            type: String,
            default: 'PLN',
            enum: ['PLN', 'EUR', 'USD'],
        },
    },
    { timestamps: true }
);

// Virtual for checking if slot is full
bookingSlotSchema.virtual('isFull').get(function () {
    return this.currentParticipants >= this.maxParticipants;
});

// Virtual for remaining spots
bookingSlotSchema.virtual('remainingSpots').get(function () {
    return Math.max(0, this.maxParticipants - this.currentParticipants);
});

// Indexes for efficient queries
bookingSlotSchema.index({ school: 1, date: 1, isAvailable: 1 });
bookingSlotSchema.index({ teacher: 1, date: 1 });
bookingSlotSchema.index({ "reservations.parent": 1 });
bookingSlotSchema.index({ "reservations.student": 1 });

const BookingSlot: Model<IBookingSlot> =
    models.BookingSlot || mongoose.model<IBookingSlot>("BookingSlot", bookingSlotSchema);

export default BookingSlot;
