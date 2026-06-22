'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PlanDashboard } from '@/components/course/PlanDashboard';
import { Subject } from '@/components/course/SubjectSelectionPage';
import type { UserProgress } from './types';

export default function CourseDashboardPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize user progress data
    useEffect(() => {
        const initializeProgress = async () => {
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

        if (session) {
            initializeProgress();
        }
    }, [session]);

    // Navigation handlers
    const handleNavigateToSubjects = () => {
        router.push('/dashboard/course/subjects');
    };

    const handleNavigateToAnalytics = () => {
        router.push('/dashboard/course/analytics');
    };

    const handleSubjectSelect = (subject: Subject) => {
        // Store subject in sessionStorage for use in other pages
        sessionStorage.setItem('selectedSubject', JSON.stringify(subject));
        router.push('/dashboard/course/subjects');
    };

    // Loading state
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
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Ładowanie planu nauki...</span>
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
                        Brak danych o postępach
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Zaloguj się, aby zobaczyć swoje postępy w nauce.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <PlanDashboard
            userProgress={userProgress}
            onNavigateToSubjects={handleNavigateToSubjects}
            onNavigateToAnalytics={handleNavigateToAnalytics}
            onSubjectSelect={handleSubjectSelect}
        />
    );
}