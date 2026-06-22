'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    FileText,
    Download,
    ArrowLeft,
    Loader2,
    Calendar,
    CheckCircle2,
    Award,
    BookOpen,
    Users,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';

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

// Circular Progress
const CircularProgress = ({ value, label, color }: { value: number; label: string; color: string }) => {
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-slate-200 dark:text-slate-700"
                    />
                    <motion.circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke={color}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1 }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-800 dark:text-white">{value}%</span>
                </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{label}</p>
        </div>
    );
};

// Main Report Page
export default function ReportPage() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        },
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [reportData, setReportData] = useState<any>(null);

    // Mock data for display
    const mockReport = {
        studentName: 'Anna Kowalska',
        period: 'Grudzień 2024',
        attendance: 95,
        homeworkCompletion: 92,
        averageScore: 88,
        streak: 14,
        points: 1250,
        level: 13,
        lessonsAttended: 19,
        lessonsTotal: 20,
        homeworkCompleted: 11,
        homeworkTotal: 12,
        topicsCovered: [
            'Past Simple - zdania twierdzące',
            'Past Simple - zdania pytające',
            'Past Simple - zdania przeczące',
            'Irregular verbs - część 1',
            'Irregular verbs - część 2',
        ],
        achievements: [
            '🏆 Tydzień bez przerwy',
            '📚 10 zadań domowych',
            '🌟 Najlepszy wynik w grupie',
        ],
    };

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setReportData(mockReport);
        setIsGenerating(false);
    };

    const handleDownloadPDF = () => {
        // In production, this would call an API to generate and download PDF
        alert('Funkcja pobierania PDF jest w trakcie implementacji.');
    };

    if (status === 'loading') {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/parent">
                            <button className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <FileText className="h-6 w-6 text-emerald-500" />
                                Raport Postępów
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                Szczegółowe podsumowanie nauki dziecka
                            </p>
                        </div>
                    </div>
                    {reportData && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg"
                        >
                            <Download className="h-4 w-4" />
                            Pobierz PDF
                        </motion.button>
                    )}
                </div>

                {!reportData ? (
                    /* Generate Report Section */
                    <PremiumCard className="p-8 text-center">
                        <FileText className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                            Wygeneruj raport postępów
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                            Raport zawiera szczegółowe informacje o frekwencji, wynikach i postępach w nauce.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGenerateReport}
                            disabled={isGenerating}
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Generuję...
                                </span>
                            ) : (
                                'Generuj raport za ostatni miesiąc'
                            )}
                        </motion.button>
                    </PremiumCard>
                ) : (
                    /* Report Content */
                    <>
                        {/* Student Info */}
                        <PremiumCard className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                        {mockReport.studentName}
                                    </h2>
                                    <p className="text-slate-500 flex items-center gap-2 mt-1">
                                        <Calendar className="h-4 w-4" />
                                        {mockReport.period}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-amber-500">🔥 {mockReport.streak}</p>
                                        <p className="text-xs text-slate-500">Streak</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-500">{mockReport.points}</p>
                                        <p className="text-xs text-slate-500">Punkty</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-500">Lv.{mockReport.level}</p>
                                        <p className="text-xs text-slate-500">Poziom</p>
                                    </div>
                                </div>
                            </div>
                        </PremiumCard>

                        {/* Progress Circles */}
                        <PremiumCard className="p-6">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                                Podsumowanie
                            </h3>
                            <div className="flex justify-around">
                                <CircularProgress value={mockReport.attendance} label="Frekwencja" color="#10B981" />
                                <CircularProgress value={mockReport.homeworkCompletion} label="Prace domowe" color="#3B82F6" />
                                <CircularProgress value={mockReport.averageScore} label="Średni wynik" color="#8B5CF6" />
                            </div>
                        </PremiumCard>

                        {/* Detailed Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PremiumCard className="p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <Users className="h-5 w-5 text-emerald-500" />
                                    <h3 className="font-semibold text-slate-800 dark:text-white">Obecność</h3>
                                </div>
                                <p className="text-3xl font-bold text-slate-800 dark:text-white">
                                    {mockReport.lessonsAttended}/{mockReport.lessonsTotal}
                                </p>
                                <p className="text-sm text-slate-500">lekcji</p>
                            </PremiumCard>

                            <PremiumCard className="p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <BookOpen className="h-5 w-5 text-blue-500" />
                                    <h3 className="font-semibold text-slate-800 dark:text-white">Prace domowe</h3>
                                </div>
                                <p className="text-3xl font-bold text-slate-800 dark:text-white">
                                    {mockReport.homeworkCompleted}/{mockReport.homeworkTotal}
                                </p>
                                <p className="text-sm text-slate-500">ukończonych</p>
                            </PremiumCard>
                        </div>

                        {/* Topics Covered */}
                        <PremiumCard className="p-6">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-indigo-500" />
                                Przerobione tematy
                            </h3>
                            <div className="space-y-2">
                                {mockReport.topicsCovered.map((topic, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        <span className="text-slate-700 dark:text-slate-300">{topic}</span>
                                    </div>
                                ))}
                            </div>
                        </PremiumCard>

                        {/* Achievements */}
                        <PremiumCard className="p-6">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <Award className="h-5 w-5 text-amber-500" />
                                Osiągnięcia w tym okresie
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {mockReport.achievements.map((achievement, i) => (
                                    <span
                                        key={i}
                                        className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-200 font-medium"
                                    >
                                        {achievement}
                                    </span>
                                ))}
                            </div>
                        </PremiumCard>
                    </>
                )}
            </div>
        </div>
    );
}
