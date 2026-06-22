'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Users,
    TrendingUp,
    TrendingDown,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
    BookOpen,
    Award,
    ChevronRight,
    Filter
} from 'lucide-react';
import Link from 'next/link';

// Types
interface StudentProgress {
    id: string;
    name: string;
    avatar?: string;
    attendance: number;
    homeworkCompletion: number;
    averageScore: number;
    streak: number;
    trend: 'up' | 'down' | 'stable';
    lastActivity: string;
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

// Progress Bar
const ProgressBar = ({ value, color = 'blue' }: { value: number; color?: string }) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-emerald-500',
        amber: 'bg-amber-500',
        red: 'bg-red-500',
    };

    return (
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}
            />
        </div>
    );
};

// Student Row
const StudentRow = ({ student }: { student: StudentProgress }) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
        if (score >= 60) return 'text-amber-600 dark:text-amber-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getAttendanceColor = (attendance: number) => {
        if (attendance >= 90) return 'green';
        if (attendance >= 70) return 'amber';
        return 'red';
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        >
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {student.name.charAt(0)}
                </div>

                {/* Name & Last Activity */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-800 dark:text-white truncate">
                            {student.name}
                        </p>
                        {student.trend === 'up' && (
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        )}
                        {student.trend === 'down' && (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {student.lastActivity}
                    </p>
                </div>

                {/* Streak */}
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <span className="text-lg">🔥</span>
                    <span className="font-medium text-amber-700 dark:text-amber-300 text-sm">
                        {student.streak}
                    </span>
                </div>

                {/* Attendance */}
                <div className="w-20 hidden md:block">
                    <p className="text-xs text-slate-500 mb-1">Obecność</p>
                    <ProgressBar value={student.attendance} color={getAttendanceColor(student.attendance)} />
                    <p className="text-xs text-right mt-0.5 text-slate-600 dark:text-slate-400">{student.attendance}%</p>
                </div>

                {/* Homework */}
                <div className="w-20 hidden md:block">
                    <p className="text-xs text-slate-500 mb-1">Prace</p>
                    <ProgressBar value={student.homeworkCompletion} color={student.homeworkCompletion >= 80 ? 'green' : 'amber'} />
                    <p className="text-xs text-right mt-0.5 text-slate-600 dark:text-slate-400">{student.homeworkCompletion}%</p>
                </div>

                {/* Average Score */}
                <div className="text-right">
                    <p className="text-xs text-slate-500">Średnia</p>
                    <p className={`text-lg font-bold ${getScoreColor(student.averageScore)}`}>
                        {student.averageScore}%
                    </p>
                </div>

                {/* Arrow */}
                <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
        </motion.div>
    );
};

// Main Progress Overview Page
export default function StudentProgressPage() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        },
    });

    const [selectedClass, setSelectedClass] = useState('all');
    const [sortBy, setSortBy] = useState<'name' | 'score' | 'attendance'>('name');

    // Mock data
    const classes = [
        { id: 'all', name: 'Wszystkie klasy' },
        { id: '1', name: 'Angielski GR1' },
        { id: '2', name: 'Matematyka 2A' },
        { id: '3', name: 'Angielski GR2' },
    ];

    const students: StudentProgress[] = [
        { id: '1', name: 'Anna Kowalska', attendance: 95, homeworkCompletion: 100, averageScore: 92, streak: 14, trend: 'up', lastActivity: '2 godz. temu' },
        { id: '2', name: 'Jan Nowak', attendance: 88, homeworkCompletion: 85, averageScore: 78, streak: 5, trend: 'stable', lastActivity: 'wczoraj' },
        { id: '3', name: 'Maria Wiśniewska', attendance: 92, homeworkCompletion: 95, averageScore: 88, streak: 21, trend: 'up', lastActivity: '1 godz. temu' },
        { id: '4', name: 'Piotr Zieliński', attendance: 75, homeworkCompletion: 60, averageScore: 55, streak: 0, trend: 'down', lastActivity: '5 dni temu' },
        { id: '5', name: 'Katarzyna Lewandowska', attendance: 98, homeworkCompletion: 100, averageScore: 95, streak: 30, trend: 'up', lastActivity: '30 min temu' },
        { id: '6', name: 'Michał Kamiński', attendance: 82, homeworkCompletion: 70, averageScore: 72, streak: 3, trend: 'stable', lastActivity: '3 dni temu' },
    ];

    // Calculate class stats
    const avgAttendance = Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length);
    const avgScore = Math.round(students.reduce((acc, s) => acc + s.averageScore, 0) / students.length);
    const avgHomework = Math.round(students.reduce((acc, s) => acc + s.homeworkCompletion, 0) / students.length);

    // Sort students
    const sortedStudents = [...students].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'score') return b.averageScore - a.averageScore;
        return b.attendance - a.attendance;
    });

    if (status === 'loading') {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/teacher">
                            <button className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <BarChart3 className="h-6 w-6 text-indigo-500" />
                                Postępy Uczniów
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                Monitoruj wyniki i aktywność
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm"
                        >
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm"
                        >
                            <option value="name">Sortuj: Nazwa</option>
                            <option value="score">Sortuj: Wynik</option>
                            <option value="attendance">Sortuj: Obecność</option>
                        </select>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PremiumCard className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Średnia obecność</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white">{avgAttendance}%</p>
                            </div>
                        </div>
                    </PremiumCard>

                    <PremiumCard className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Prace domowe</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white">{avgHomework}%</p>
                            </div>
                        </div>
                    </PremiumCard>

                    <PremiumCard className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Średni wynik</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white">{avgScore}%</p>
                            </div>
                        </div>
                    </PremiumCard>
                </div>

                {/* Students List */}
                <PremiumCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-500" />
                            Uczniowie ({students.length})
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {sortedStudents.map((student) => (
                            <StudentRow key={student.id} student={student} />
                        ))}
                    </div>
                </PremiumCard>

                {/* Alerts Section */}
                <PremiumCard className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        ⚠️ Uwagi
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-700 dark:text-red-300">
                                <strong>Piotr Zieliński</strong> ma niską obecność (75%) i spadający trend wyników
                            </p>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                            <Clock className="h-5 w-5 text-amber-500 flex-shrink-0" />
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                <strong>Michał Kamiński</strong> nie logował się od 3 dni
                            </p>
                        </div>
                    </div>
                </PremiumCard>
            </div>
        </div>
    );
}
