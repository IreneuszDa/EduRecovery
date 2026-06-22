'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Clock, Target, TrendingUp, Award, Brain,
    Calendar, CheckCircle, Circle, Play, Pause, RotateCcw,
    BarChart3, LineChart, PieChart, Activity, Star,
    BookOpenCheck, Sigma, Users, Lightbulb, MessageSquare,
    ChevronLeft, ChevronRight, Download, Share2
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, RadialBarChart, RadialBar, Pie } from 'recharts';

// --- TYPES ---
interface LessonPlanProps {
    subject: 'polish' | 'math';
}

interface LessonUnit {
    id: string;
    title: string;
    description: string;
    duration: number; // minutes
    difficulty: 'easy' | 'medium' | 'hard';
    type: 'theory' | 'practice' | 'quiz' | 'project';
    completed: boolean;
    score?: number;
    concepts: string[];
}

interface WeeklyProgress {
    week: string;
    completed: number;
    target: number;
    efficiency: number;
}

interface PerformanceData {
    subject: string;
    theory: number;
    practice: number;
    quiz: number;
    project: number;
}

// --- SAMPLE DATA ---
const polishLessonPlan: LessonUnit[] = [
    {
        id: 'pol_1',
        title: 'Analiza składniowa zdania',
        description: 'Nauka rozpoznawania części mowy i funkcji składniowych w zdaniu',
        duration: 45,
        difficulty: 'medium',
        type: 'theory',
        completed: true,
        score: 92,
        concepts: ['podmiot', 'orzeczenie', 'dopełnienie', 'przydawka']
    },
    {
        id: 'pol_2',
        title: 'Interpretacja utworu lirycznego',
        description: 'Analiza wiersza Adama Mickiewicza "Do M***"',
        duration: 60,
        difficulty: 'hard',
        type: 'theory',
        completed: true,
        score: 87,
        concepts: ['romantyzm', 'metafora', 'personifikacja', 'rytm']
    },
    {
        id: 'pol_3',
        title: 'Ćwiczenia stylistyczne',
        description: 'Praktyczne zadania z poprawy stylu wypowiedzi',
        duration: 30,
        difficulty: 'easy',
        type: 'practice',
        completed: true,
        score: 95,
        concepts: ['styl', 'składnia', 'leksyka', 'fleksja']
    },
    {
        id: 'pol_4',
        title: 'Quiz: Epoki literackie',
        description: 'Test sprawdzający znajomość podstawowych epok w literaturze polskiej',
        duration: 20,
        difficulty: 'medium',
        type: 'quiz',
        completed: false,
        concepts: ['średniowiecze', 'renesans', 'barok', 'oświecenie', 'romantyzm']
    },
    {
        id: 'pol_5',
        title: 'Projekt: Recenzja książki',
        description: 'Napisanie recenzji wybranej lektury szkolnej',
        duration: 90,
        difficulty: 'hard',
        type: 'project',
        completed: false,
        concepts: ['recenzja', 'argumentacja', 'ocena krytyczna', 'kompozycja']
    }
];

const mathLessonPlan: LessonUnit[] = [
    {
        id: 'mat_1',
        title: 'Funkcje kwadratowe',
        description: 'Wprowadzenie do funkcji kwadratowych i ich właściwości',
        duration: 50,
        difficulty: 'medium',
        type: 'theory',
        completed: true,
        score: 88,
        concepts: ['parabola', 'wierzchołek', 'miejsca zerowe', 'discriminanta']
    },
    {
        id: 'mat_2',
        title: 'Rozwiązywanie równań kwadratowych',
        description: 'Metody rozwiązywania równań kwadratowych',
        duration: 45,
        difficulty: 'medium',
        type: 'practice',
        completed: true,
        score: 91,
        concepts: ['wzór kwadratowy', 'faktoryzacja', 'dopełnianie do kwadratu']
    },
    {
        id: 'mat_3',
        title: 'Geometria analityczna',
        description: 'Równania prostych w układzie współrzędnych',
        duration: 40,
        difficulty: 'hard',
        type: 'theory',
        completed: true,
        score: 85,
        concepts: ['współczynnik kierunkowy', 'punkt przecięcia', 'równanie prostej']
    },
    {
        id: 'mat_4',
        title: 'Quiz: Funkcje i równania',
        description: 'Test sprawdzający umiejętności z zakresu funkcji i równań',
        duration: 25,
        difficulty: 'hard',
        type: 'quiz',
        completed: false,
        concepts: ['funkcje', 'równania', 'nierówności', 'wykresy']
    },
    {
        id: 'mat_5',
        title: 'Projekt: Modelowanie matematyczne',
        description: 'Zastosowanie funkcji kwadratowych w problemach rzeczywistych',
        duration: 75,
        difficulty: 'hard',
        type: 'project',
        completed: false,
        concepts: ['modelowanie', 'optymalizacja', 'zastosowania praktyczne']
    }
];

