// @/app/api/bookings/route.ts
// API endpoint for booking slot management

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectMongoDB } from '@/lib/mongodb';
import { UserRoles } from '@/lib/rbac';
import { getSchoolContext, withSchoolFilter } from '@/lib/multiTenancy';
import BookingSlot from '@/models/booking';

// GET - List available booking slots
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Nie jesteś zalogowany.' }, { status: 401 });
        }

        const schoolId = await getSchoolContext(session.user.id);
        if (!schoolId) {
            return NextResponse.json({ error: 'Nie należysz do żadnej szkoły.' }, { status: 403 });
        }

        await connectMongoDB();

        const { searchParams } = new URL(request.url);
        const showPast = searchParams.get('past') === 'true';

        // Build query - show future slots by default
        let query: any = withSchoolFilter(
            { isAvailable: true },
            schoolId
        );

        if (!showPast) {
            query.date = { $gte: new Date() };
        }

        const slots = await BookingSlot.find(query)
            .populate('teacher', 'name')
            .sort({ date: 1, startTime: 1 })
            .lean();

        // Add user's reservation status
        const enrichedSlots = slots.map((slot: any) => {
            const userReservation = slot.reservations?.find(
                (r: any) => r.parent?.toString() === session.user.id
            );
            return {
                ...slot,
                isReservedByMe: !!userReservation,
                myReservationStatus: userReservation?.status,
                remainingSpots: slot.maxParticipants - (slot.currentParticipants || 0),
            };
        });

        return NextResponse.json({
            success: true,
            slots: enrichedSlots,
        });

    } catch (error) {
        console.error('[BOOKINGS_GET] Error:', error);
        return NextResponse.json({ error: 'Wystąpił błąd.' }, { status: 500 });
    }
}

// POST - Create reservation (parents only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Nie jesteś zalogowany.' }, { status: 401 });
        }

        if (session.user.profileType !== UserRoles.PARENT) {
            return NextResponse.json({
                error: 'Tylko rodzice mogą rezerwować miejsca.'
            }, { status: 403 });
        }

        const schoolId = await getSchoolContext(session.user.id);
        if (!schoolId) {
            return NextResponse.json({ error: 'Nie należysz do żadnej szkoły.' }, { status: 403 });
        }

        await connectMongoDB();

        const body = await request.json();
        const { slotId, studentId } = body;

        if (!slotId) {
            return NextResponse.json({ error: 'ID slotu jest wymagane.' }, { status: 400 });
        }

        // Find the slot
        const slot = await BookingSlot.findOne({
            _id: slotId,
            school: schoolId,
            isAvailable: true,
        });

        if (!slot) {
            return NextResponse.json({ error: 'Nie znaleziono slotu.' }, { status: 404 });
        }

        // Check if already full
        if (slot.currentParticipants >= slot.maxParticipants) {
            return NextResponse.json({ error: 'Brak wolnych miejsc.' }, { status: 400 });
        }

        // Check if registration deadline passed
        if (slot.registrationDeadline && new Date() > slot.registrationDeadline) {
            return NextResponse.json({
                error: 'Termin rejestracji minął.'
            }, { status: 400 });
        }

        // Check if parent already has a reservation
        const existingReservation = slot.reservations.find(
            (r: any) => r.parent?.toString() === session.user.id
        );

        if (existingReservation) {
            return NextResponse.json({
                error: 'Masz już rezerwację na ten termin.'
            }, { status: 400 });
        }

        // Add reservation
        slot.reservations.push({
            parent: session.user.id,
            student: studentId || null,
            reservedAt: new Date(),
            status: 'confirmed',
            confirmationSent: false,
        });
        slot.currentParticipants += 1;

        await slot.save();

        // TODO: Send confirmation email
        console.log('[BOOKINGS] Reservation confirmed for:', session.user.id, slotId);

        return NextResponse.json({
            success: true,
            message: 'Rezerwacja została potwierdzona.',
            slot,
        });

    } catch (error) {
        console.error('[BOOKINGS_POST] Error:', error);
        return NextResponse.json({ error: 'Wystąpił błąd.' }, { status: 500 });
    }
}

// DELETE - Cancel reservation
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Nie jesteś zalogowany.' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const slotId = searchParams.get('slotId');

        if (!slotId) {
            return NextResponse.json({ error: 'ID slotu jest wymagane.' }, { status: 400 });
        }

        const schoolId = await getSchoolContext(session.user.id);
        if (!schoolId) {
            return NextResponse.json({ error: 'Nie należysz do żadnej szkoły.' }, { status: 403 });
        }

        await connectMongoDB();

        const slot = await BookingSlot.findOne({
            _id: slotId,
            school: schoolId,
        });

        if (!slot) {
            return NextResponse.json({ error: 'Nie znaleziono slotu.' }, { status: 404 });
        }

        // Find and remove reservation
        const reservationIndex = slot.reservations.findIndex(
            (r: any) => r.parent?.toString() === session.user.id
        );

        if (reservationIndex === -1) {
            return NextResponse.json({ error: 'Nie masz rezerwacji.' }, { status: 400 });
        }

        slot.reservations.splice(reservationIndex, 1);
        slot.currentParticipants = Math.max(0, slot.currentParticipants - 1);

        await slot.save();

        return NextResponse.json({
            success: true,
            message: 'Rezerwacja została anulowana.',
        });

    } catch (error) {
        console.error('[BOOKINGS_DELETE] Error:', error);
        return NextResponse.json({ error: 'Wystąpił błąd.' }, { status: 500 });
    }
}
