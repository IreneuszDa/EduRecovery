'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarCheck,
    Clock,
    MapPin,
    Users,
    Video,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Plus
} from 'lucide-react';
import Link from 'next/link';

// Types
interface BookingSlot {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    duration: number;
    location: string;
    isOnline: boolean;
    maxParticipants: number;
    currentParticipants: number;
    isReserved: boolean;
}

// Premium Card
const PremiumCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`
        bg-white dark:bg-slate-800 
        rounded-2xl 
        border border-slate-200/60 dark:border-slate-700/60
        shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50
        ${className}
    `}>
        {children}
    </div>
);

// Booking Slot Card
const BookingSlotCard = ({
    slot,
    onReserve
}: {
    slot: BookingSlot;
    onReserve: () => void;
}) => {
    const isFull = slot.currentParticipants >= slot.maxParticipants;
    const spotsLeft = slot.maxParticipants - slot.currentParticipants;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`p-5 rounded-xl border ${slot.isReserved
                    ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20'
                    : isFull
                        ? 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/30 opacity-60'
                        : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                }`}
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white">
                        {slot.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {slot.description}
                    </p>
                </div>
                {slot.isReserved && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
                        <CheckCircle2 className="h-3 w-3" />
                        Zarezerwowane
                    </span>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300 mb-4">
                <span className="flex items-center gap-1.5">
                    <CalendarCheck className="h-4 w-4 text-blue-500" />
                    {slot.date}
                </span>
                <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-blue-500" />
                    {slot.time} ({slot.duration} min)
                </span>
                <span className="flex items-center gap-1.5">
                    {slot.isOnline ? (
                        <>
                            <Video className="h-4 w-4 text-purple-500" />
                            Online
                        </>
                    ) : (
                        <>
                            <MapPin className="h-4 w-4 text-amber-500" />
                            {slot.location}
                        </>
                    )}
                </span>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className={`text-sm font-medium ${isFull ? 'text-red-500' : spotsLeft <= 2 ? 'text-amber-500' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                        {isFull ? 'Brak miejsc' : `${spotsLeft} wolnych miejsc`}
                    </span>
                </div>

                {!slot.isReserved && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onReserve}
                        disabled={isFull}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${isFull
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                            }`}
                    >
                        Zarezerwuj
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

// Main Parent Bookings Page
export default function ParentBookingsPage() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        },
    });

    const [reservingId, setReservingId] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Mock booking slots
    const [slots, setSlots] = useState<BookingSlot[]>([
        {
            id: '1',
            title: 'Warsztaty maturalne - angielski',
            description: 'Intensywne przygotowanie do matury z języka angielskiego. Skupiamy się na częściach pisemnych i ustnych.',
            date: '5 stycznia 2025',
            time: '10:00',
            duration: 120,
            location: 'Sala 101',
            isOnline: false,
            maxParticipants: 12,
            currentParticipants: 9,
            isReserved: false,
        },
        {
            id: '2',
            title: 'Konsultacje indywidualne - matematyka',
            description: 'Indywidualne spotkanie z nauczycielem. Omówienie postępów i trudności.',
            date: '8 stycznia 2025',
            time: '15:00',
            duration: 30,
            location: '',
            isOnline: true,
            maxParticipants: 1,
            currentParticipants: 0,
            isReserved: false,
        },
        {
            id: '3',
            title: 'Zajęcia wyrównawcze - angielski',
            description: 'Dodatkowe zajęcia dla uczniów potrzebujących wsparcia w nauce angielskiego.',
            date: '10 stycznia 2025',
            time: '14:00',
            duration: 60,
            location: 'Sala 205',
            isOnline: false,
            maxParticipants: 8,
            currentParticipants: 8,
            isReserved: false,
        },
        {
            id: '4',
            title: 'Spotkanie z wychowawcą',
            description: 'Omówienie postępów ucznia, planu nauki i celów na nowy semestr.',
            date: '12 stycznia 2025',
            time: '16:30',
            duration: 45,
            location: '',
            isOnline: true,
            maxParticipants: 1,
            currentParticipants: 0,
            isReserved: true,
        },
    ]);

    const handleReserve = async (slotId: string) => {
        setReservingId(slotId);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setSlots(prev => prev.map(slot =>
            slot.id === slotId
                ? { ...slot, isReserved: true, currentParticipants: slot.currentParticipants + 1 }
                : slot
        ));

        setReservingId(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const myReservations = slots.filter(s => s.isReserved);
    const availableSlots = slots.filter(s => !s.isReserved);

    if (status === 'loading') {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/parent">
                        <button className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <CalendarCheck className="h-6 w-6 text-blue-500" />
                            Rezerwacje Zajęć
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Zarezerwuj miejsce na dodatkowe zajęcia i warsztaty
                        </p>
                    </div>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3"
                        >
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <p className="text-emerald-700 dark:text-emerald-300">
                                Rezerwacja potwierdzona! Otrzymasz powiadomienie email z szczegółami.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* My Reservations */}
                {myReservations.length > 0 && (
                    <PremiumCard className="p-6">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            Moje rezerwacje ({myReservations.length})
                        </h2>
                        <div className="space-y-4">
                            {myReservations.map((slot) => (
                                <BookingSlotCard
                                    key={slot.id}
                                    slot={slot}
                                    onReserve={() => { }}
                                />
                            ))}
                        </div>
                    </PremiumCard>
                )}

                {/* Available Slots */}
                <PremiumCard className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        Dostępne terminy
                    </h2>
                    <div className="space-y-4">
                        {availableSlots.map((slot) => (
                            <div key={slot.id} className="relative">
                                {reservingId === slot.id && (
                                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 rounded-xl flex items-center justify-center z-10">
                                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                                    </div>
                                )}
                                <BookingSlotCard
                                    slot={slot}
                                    onReserve={() => handleReserve(slot.id)}
                                />
                            </div>
                        ))}
                    </div>
                </PremiumCard>

                {/* Info Note */}
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Rezerwacje są bezpłatne i nie wymagają płatności online.
                            W przypadku zajęć płatnych, rozliczenie następuje bezpośrednio ze szkołą.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
