'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { PlanAnalytics } from '@/components/course/PlanAnalytics';
import { UserProgress } from '../types';

export default function AnalyticsPage() {
    const router = useRouter();
    const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user progress
    useEffect(() => {
        const loadProgress = async () => {
            try {
                // In a real app, fetch from API
                const mockProgress: UserProgress = {
                    totalLessonsCompleted: 12,
                    totalTimeSpent: 360, // 6 hours
                    currentStreak: 5,
                    weeklyGoal: 300, // 5 hours per week
                    weeklyProgress: 180, // 3 hours this week
                    subjectProgress: {
                        'mat_core': {
                            completedLessons: 8,
                            totalLessons: 15,
                            timeSpent: 240,
                            lastActivity: new Date(),
                        },
                        'pl_core': {
                            completedLessons: 4,
                            totalLessons: 12,
                            timeSpent: 120,
                            lastActivity: new Date(Date.now() - 86400000), // yesterday
                        }
                    }
                };
                setUserProgress(mockProgress);
            } catch (error) {
                console.error('Failed to load user progress:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProgress();
    }, []);

    const handleBack = () => {
        router.push('/dashboard/course');
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] w-full flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Ładowanie analityki...</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!userProgress) {
        return (
            <div className="min-h-[60vh] w-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        Brak danych analitycznych
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Rozpocznij naukę, aby zobaczyć swoje statystyki.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Back button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleBack}
                className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
                <ChevronLeft className="w-4 h-4" />
                <span>Powrót do dashboardu</span>
            </motion.button>

            {/* Analytics content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <PlanAnalytics
                    userProgress={userProgress}
                    onBack={handleBack}
                />
            </motion.div>
        </div>
    );
}
