'use client';

import React, { useMemo, useCallback } from 'react';
import { Subject } from './SubjectSelectionPage'; // Assuming this path is correct
import { ArrowLeft, CheckCircle2, Circle, Lock, Rocket, ArrowRight } from 'lucide-react';
import { UserProgress, LessonNodeData } from '@/app/dashboard/course/types';

// --- MOCK DATA ---
const mockLearningPath: LessonNodeData[] = [
    {
        id: 1,
        title: 'Wprowadzenie do funkcji kwadratowych',
        status: 'completed',
        duration: 25,
        difficulty: 'beginner',
        subjectKey: 'mat_core',
        progress: 100
    },
    {
        id: 2,
        title: 'Postać ogólna, kanoniczna i iloczynowa',
        status: 'completed',
        duration: 30,
        difficulty: 'beginner',
        subjectKey: 'mat_core',
        progress: 100
    },
    {
        id: 3,
        title: 'Obliczanie delty i miejsc zerowych',
        status: 'unlocked',
        duration: 35,
        difficulty: 'intermediate',
        subjectKey: 'mat_core'
    },
    {
        id: 4,
        title: 'Wierzchołek paraboli i jego własności',
        status: 'locked',
        duration: 40,
        difficulty: 'intermediate',
        subjectKey: 'mat_core'
    },
    {
        id: 5,
        title: 'Nierówności kwadratowe',
        status: 'locked',
        duration: 45,
        difficulty: 'advanced',
        subjectKey: 'mat_core'
    },
    {
        id: 6,
        title: 'Zadania optymalizacyjne',
        status: 'locked',
        duration: 50,
        difficulty: 'advanced',
        subjectKey: 'mat_core'
    },
];


// --- PROPS INTERFACE (MODIFIED) ---
interface LearningPathPageProps {
    subject: Subject;
    onBack: () => void;
    onStartLesson: (lesson: LessonNodeData) => void;
    userProgress?: UserProgress | null;
}

