'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    BarChart3,
    TrendingUp,
    Clock,
    Target,
    Calendar,
    Award,
    BookOpen,
    Zap,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { UserProgress } from '@/app/dashboard/course/types';

interface PlanAnalyticsProps {
    userProgress: UserProgress;
    onBack: () => void;
}

// Mock data for charts and analytics
const weeklyData = [
    { day: 'Pon', minutes: 45, lessons: 2 },
    { day: 'Wt', minutes: 30, lessons: 1 },
    { day: 'Śr', minutes: 60, lessons: 3 },
    { day: 'Czw', minutes: 25, lessons: 1 },
    { day: 'Pt', minutes: 40, lessons: 2 },
    { day: 'Sob', minutes: 35, lessons: 2 },
    { day: 'Nie', minutes: 20, lessons: 1 },
];

const monthlyProgress = [
    { month: 'Sty', completed: 15, goal: 20 },
    { month: 'Lut', completed: 22, goal: 20 },
    { month: 'Mar', completed: 18, goal: 20 },
    { month: 'Kwi', completed: 25, goal: 20 },
];

export function PlanAnalytics({ userProgress, onBack }: PlanAnalyticsProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'weekly' | 'subjects'>('overview');

    const maxMinutes = Math.max(...weeklyData.map(d => d.minutes));
    const totalWeeklyMinutes = weeklyData.reduce((sum, day) => sum + day.minutes, 0);
    const averageDailyMinutes = Math.round(totalWeeklyMinutes / 7);

    const tabs = [
        { id: 'overview', label: 'Przegląd', icon: BarChart3 },
        { id: 'weekly', label: 'Tydzień', icon: Calendar },
        { id: 'subjects', label: 'Przedmioty', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto max-w-6xl px-4 py-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-4 mb-8"
                >
                    <button
                        onClick={onBack}
                        className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Analiza Postępów
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Szczegółowe statystyki Twojej nauki
                        </p>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex space-x-2 mb-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-2"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id
                                ? 'bg-white dark:bg-slate-700 shadow-md text-blue-600 dark:text-blue-400'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </motion.div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                            {/* Key Stats */}
                            <div className="xl:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                                            <BookOpen className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                                {userProgress.totalLessonsCompleted}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Ukończone lekcje
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                                {Math.floor(userProgress.totalTimeSpent / 60)}h
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Czas nauki
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                                            <Zap className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                                {userProgress.currentStreak}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Dni z rzędu
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                                            <Target className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                                {Math.round((userProgress.weeklyProgress / userProgress.weeklyGoal) * 100)}%
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Cel tygodniowy
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Progress Chart */}
                            <div className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
                                    Postęp miesięczny
                                </h3>
                                <div className="space-y-4">
                                    {monthlyProgress.map((month) => (
                                        <div key={month.month} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    {month.month}
                                                </span>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    {month.completed}/{month.goal} lekcji
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(month.completed / month.goal) * 100}%` }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                    className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performance Insights */}
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                                    Spostrzeżenia
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                        <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                                Świetny postęp!
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-300">
                                                Tempo nauki wzrosło o 25% w tym miesiącu
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                        <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                                Optymalna sesja
                                            </p>
                                            <p className="text-xs text-blue-600 dark:text-blue-300">
                                                Najlepsze wyniki w sesjach 25-30 minut
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'weekly' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Weekly Chart */}
                            <div className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
                                    Aktywność w tym tygodniu
                                </h3>
                                <div className="space-y-4">
                                    {weeklyData.map((day) => (
                                        <div key={day.day} className="flex items-center space-x-4">
                                            <div className="w-12 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                {day.day}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                                        {day.minutes} min
                                                    </span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {day.lessons} lekcji
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(day.minutes / maxMinutes) * 100}%` }}
                                                        transition={{ duration: 0.8, delay: 0.1 }}
                                                        className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Weekly Summary */}
                            <div className="space-y-6">
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                                        Podsumowanie tygodnia
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600 dark:text-slate-400">Łączny czas:</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-100">
                                                {totalWeeklyMinutes} min
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600 dark:text-slate-400">Średnio/dzień:</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-100">
                                                {averageDailyMinutes} min
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600 dark:text-slate-400">Aktywne dni:</span>
                                            <span className="font-medium text-slate-800 dark:text-slate-100">
                                                {weeklyData.filter(d => d.minutes > 0).length}/7
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                                    <h4 className="text-lg font-semibold mb-2">
                                        Najlepszy dzień
                                    </h4>
                                    <p className="text-indigo-100 mb-4">
                                        {weeklyData.reduce((max, day) => day.minutes > max.minutes ? day : max).day} -
                                        {' '}{Math.max(...weeklyData.map(d => d.minutes))} minut nauki
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <Award className="w-5 h-5" />
                                        <span className="text-sm">Świetna robota!</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'subjects' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(userProgress.subjectProgress).map(([subjectKey, progress]) => {
                                const progressPercentage = (progress.completedLessons / progress.totalLessons) * 100;
                                const timeInHours = Math.floor(progress.timeSpent / 60);
                                const timeInMinutes = progress.timeSpent % 60;

                                return (
                                    <div key={subjectKey} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                                        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                                            {subjectKey === 'mat_core' ? 'Matematyka' : 'Polski'}
                                        </h4>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">Postęp</span>
                                                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                                        {progress.completedLessons}/{progress.totalLessons} lekcji
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progressPercentage}%` }}
                                                        transition={{ duration: 1, delay: 0.2 }}
                                                        className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-center">
                                                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                                                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                                        {Math.round(progressPercentage)}%
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        Ukończone
                                                    </p>
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                                                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                                        {timeInHours}h {timeInMinutes}m
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        Czas nauki
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Ostatnia aktywność: {progress.lastActivity.toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