const weeklyProgressData: WeeklyProgress[] = [
    { week: 'Tydzień 1', completed: 8, target: 10, efficiency: 85 },
    { week: 'Tydzień 2', completed: 12, target: 10, efficiency: 95 },
    { week: 'Tydzień 3', completed: 9, target: 10, efficiency: 88 },
    { week: 'Tydzień 4', completed: 11, target: 10, efficiency: 92 },
    { week: 'Tydzień 5', completed: 7, target: 10, efficiency: 78 },
    { week: 'Tydzień 6', completed: 13, target: 10, efficiency: 98 }
];

const performanceData: PerformanceData[] = [
    { subject: 'Teoria', theory: 88, practice: 0, quiz: 0, project: 0 },
    { subject: 'Praktyka', theory: 0, practice: 93, quiz: 0, project: 0 },
    { subject: 'Quizy', theory: 0, practice: 0, quiz: 85, project: 0 },
    { subject: 'Projekty', theory: 0, practice: 0, quiz: 0, project: 79 }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// --- MAIN COMPONENT ---
export function LessonPlanPage({ subject }: LessonPlanProps) {
    const [selectedLesson, setSelectedLesson] = useState<LessonUnit | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'analytics'>('overview');

    // Debug logging
    console.log('LessonPlanPage rendered with subject:', subject);

    const lessonPlan = subject === 'polish' ? polishLessonPlan : mathLessonPlan;
    const subjectIcon = subject === 'polish' ? BookOpenCheck : Sigma;
    const subjectName = subject === 'polish' ? 'Język Polski' : 'Matematyka';
    const subjectColor = subject === 'polish' ? 'from-emerald-500 to-teal-600' : 'from-blue-500 to-indigo-600';

    const stats = useMemo(() => {
        const completed = lessonPlan.filter(l => l.completed).length;
        const total = lessonPlan.length;
        const avgScore = lessonPlan
            .filter(l => l.completed && l.score)
            .reduce((acc, l) => acc + (l.score || 0), 0) / lessonPlan.filter(l => l.completed && l.score).length || 0;
        const totalTime = lessonPlan.reduce((acc, l) => acc + l.duration, 0);
        const completedTime = lessonPlan.filter(l => l.completed).reduce((acc, l) => acc + l.duration, 0);

        return {
            completed,
            total,
            avgScore: Math.round(avgScore),
            totalTime,
            completedTime,
            progress: Math.round((completed / total) * 100)
        };
    }, [lessonPlan]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto max-w-7xl px-4 py-8">

                {/* --- HEADER --- */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-2xl bg-gradient-to-r ${subjectColor} text-white shadow-lg`}>
                                {React.createElement(subjectIcon, { className: "w-8 h-8" })}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                    Plan nauki - {subjectName}
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Spersonalizowany plan dopasowany do Twojego tempa
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                <Download className="w-4 h-4" />
                                <span>Eksportuj</span>
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all">
                                <Share2 className="w-4 h-4" />
                                <span>Udostępnij</span>
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex space-x-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                        {[
                            { id: 'overview', label: 'Przegląd', icon: Activity },
                            { id: 'lessons', label: 'Lekcje', icon: BookOpen },
                            { id: 'analytics', label: 'Analityka', icon: BarChart3 }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* --- CONTENT BASED ON ACTIVE TAB --- */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            key="overview"
                            stats={stats}
                            lessonPlan={lessonPlan}
                            subjectColor={subjectColor}
                            weeklyProgressData={weeklyProgressData}
                        />
                    )}
                    
                    {activeTab === 'lessons' && (
                        <LessonsTab
                            key="lessons"
                            lessonPlan={lessonPlan}
                            selectedLesson={selectedLesson}
                            setSelectedLesson={setSelectedLesson}
                            subjectColor={subjectColor}
                        />
                    )}
                    
                    {activeTab === 'analytics' && (
                        <AnalyticsTab
                            key="analytics"
                            lessonPlan={lessonPlan}
                            performanceData={performanceData}
                            weeklyProgressData={weeklyProgressData}
                            subjectColor={subjectColor}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// --- OVERVIEW TAB ---
interface OverviewTabProps {
    stats: any;
    lessonPlan: LessonUnit[];
    subjectColor: string;
    weeklyProgressData: WeeklyProgress[];
}

function OverviewTab({ stats, lessonPlan, subjectColor, weeklyProgressData }: OverviewTabProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Postęp"
                    value={`${stats.completed}/${stats.total}`}
                    subtitle={`${stats.progress}% ukończone`}
                    icon={Target}
                    color="bg-gradient-to-r from-blue-500 to-blue-600"
                    progress={stats.progress}
                />
                <StatsCard
                    title="Średnia ocena"
                    value={`${stats.avgScore}%`}
                    subtitle="Twoje wyniki"
                    icon={Award}
                    color="bg-gradient-to-r from-green-500 to-green-600"
                />
                <StatsCard
                    title="Czas nauki"
                    value={`${Math.round(stats.completedTime / 60)}h`}
                    subtitle={`z ${Math.round(stats.totalTime / 60)}h planowanych`}
                    icon={Clock}
                    color="bg-gradient-to-r from-purple-500 to-purple-600"
                />
                <StatsCard
                    title="Aktywność"
                    value="6 dni"
                    subtitle="W tym tygodniu"
                    icon={TrendingUp}
                    color="bg-gradient-to-r from-orange-500 to-orange-600"
                />
            </div>

            {/* Progress Chart and Recent Lessons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Progress Chart */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
                        Postęp tygodniowy
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <RechartsLineChart data={weeklyProgressData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="week" className="text-sm" />
                            <YAxis className="text-sm" />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="completed" 
                                stroke="#3b82f6" 
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                                activeDot={{ r: 7, fill: '#1d4ed8' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="target" 
                                stroke="#10b981" 
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                            />
                        </RechartsLineChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Lessons */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
                        Ostatnie lekcje
                    </h3>
                    <div className="space-y-4">
                        {lessonPlan.slice(0, 4).map((lesson) => (
                            <div key={lesson.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    lesson.completed 
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                                }`}>
                                    {lesson.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                        {lesson.title}
                                    </h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {lesson.duration} min • {lesson.type}
                                    </p>
                                </div>
                                {lesson.completed && lesson.score && (
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-green-600 dark:text-green-400">
                                            {lesson.score}%
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// --- LESSONS TAB ---
interface LessonsTabProps {
    lessonPlan: LessonUnit[];
    selectedLesson: LessonUnit | null;
    setSelectedLesson: (lesson: LessonUnit | null) => void;
    subjectColor: string;
}

function LessonsTab({ lessonPlan, selectedLesson, setSelectedLesson, subjectColor }: LessonsTabProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
            {/* Lessons List */}
            <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                    Lista lekcji
                </h2>
                {lessonPlan.map((lesson, index) => (
                    <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        index={index}
                        isSelected={selectedLesson?.id === lesson.id}
                        onSelect={() => setSelectedLesson(lesson)}
                        subjectColor={subjectColor}
                    />
                ))}
            </div>

            {/* Lesson Details */}
            <div className="lg:col-span-1">
                {selectedLesson ? (
                    <LessonDetails lesson={selectedLesson} />
                ) : (
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
                        <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Wybierz lekcję
                        </h3>
                        <p className="text-slate-500 dark:text-slate-500">
                            Kliknij na lekcję aby zobaczyć szczegóły
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// --- ANALYTICS TAB ---
interface AnalyticsTabProps {
    lessonPlan: LessonUnit[];
    performanceData: PerformanceData[];
    weeklyProgressData: WeeklyProgress[];
    subjectColor: string;
}

function AnalyticsTab({ lessonPlan, performanceData, weeklyProgressData }: AnalyticsTabProps) {
    const difficultyData = useMemo(() => {
        const counts = lessonPlan.reduce((acc, lesson) => {
            acc[lesson.difficulty] = (acc[lesson.difficulty] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return [
            { name: 'Łatwe', value: counts.easy || 0, color: '#10b981' },
            { name: 'Średnie', value: counts.medium || 0, color: '#f59e0b' },
            { name: 'Trudne', value: counts.hard || 0, color: '#ef4444' }
        ];
    }, [lessonPlan]);

    const typeData = useMemo(() => {
        const counts = lessonPlan.reduce((acc, lesson) => {
            acc[lesson.type] = (acc[lesson.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return [
            { name: 'Teoria', value: counts.theory || 0 },
            { name: 'Praktyka', value: counts.practice || 0 },
            { name: 'Quiz', value: counts.quiz || 0 },
            { name: 'Projekt', value: counts.project || 0 }
        ];
    }, [lessonPlan]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
        >
            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
                        Wyniki według typu zajęć
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="subject" className="text-sm" />
                            <YAxis className="text-sm" />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Bar dataKey="theory" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="practice" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="quiz" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="project" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
                        Rozkład trudności
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <RechartsPieChart>
                            <Pie
                                dataKey="value"
                                data={difficultyData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, value }: any) => `${name}: ${value}`}
                            >
                                {difficultyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
                        Efektywność tygodniowa
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <RadialBarChart data={weeklyProgressData.slice(-3)}>
                            <RadialBar dataKey="efficiency" cornerRadius={10} fill="#3b82f6" />
                            <Tooltip />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
                        Typy zajęć
                    </h3>
                    <div className="space-y-4">
                        {typeData.map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${(item.value / Math.max(...typeData.map(d => d.value))) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
                        Kluczowe metryki
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <div className="flex items-center space-x-2">
                                <Target className="w-5 h-5 text-blue-600" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">Ukończone</span>
                            </div>
                            <span className="text-lg font-bold text-blue-600">
                                {lessonPlan.filter(l => l.completed).length}/{lessonPlan.length}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <div className="flex items-center space-x-2">
                                <Award className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">Śr. wynik</span>
                            </div>
                            <span className="text-lg font-bold text-green-600">
                                {Math.round(lessonPlan.filter(l => l.completed && l.score).reduce((acc, l) => acc + (l.score || 0), 0) / lessonPlan.filter(l => l.completed && l.score).length || 0)}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-purple-600" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">Czas</span>
                            </div>
                            <span className="text-lg font-bold text-purple-600">
                                {Math.round(lessonPlan.filter(l => l.completed).reduce((acc, l) => acc + l.duration, 0) / 60)}h
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// --- HELPER COMPONENTS ---
interface StatsCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ComponentType<any>;
    color: string;
    progress?: number;
}

function StatsCard({ title, value, subtitle, icon: Icon, color, progress }: StatsCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${color} text-white`}>
                    <Icon className="w-6 h-6" />
                </div>
                {progress !== undefined && (
                    <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{progress}%</div>
                    </div>
                )}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                {title}
            </h3>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {value}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
            </p>
            {progress !== undefined && (
                <div className="mt-4">
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        />
                    </div>
                </div>
            )}
        </motion.div>
    );
}

interface LessonCardProps {
    lesson: LessonUnit;
    index: number;
    isSelected: boolean;
    onSelect: () => void;
    subjectColor: string;
}

function LessonCard({ lesson, index, isSelected, onSelect, subjectColor }: LessonCardProps) {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'theory': return Brain;
            case 'practice': return Target;
            case 'quiz': return CheckCircle;
            case 'project': return Lightbulb;
            default: return BookOpen;
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400';
        }
    };

    const TypeIcon = getTypeIcon(lesson.type);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className={`cursor-pointer transition-all duration-300 ${
                isSelected 
                    ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
                    : 'hover:shadow-lg'
            }`}
            onClick={onSelect}
        >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            lesson.completed 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                        }`}>
                            {lesson.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                {lesson.title}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <TypeIcon className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    {lesson.type} • {lesson.duration} min
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getDifficultyColor(lesson.difficulty)}`}>
                            {lesson.difficulty}
                        </span>
                        {lesson.completed && lesson.score && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
                                {lesson.score}%
                            </span>
                        )}
                    </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {lesson.description}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                        {lesson.concepts.slice(0, 3).map((concept, i) => (
                            <span key={i} className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-md">
                                {concept}
                            </span>
                        ))}
                        {lesson.concepts.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-md">
                                +{lesson.concepts.length - 3}
                            </span>
                        )}
                    </div>
                    {!lesson.completed && (
                        <button className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-all">
                            <Play className="w-3 h-3" />
                            <span>Start</span>
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function LessonDetails({ lesson }: { lesson: LessonUnit }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sticky top-8"
        >
            <div className="flex items-center space-x-3 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    lesson.completed 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}>
                    {lesson.completed ? <CheckCircle className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {lesson.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {lesson.type} • {lesson.duration} minut
                    </p>
                </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 mb-6">
                {lesson.description}
            </p>

            <div className="space-y-4 mb-6">
                <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                        Kluczowe pojęcia
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {lesson.concepts.map((concept, i) => (
                            <span key={i} className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg">
                                {concept}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                            Trudność
                        </h4>
                        <span className={`px-2 py-1 text-sm rounded-lg ${
                            lesson.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            lesson.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                            {lesson.difficulty}
                        </span>
                    </div>
                    <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                            Status
                        </h4>
                        <span className={`px-2 py-1 text-sm rounded-lg ${
                            lesson.completed 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                            {lesson.completed ? 'Ukończone' : 'Do zrobienia'}
                        </span>
                    </div>
                </div>

                {lesson.completed && lesson.score && (
                    <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                            Wynik
                        </h4>
                        <div className="flex items-center space-x-3">
                            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                                    style={{ width: `${lesson.score}%` }}
                                />
                            </div>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                {lesson.score}%
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {!lesson.completed && (
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all">
                    <Play className="w-5 h-5" />
                    <span>Rozpocznij lekcję</span>
                </button>
            )}
        </motion.div>
    );
}
