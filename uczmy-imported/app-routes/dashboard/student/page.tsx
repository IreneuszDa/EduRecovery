'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    ClipboardList,
    Calendar,
    Trophy,
    Flame,
    Star,
    Clock,
    CheckCircle2,
    PlayCircle,
    MessageCircle,
    Target,
    Zap,
    Award,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useStreak } from '@/lib/hooks/useStreak';

// Premium Card Component
const PremiumCard = ({
    children,
    className = '',
    gradient = false,
    hover = true,
}: {
    children: React.ReactNode;
    className?: string;
    gradient?: boolean;
    hover?: boolean;
}) => (
    <motion.div
        whileHover={hover ? { y: -2, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : undefined}
        className={`
            ${gradient
                ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
                : 'bg-white dark:bg-slate-800'
            }
            rounded-2xl 
            border ${gradient ? 'border-transparent' : 'border-slate-200/60 dark:border-slate-700/60'}
            shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50
            backdrop-blur-sm
            transition-all duration-300
            ${className}
        `}
    >
        {children}
    </motion.div>
);

// Streak Badge Component
const StreakBadge = ({ count }: { count: number }) => (
    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full text-white font-bold shadow-lg shadow-orange-500/30">
        <Flame className="h-5 w-5" />
        <span>{count} dni z rzędu!</span>
    </div>
);

// Achievement Badge
const AchievementBadge = ({
    icon: Icon,
    label,
    earned = false
}: {
    icon: React.ElementType;
    label: string;
    earned?: boolean;
}) => (
    <div className={`
        flex flex-col items-center gap-2 p-3 rounded-xl
        ${earned
            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
            : 'bg-slate-100 dark:bg-slate-700/50 text-slate-400'
        }
        transition-all duration-300
    `}>
        <Icon className="h-6 w-6" />
        <span className="text-xs font-medium text-center">{label}</span>
    </div>
);

// Homework Card
const HomeworkCard = ({
    title,
    subject,
    deadline,
    progress,
    isUrgent = false
}: {
    title: string;
    subject: string;
    deadline: string;
    progress: number;
    isUrgent?: boolean;
}) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className={`
            p-4 rounded-xl border-2 
            ${isUrgent
                ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
            }
            cursor-pointer transition-all
        `}
    >
        <div className="flex items-start justify-between mb-3">
            <div>
                <p className="font-semibold text-slate-800 dark:text-white">{title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{subject}</p>
            </div>
            {isUrgent && (
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
                    Pilne!
                </span>
            )}
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span>{deadline}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {progress}%
                </span>
            </div>
        </div>
    </motion.div>
);

// Main Student Dashboard
export default function StudentDashboard() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        },
    });

    const [isLoading, setIsLoading] = useState(true);

    // Redirect if not a student
    useEffect(() => {
        if (session && session.user?.profileType !== 0) {
            redirect('/dashboard');
        }
    }, [session]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const { streak, currentDayIndex } = useStreak();

    // Mock data
    //const streakCount = 7; // Removed mock
    const totalPoints = 1250;
    const level = 12;

    const upcomingHomework = [
        { title: 'Past Simple - ćwiczenia', subject: 'Angielski', deadline: 'Za 2 dni', progress: 30, isUrgent: false },
        { title: 'Równania kwadratowe', subject: 'Matematyka', deadline: 'Jutro!', progress: 0, isUrgent: true },
        { title: 'Czasy przeszłe - test', subject: 'Angielski', deadline: 'Za 5 dni', progress: 0, isUrgent: false },
    ];

    const upcomingLessons = [
        { time: '15:00', subject: 'Angielski', topic: 'Present Perfect', teacher: 'Anna Kowalska' },
        { time: '17:00', subject: 'Matematyka', topic: 'Funkcje', teacher: 'Jan Nowak' },
    ];

    const achievements = [
        { icon: Flame, label: 'Seria 7 dni', earned: true },
        { icon: Target, label: 'Cel tygodnia', earned: true },
        { icon: Star, label: 'Pierwsza 5', earned: true },
        { icon: Zap, label: 'Speed Master', earned: false },
        { icon: Award, label: 'Top Klasy', earned: false },
        { icon: Trophy, label: 'Mistrz', earned: false },
    ];

    if (status === 'loading' || isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header with Gamification */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                            Cześć, {session?.user?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Świetnie Ci idzie! Kontynuuj naukę.
                        </p>
                    </div>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    {/* Points Card */}
                    <PremiumCard gradient className="p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm">Twoje punkty</p>
                                <p className="text-4xl font-bold mt-1">{totalPoints}</p>
                                <p className="text-white/70 text-sm mt-2">Poziom {level}</p>
                            </div>
                            <div className="p-4 bg-white/20 rounded-2xl">
                                <Star className="h-8 w-8" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-sm text-white/80 mb-1">
                                <span>Do następnego poziomu</span>
                                <span>750/1000</span>
                            </div>
                            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-white rounded-full" />
                            </div>
                        </div>
                    </PremiumCard>

                    {/* Streak Card */}
                    <PremiumCard className="p-6 overflow-visible">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Seria nauki</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Twoja regularność to klucz do sukcesu</p>
                            </div>
                        </div>
                        <div className="flex items-end justify-between gap-1 h-14">
                            {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'].map((day, i) => {
                                const isCompleted = i < streak && i <= currentDayIndex;
                                const isCurrentDay = i === currentDayIndex;
                                const isFuture = i > currentDayIndex;

                                return (
                                    <div
                                        key={i}
                                        className="relative flex flex-col items-center gap-2 group"
                                    >
                                        {isCurrentDay && (
                                            <span className="absolute -top-7 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800">
                                                Dziś
                                            </span>
                                        )}
                                        <div
                                            className={`
                                                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                                ${isCompleted
                                                    ? 'bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 scale-100'
                                                    : isCurrentDay
                                                        ? 'bg-white dark:bg-slate-800 border-2 border-blue-500 text-blue-600 dark:text-blue-400 shadow-xl shadow-blue-500/20 scale-110 z-10'
                                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'
                                                }
                                            `}
                                        >
                                            <span className="text-xs font-bold">
                                                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : day}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </PremiumCard>

                    {/* Quick Chat Card */}
                    <PremiumCard className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-800 dark:text-white">Korepetytor AI</h3>
                            <MessageCircle className="h-6 w-6 text-blue-500" />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Potrzebujesz pomocy? Zapytaj asystenta!
                        </p>
                        <Link href="/dashboard/chat">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg"
                            >
                                Rozpocznij czat
                            </motion.button>
                        </Link>
                    </PremiumCard>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Homework Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <PremiumCard className="p-6" hover={false}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5 text-purple-500" />
                                    Prace domowe
                                </h2>
                                <Link
                                    href="/dashboard/student/homework"
                                    className="text-sm text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                                >
                                    Zobacz wszystkie
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {upcomingHomework.map((hw, i) => (
                                    <HomeworkCard key={i} {...hw} />
                                ))}
                            </div>
                        </PremiumCard>
                    </motion.div>

                    {/* Right Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Today's Lessons */}
                        <PremiumCard className="p-6" hover={false}>
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-500" />
                                Dzisiejsze zajęcia
                            </h2>
                            <div className="space-y-3">
                                {upcomingLessons.map((lesson, i) => (
                                    <div
                                        key={i}
                                        className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                                {lesson.time}
                                            </span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                                {lesson.subject}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                            {lesson.topic}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </PremiumCard>

                    </motion.div>
                </div>
            </div>
        </div>
    );
}
