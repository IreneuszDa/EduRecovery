'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    User,
    Users,
    BookOpen,
    Calendar,
    TrendingUp,
    Bell,
    FileText,
    CheckCircle2,
    AlertCircle,
    Clock,
    ChevronRight,
    Download,
    CalendarCheck
} from 'lucide-react';
import Link from 'next/link';

// Premium Card Component
const PremiumCard = ({
    children,
    className = '',
    hover = true,
}: {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}) => (
    <motion.div
        whileHover={hover ? { y: -2, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : undefined}
        className={`
            bg-white dark:bg-slate-800 
            rounded-2xl 
            border border-slate-200/60 dark:border-slate-700/60
            shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50
            backdrop-blur-sm
            transition-all duration-300
            ${className}
        `}
    >
        {children}
    </motion.div>
);

// Child Selector Component
const ChildSelector = ({
    children,
    selectedChild,
    onSelect
}: {
    children: { id: string; name: string; avatar?: string }[];
    selectedChild: string;
    onSelect: (id: string) => void;
}) => (
    <div className="flex gap-3 overflow-x-auto pb-2">
        {children.map((child) => (
            <button
                key={child.id}
                onClick={() => onSelect(child.id)}
                className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${selectedChild === child.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }
                `}
            >
                <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${selectedChild === child.id
                        ? 'bg-white/20'
                        : 'bg-blue-100 dark:bg-blue-900/50'
                    }
                `}>
                    <User className={`h-5 w-5 ${selectedChild === child.id ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <span className="font-medium whitespace-nowrap">{child.name}</span>
            </button>
        ))}
    </div>
);

// Progress Circle
const ProgressCircle = ({
    value,
    label,
    color = 'blue'
}: {
    value: number;
    label: string;
    color?: 'blue' | 'green' | 'amber';
}) => {
    const colors = {
        blue: 'text-blue-500',
        green: 'text-emerald-500',
        amber: 'text-amber-500',
    };
    const bgColors = {
        blue: 'stroke-blue-500',
        green: 'stroke-emerald-500',
        amber: 'stroke-amber-500',
    };

    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-slate-200 dark:text-slate-700"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        className={bgColors[color]}
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset,
                            transition: 'stroke-dashoffset 0.5s ease',
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xl font-bold ${colors[color]}`}>{value}%</span>
                </div>
            </div>
            <span className="mt-2 text-sm text-slate-600 dark:text-slate-400">{label}</span>
        </div>
    );
};

// Announcement Card
const AnnouncementCard = ({
    title,
    content,
    date,
    priority,
    isRead
}: {
    title: string;
    content: string;
    date: string;
    priority: 'normal' | 'important' | 'urgent';
    isRead: boolean;
}) => (
    <div className={`
        p-4 rounded-xl border-l-4
        ${priority === 'urgent'
            ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20'
            : priority === 'important'
                ? 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/20'
                : 'border-l-blue-500 bg-slate-50 dark:bg-slate-700/30'
        }
        ${!isRead ? 'ring-2 ring-blue-300 dark:ring-blue-600' : ''}
    `}>
        <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                {!isRead && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                {title}
            </h4>
            <span className="text-xs text-slate-500">{date}</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{content}</p>
    </div>
);

// Main Parent Dashboard
export default function ParentDashboard() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        },
    });

    const [isLoading, setIsLoading] = useState(true);
    const [selectedChild, setSelectedChild] = useState('1');

    // Redirect if not a parent
    useEffect(() => {
        if (session && session.user?.profileType !== 2) {
            redirect('/dashboard');
        }
    }, [session]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Mock data
    const children = [
        { id: '1', name: 'Kasia Kowalska' },
        { id: '2', name: 'Tomek Kowalski' },
    ];

    const progressStats = {
        attendance: 92,
        homework: 85,
        avgGrade: 78,
    };

    const recentGrades = [
        { subject: 'Angielski', title: 'Past Simple test', grade: '8/10', date: '28 gru' },
        { subject: 'Matematyka', title: 'Kartkówka - funkcje', grade: '5/5', date: '26 gru' },
        { subject: 'Angielski', title: 'Słownictwo', grade: '7/10', date: '22 gru' },
    ];

    const recentTopics = [
        { date: '30 gru', subject: 'Angielski', topic: 'Present Perfect - zdania twierdzące' },
        { date: '28 gru', subject: 'Matematyka', topic: 'Funkcje liniowe i ich wykresy' },
        { date: '23 gru', subject: 'Angielski', topic: 'Past Simple vs. Past Continuous' },
    ];

    const announcements = [
        {
            title: 'Zmiana godziny zajęć',
            content: 'Zajęcia z angielskiego w piątek przeniesione na godz. 16:00',
            date: 'dziś',
            priority: 'important' as const,
            isRead: false
        },
        {
            title: 'Przerwa świąteczna',
            content: 'Szkoła nieczynna w dniach 24-26 grudnia.',
            date: '20 gru',
            priority: 'normal' as const,
            isRead: true
        },
    ];

    const upcomingBookings = [
        { title: 'Warsztaty maturalne - angielski', date: '5 sty, 10:00', spots: '3/12' },
        { title: 'Konsultacje indywidualne', date: '8 sty, 15:00', spots: '1/1' },
    ];

    if (status === 'loading' || isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                        Panel Rodzica
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Śledź postępy swojego dziecka
                    </p>
                </motion.div>

                {/* Child Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <ChildSelector
                        children={children}
                        selectedChild={selectedChild}
                        onSelect={setSelectedChild}
                    />
                </motion.div>

                {/* Progress Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <PremiumCard className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-emerald-500" />
                                Podsumowanie postępów
                            </h2>
                            <Link href="/dashboard/parent/progress">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    <Download className="h-4 w-4" />
                                    Pobierz raport PDF
                                </motion.button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-3 gap-8 justify-items-center">
                            <ProgressCircle value={progressStats.attendance} label="Frekwencja" color="green" />
                            <ProgressCircle value={progressStats.homework} label="Prace domowe" color="blue" />
                            <ProgressCircle value={progressStats.avgGrade} label="Średnia ocen" color="amber" />
                        </div>
                    </PremiumCard>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Grades & Topics */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Recent Grades */}
                        <PremiumCard className="p-6" hover={false}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                                    Ostatnie oceny
                                </h2>
                                <Link
                                    href="/dashboard/parent/grades"
                                    className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                                >
                                    Wszystkie <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentGrades.map((grade, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30"
                                    >
                                        <div>
                                            <p className="font-medium text-slate-800 dark:text-white">{grade.title}</p>
                                            <p className="text-sm text-slate-500">{grade.subject}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-emerald-500">{grade.grade}</p>
                                            <p className="text-xs text-slate-400">{grade.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PremiumCard>

                        {/* Recent Topics */}
                        <PremiumCard className="p-6" hover={false}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-purple-500" />
                                    Zrealizowane tematy
                                </h2>
                            </div>
                            <div className="space-y-3">
                                {recentTopics.map((topic, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30"
                                    >
                                        <div className="text-sm font-medium text-slate-500 w-16">{topic.date}</div>
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-800 dark:text-white">{topic.topic}</p>
                                            <p className="text-sm text-slate-500">{topic.subject}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PremiumCard>
                    </motion.div>

                    {/* Right Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        {/* Announcements */}
                        <PremiumCard className="p-6" hover={false}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-amber-500" />
                                    Ogłoszenia
                                </h2>
                                <Link
                                    href="/dashboard/parent/inbox"
                                    className="text-sm text-blue-500 hover:text-blue-600"
                                >
                                    Zobacz wszystko
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {announcements.map((announcement, i) => (
                                    <AnnouncementCard key={i} {...announcement} />
                                ))}
                            </div>
                        </PremiumCard>

                        {/* Upcoming Bookings */}
                        <PremiumCard className="p-6" hover={false}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                    <CalendarCheck className="h-5 w-5 text-blue-500" />
                                    Rezerwacje
                                </h2>
                                <Link
                                    href="/dashboard/parent/bookings"
                                    className="text-sm text-blue-500 hover:text-blue-600"
                                >
                                    Zobacz więcej
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {upcomingBookings.map((booking, i) => (
                                    <div
                                        key={i}
                                        className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
                                    >
                                        <p className="font-medium text-slate-800 dark:text-white">{booking.title}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-sm text-slate-500 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {booking.date}
                                            </span>
                                            <span className="text-xs text-blue-600 dark:text-blue-400">
                                                {booking.spots} miejsc
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link href="/dashboard/parent/bookings/new">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full mt-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors font-medium"
                                >
                                    + Zarezerwuj zajęcia
                                </motion.button>
                            </Link>
                        </PremiumCard>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
