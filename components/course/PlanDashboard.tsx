'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    Target,
    TrendingUp,
    Award,
    Calendar,
    Zap,
    Brain,
    CheckCircle2,
    ArrowRight,
    Flame,
    Trophy,
    Star
} from 'lucide-react';
import { Subject } from './SubjectSelectionPage';
import { UserProgress } from '@/app/dashboard/course/types';

interface PlanDashboardProps {
    userProgress: UserProgress;
    onNavigateToSubjects: () => void;
    onNavigateToAnalytics: () => void;
    onSubjectSelect: (subject: Subject) => void;
}

// Helper function to get subject display info
const getSubjectInfo = (subjectKey: string) => {
    const subjectMap: Record<string, { name: string; icon: any }> = {
        'mat_core': { name: "Matematyka", icon: Target },
        'pl_core': { name: "Polski", icon: Star },
        'en_core': { name: "Angielski", icon: Trophy },
        'bio_sci': { name: "Biologia", icon: Brain }
    };
    return subjectMap[subjectKey];
};

export function PlanDashboard({
    userProgress,
    onNavigateToSubjects,
    onNavigateToAnalytics,
    onSubjectSelect
}: PlanDashboardProps) {

    const weeklyProgressPercentage = Math.min((userProgress.weeklyProgress / userProgress.weeklyGoal) * 100, 100);
    const isWeeklyGoalMet = userProgress.weeklyProgress >= userProgress.weeklyGoal;

    // Calculate recent achievements
    const achievements = [
        {
            icon: Flame,
            title: `${userProgress.currentStreak} dni z rzędu`,
            description: "Niezłomna passa nauki",
            color: "text-orange-500"
        },
        {
            icon: Trophy,
            title: `${userProgress.totalLessonsCompleted} lekcji`,
            description: "Ukończone z sukcesem",
            color: "text-yellow-500"
        },
        {
            icon: Clock,
            title: `${Math.floor(userProgress.totalTimeSpent / 60)}h ${userProgress.totalTimeSpent % 60}m`,
            description: "Czas poświęcony na naukę",
            color: "text-blue-500"
        }
    ];

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto max-w-7xl px-4 py-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Twój Plan Nauki
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Śledź swoje postępy i kontynuuj naukę
                    </p>
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Progress & Goals */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Weekly Progress Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                            Cel tygodniowy
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {userProgress.weeklyProgress} z {userProgress.weeklyGoal} minut
                                        </p>
                                    </div>
                                </div>
                                {isWeeklyGoalMet && (
                                    <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                            Osiągnięty!
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="relative">
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${weeklyProgressPercentage}%` }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        className={`h-3 rounded-full ${isWeeklyGoalMet
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                                            }`}
                                    />
                                </div>
                                <span className="absolute right-0 -top-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {Math.round(weeklyProgressPercentage)}%
                                </span>
                            </div>
                        </motion.div>

                        {/* Achievements Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-3 gap-4"
                        >
                            {achievements.map((achievement, index) => (
                                <div
                                    key={index}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 dark:border-slate-700/50"
                                >
                                    <div className="flex items-center space-x-3">
                                        <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                                                {achievement.title}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {achievement.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Subject Progress */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                    Postęp w przedmiotach
                                </h3>
                                <button
                                    onClick={onNavigateToSubjects}
                                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                >
                                    <span className="text-sm font-medium">Zobacz wszystkie</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(userProgress.subjectProgress).map(([subjectKey, progress]: [string, {
                                    completedLessons: number;
                                    totalLessons: number;
                                    timeSpent: number;
                                    lastActivity: Date;
                                }]) => {
                                    const subjectInfo = getSubjectInfo(subjectKey);
                                    if (!subjectInfo) return null;

                                    const progressPercentage = (progress.completedLessons / progress.totalLessons) * 100;
                                    const SubjectIcon = subjectInfo.icon;

                                    return (
                                        <div
                                            key={subjectKey}
                                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                            onClick={() => onSubjectSelect({ name: subjectInfo.name, icon: SubjectIcon, key: subjectKey })}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <SubjectIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                <div>
                                                    <p className="font-medium text-slate-800 dark:text-slate-100">
                                                        {subjectInfo.name}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        {progress.completedLessons} z {progress.totalLessons} lekcji
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-20 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                                    <div
                                                        className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                                        style={{ width: `${progressPercentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                    {Math.round(progressPercentage)}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Analytics */}
                    <div className="space-y-6">

                        {/* Streak & Motivation */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 rounded-2xl p-6 shadow-xl text-white"
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <Flame className="w-8 h-8" />
                                <div>
                                    <h3 className="text-xl font-bold">
                                        {userProgress.currentStreak} dni passę!
                                    </h3>
                                    <p className="text-white/80">
                                        Nie przerywaj swojej passy
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-white/90">
                                    Świetnie Ci idzie! Kontynuuj naukę, aby utrzymać passę.
                                </p>
                                <div className="flex items-center space-x-2">
                                    {[...Array(7)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-3 h-3 rounded-full ${i < userProgress.currentStreak
                                                ? 'bg-white'
                                                : 'bg-white/30'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Study Tips */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50"
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <Brain className="w-6 h-6 text-indigo-600" />
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                    Wskazówka dnia
                                </h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Najlepszy czas na naukę to 15-25 minut intensywnej pracy,
                                a następnie 5-minutowa przerwa. Ta technika zwiększa koncentrację!
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
