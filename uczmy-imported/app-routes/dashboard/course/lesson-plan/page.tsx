'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { LessonPlanPage } from '@/components/course/LessonPlanPage';

export default function LessonPlanPageRoute() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedSubject, setSelectedSubject] = useState<'polish' | 'math'>('polish');

    // Get subject from URL params or default to polish
    useEffect(() => {
        const subject = searchParams.get('subject');
        if (subject === 'math' || subject === 'polish') {
            setSelectedSubject(subject);
        }
    }, [searchParams]);

    const handleBack = () => {
        router.push('/dashboard/course');
    };

    const handleSubjectChange = (subject: 'polish' | 'math') => {
        setSelectedSubject(subject);
        // Update URL without page reload
        const url = new URL(window.location.href);
        url.searchParams.set('subject', subject);
        window.history.pushState({}, '', url.toString());
    };

    return (
        <div className="space-y-4">
            {/* Header with navigation */}
            <div className="flex items-center justify-between">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={handleBack}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Powrót do dashboardu</span>
                </motion.button>

                {/* Subject toggle */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex space-x-2"
                >
                    <button
                        onClick={() => handleSubjectChange('polish')}
                        className={`px-4 py-2 rounded-xl transition-all ${selectedSubject === 'polish'
                                ? 'bg-green-500 text-white shadow-lg'
                                : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                            }`}
                    >
                        Plan Polski
                    </button>
                    <button
                        onClick={() => handleSubjectChange('math')}
                        className={`px-4 py-2 rounded-xl transition-all ${selectedSubject === 'math'
                                ? 'bg-purple-500 text-white shadow-lg'
                                : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                            }`}
                    >
                        Plan Matematyka
                    </button>
                </motion.div>
            </div>

            {/* Lesson plan content */}
            <motion.div
                key={selectedSubject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <LessonPlanPage subject={selectedSubject} />
            </motion.div>
        </div>
    );
}
