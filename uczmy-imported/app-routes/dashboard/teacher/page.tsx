'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Users,
    BookOpen,
    ClipboardList,
    Bell,
    Calendar,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    PlusCircle,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// Types
interface ClassSummary {
    _id: string;
    name: string;
    subject: string;
    studentCount: number;
}

interface QuickStat {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
}

interface RecentActivity {
    id: string;
    type: 'homework' | 'lesson' | 'announcement';
    title: string;
    description: string;
    time: string;
}

// Premium Card Component
const PremiumCard = ({
    children,
    className = '',
    hover = true
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

// Quick Action Button
const QuickAction = ({
    icon: Icon,
    label,
    href,
    color = 'blue'
}: {
    icon: React.ElementType;
    label: string;
    href: string;
    color?: 'blue' | 'green' | 'purple' | 'amber';
}) => {
    const colors = {
        blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        green: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
        purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
        amber: 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
    };

    return (
        <Link href={href}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                    flex items-center gap-3 p-4 rounded-xl
                    bg-gradient-to-r ${colors[color]}
                    text-white font-medium
                    cursor-pointer
                    shadow-lg
                    transition-all duration-200
                `}
            >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
                <ChevronRight className="h-4 w-4 ml-auto opacity-70" />
            </motion.div>
        </Link>
    );
};

// Stat Card
const StatCard = ({ stat }: { stat: QuickStat }) => (
    <PremiumCard className="p-5">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    {stat.label}
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {stat.value}
                </p>
                {stat.change && (
                    <p className={`text-xs mt-1 ${stat.changeType === 'positive' ? 'text-emerald-500' :
                        stat.changeType === 'negative' ? 'text-red-500' :
                            'text-slate-400'
                        }`}>
                        {stat.change}
                    </p>
                )}
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700/50">
                {stat.icon}
            </div>
        </div>
    </PremiumCard>
);

// Main Teacher Dashboard
export default function TeacherDashboard() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        },
    });

    const [classes, setClasses] = useState<ClassSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Redirect if not a teacher
    useEffect(() => {
        if (session && session.user?.profileType !== 1) {
            redirect('/dashboard');
        }
    }, [session]);

    // Mock data for demonstration
    const stats: QuickStat[] = [
        {
            label: 'Aktywne klasy',
            value: 5,
            icon: <Users className="h-5 w-5 text-blue-500" />,
            change: '+2 w tym miesiącu',
            changeType: 'positive'
        },
        {
            label: 'Uczniowie',
            value: 47,
            icon: <BookOpen className="h-5 w-5 text-emerald-500" />,
            change: '92% aktywnych',
            changeType: 'positive'
        },
        {
            label: 'Prace domowe',
            value: 12,
            icon: <ClipboardList className="h-5 w-5 text-purple-500" />,
            change: '3 oczekujące',
            changeType: 'neutral'
        },
        {
            label: 'Lekcje dziś',
            value: 4,
            icon: <Calendar className="h-5 w-5 text-amber-500" />,
        },
    ];

    const recentActivities: RecentActivity[] = [
        {
            id: '1',
            type: 'homework',
            title: 'Past Simple - test',
            description: 'Wysłano do grupy Angielski GR1',
            time: '2 godz. temu'
        },
        {
            id: '2',
            type: 'lesson',
            title: 'Matematyka - funkcje liniowe',
            description: 'Przeprowadzono lekcję z grupą MAT-2A',
            time: '5 godz. temu'
        },
        {
            id: '3',
            type: 'announcement',
            title: 'Odwołane zajęcia',
            description: 'Ogłoszenie wysłane do rodziców',
            time: 'wczoraj'
        },
    ];

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (status === 'loading' || isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                            Panel Nauczyciela
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Witaj, {session?.user?.name}! Oto przegląd Twojej aktywności.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/dashboard/teacher/homework/new">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Nowa praca domowa
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {stats.map((stat, index) => (
                        <StatCard key={index} stat={stat} />
                    ))}
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1"
                    >
                        <PremiumCard className="p-6" hover={false}>
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                                Szybkie akcje
                            </h2>
                            <div className="space-y-3">
                                <QuickAction
                                    icon={ClipboardList}
                                    label="Generator prac AI"
                                    href="/dashboard/teacher/homework/new"
                                    color="blue"
                                />
                                <QuickAction
                                    icon={BookOpen}
                                    label="Dziennik lekcyjny"
                                    href="/dashboard/teacher/lessons"
                                    color="green"
                                />
                                <QuickAction
                                    icon={Bell}
                                    label="Tablica ogłoszeń"
                                    href="/dashboard/teacher/announcements"
                                    color="purple"
                                />
                                <QuickAction
                                    icon={Users}
                                    label="Zarządzaj klasami"
                                    href="/dashboard/teacher/classes"
                                    color="amber"
                                />
                                <QuickAction
                                    icon={TrendingUp}
                                    label="Postępy uczniów"
                                    href="/dashboard/teacher/students"
                                    color="blue"
                                />
                            </div>
                        </PremiumCard>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <PremiumCard className="p-6" hover={false}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                                    Ostatnia aktywność
                                </h2>
                                <Link
                                    href="/dashboard/teacher/activity"
                                    className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                                >
                                    Zobacz wszystko
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        <div className={`p-2 rounded-lg ${activity.type === 'homework' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                            activity.type === 'lesson' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                                                'bg-purple-100 dark:bg-purple-900/30'
                                            }`}>
                                            {activity.type === 'homework' ? (
                                                <ClipboardList className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            ) : activity.type === 'lesson' ? (
                                                <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <Bell className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-800 dark:text-white truncate">
                                                {activity.title}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                                {activity.description}
                                            </p>
                                        </div>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">
                                            {activity.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </PremiumCard>

                        {/* Today's Schedule */}
                        <PremiumCard className="p-6 mt-6" hover={false}>
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                                Dzisiejsze zajęcia
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { time: '10:00', class: 'Angielski GR1', topic: 'Past Simple', status: 'completed' },
                                    { time: '12:00', class: 'Matematyka 2A', topic: 'Funkcje liniowe', status: 'completed' },
                                    { time: '15:00', class: 'Angielski GR2', topic: 'Present Perfect', status: 'upcoming' },
                                    { time: '17:00', class: 'Matematyka 3B', topic: 'Równania kwadratowe', status: 'upcoming' },
                                ].map((lesson, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center gap-4 p-3 rounded-lg ${lesson.status === 'completed'
                                            ? 'bg-slate-50 dark:bg-slate-700/20 opacity-60'
                                            : 'bg-blue-50 dark:bg-blue-900/20'
                                            }`}
                                    >
                                        <div className="text-sm font-medium text-slate-600 dark:text-slate-300 w-14">
                                            {lesson.time}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-800 dark:text-white">
                                                {lesson.class}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {lesson.topic}
                                            </p>
                                        </div>
                                        {lesson.status === 'completed' ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <Clock className="h-5 w-5 text-blue-500" />
                                        )}
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