// --- MAIN COMPONENT (OPTIMIZED) ---
export function LearningPathPage({ subject, onBack, onStartLesson, userProgress }: LearningPathPageProps) {
    const learningPath = mockLearningPath;

    // Memoize calculations to prevent re-computation on every render
    const { unlockedLesson, completedLessons, totalLessons, progressPercentage } = useMemo(() => {
        const unlockedLesson = learningPath.find(lesson => lesson.status === 'unlocked' || lesson.status === 'in-progress');
        const completedLessons = learningPath.filter(lesson => lesson.status === 'completed').length;
        const totalLessons = learningPath.length;
        const progressPercentage = (completedLessons / totalLessons) * 100;
        
        return { unlockedLesson, completedLessons, totalLessons, progressPercentage };
    }, [learningPath]);

    // Memoized lesson start handler
    const handleStartLesson = useCallback((lesson: LessonNodeData) => {
        if (lesson.status !== 'unlocked') return;
        onStartLesson(lesson);
    }, [onStartLesson]);

    return (
        // Enhanced page background with gradient
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">

            {/* Enhanced container with better styling */}
            <div className="w-full max-w-2xl rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-2xl border border-white/20 dark:border-slate-700/50 flex flex-col overflow-hidden">

                {/* Enhanced header with progress indicator */}
                <header className="p-6 border-b border-slate-200/80 dark:border-slate-700/80 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={onBack}
                            className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-md"
                            aria-label="Wróć do wyboru przedmiotu"
                        >
                            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                        </button>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                    <subject.icon className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                    {subject.name}
                                </h1>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Ścieżka nauki • {completedLessons}/{totalLessons} lekcji ukończone
                            </p>
                        </div>
                    </div>

                    {/* Progress bar - simplified animation */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Postęp kursu
                            </span>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {Math.round(progressPercentage)}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                            <div
                                className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                </header>

                {/* Enhanced learning path body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar max-h-96">
                    <div className="relative pl-6">
                        <div className="absolute left-[29px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-200 via-indigo-200 to-purple-200 dark:from-slate-600 dark:via-slate-600 dark:to-slate-600 rounded-full" />
                        <div className="space-y-8">
                            {learningPath.map((lesson) => (
                                <LessonNode
                                    key={lesson.id}
                                    lesson={lesson}
                                    onStart={() => handleStartLesson(lesson)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enhanced footer with call to action */}
                <footer className="p-6 border-t border-slate-200/80 dark:border-slate-700/80 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50">
                    {unlockedLesson ? (
                        <div className="space-y-3">
                            <div className="text-center">
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                    Kolejna lekcja
                                </p>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                                    {unlockedLesson.title}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    ⏱️ {unlockedLesson.duration} min •
                                    {unlockedLesson.difficulty === 'beginner' ? ' Podstawowy' :
                                        unlockedLesson.difficulty === 'intermediate' ? ' Średni' : ' Zaawansowany'}
                                </p>
                            </div>
                            <button
                                onClick={() => handleStartLesson(unlockedLesson)}
                                className="w-full flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-semibold text-white transition-all bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                            >
                                <Rocket className="h-5 w-5" />
                                <span>Rozpocznij lekcję</span>
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <span className="font-semibold text-green-800 dark:text-green-200">
                                    Gratulacje! Ukończyłeś wszystkie lekcje
                                </span>
                            </div>
                        </div>
                    )}
                </footer>
            </div>
        </div>
    );
}


// --- SUB-COMPONENT: LessonNode (OPTIMIZED WITH MEMO) ---
interface LessonNodeProps {
    lesson: LessonNodeData;
    onStart: () => void;
}

const LessonNode = React.memo(function LessonNode({ lesson, onStart }: LessonNodeProps) {
    const isClickable = lesson.status === 'unlocked' || lesson.status === 'in-progress';

    // Memoize status configuration to prevent re-creation
    const statusConfig = useMemo(() => ({
        completed: { Icon: CheckCircle2, iconClasses: "text-green-500" },
        unlocked: { Icon: Circle, iconClasses: "text-blue-500 animate-pulse" },
        'in-progress': { Icon: Circle, iconClasses: "text-orange-500 animate-pulse" },
        locked: { Icon: Lock, iconClasses: "text-slate-400 dark:text-slate-500" },
    }), []);

    const textConfig = useMemo(() => ({
        completed: "text-slate-400 dark:text-slate-500 line-through",
        unlocked: "font-semibold text-slate-700 dark:text-slate-200",
        'in-progress': "font-semibold text-orange-700 dark:text-orange-300",
        locked: "text-slate-400 dark:text-slate-500",
    }), []);

    const currentStatus = statusConfig[lesson.status];
    const currentText = textConfig[lesson.status];

    // Difficulty badge colors - memoized
    const difficultyColors = useMemo(() => ({
        beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    }), []);

    const difficultyText = useMemo(() => {
        switch (lesson.difficulty) {
            case 'beginner': return 'Podstawowy';
            case 'intermediate': return 'Średni';
            case 'advanced': return 'Zaawansowany';
            default: return lesson.difficulty;
        }
    }, [lesson.difficulty]);

    return (
        <div
            onClick={onStart}
            className={`relative flex items-center justify-between group ${isClickable ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg p-2 -m-2 transition-colors' : 'cursor-default'}`}
        >
            <div className="flex items-center">
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full z-10 bg-white dark:bg-slate-800">
                    <currentStatus.Icon className={`h-5 w-5 ${currentStatus.iconClasses}`} />
                </div>
                <div className="pl-10 space-y-1">
                    <div className="flex items-center space-x-2">
                        <span className={`text-sm ${currentText}`}>
                            {lesson.title}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${difficultyColors[lesson.difficulty]}`}>
                            {difficultyText}
                        </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>⏱️ {lesson.duration} min</span>
                        {lesson.progress !== undefined && (
                            <span>📊 {lesson.progress}%</span>
                        )}
                        {lesson.lastAccessed && (
                            <span>📅 {lesson.lastAccessed.toLocaleDateString()}</span>
                        )}
                    </div>
                </div>
            </div>

            {isClickable && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-blue-500" />
                </div>
            )}
        </div>
    );
});