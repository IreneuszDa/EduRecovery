'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Subject } from './SubjectSelectionPage';
import {
    ArrowLeft,
    ArrowRight,
    PartyPopper,
    CheckCircle,
    Code,
    Quote,
    ListOrdered,
    Image as ImageIcon
} from 'lucide-react';
import LearnView from '@/components/exams/LearnView';
import { FlashcardLearnSession } from '@/components/course/lesson/FlashcardLearnSession';
import { mockLessonDetails } from '@/components/course/lesson/mock-lesson-data';
import { LessonNodeData } from '@/app/dashboard/course/types';

interface LessonPageProps {
    subject: Subject;
    lesson: LessonNodeData;
    onComplete: () => void;
    onBack?: () => void; // Optional back handler
}

// Simplified animation variants for better performance
const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.2, ease: "easeOut" as const }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.15, ease: "easeIn" as const }
    },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" as const }
    }
};

export function LessonPage({ subject, lesson, onComplete, onBack }: LessonPageProps) {
    const [stage, setStage] = useState<'lesson' | 'activity' | 'completed'>('lesson');
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    // Memoize lesson details to prevent re-computation
    const lessonDetails = useMemo(() => mockLessonDetails[lesson.id], [lesson.id]);

    // Memoize computed values
    const { totalSections, currentSection, isLastSection } = useMemo(() => {
        if (!lessonDetails) return { totalSections: 0, currentSection: null, isLastSection: false };
        
        const totalSections = lessonDetails.contentSections.length;
        const currentSection = lessonDetails.contentSections[currentSectionIndex];
        const isLastSection = currentSectionIndex === totalSections - 1;
        
        return { totalSections, currentSection, isLastSection };
    }, [lessonDetails, currentSectionIndex]);

    // Scroll to top when section changes
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentSectionIndex]);

    // Memoized navigation handlers
    const goToNextSection = useCallback(() => {
        if (isLastSection) {
            // If this is the last section and there's an activity, move to activity stage
            if (lessonDetails?.activityType) {
                setStage('activity');
            } else {
                // If there's no activity, complete the lesson
                setStage('completed');
            }
        } else {
            // Move to next section
            setCurrentSectionIndex(prev => prev + 1);
        }
    }, [isLastSection, lessonDetails?.activityType]);

    const goToPreviousSection = useCallback(() => {
        if (currentSectionIndex > 0) {
            setCurrentSectionIndex(prev => prev - 1);
        }
    }, [currentSectionIndex]);

    // Early return for error state
    if (!lessonDetails) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center text-red-500">
                Błąd: Brak danych dla lekcji o ID {lesson.id}.
            </div>
        );
    }

    // --- RENDER FUNCTIONS FOR EACH CONTENT TYPE (MEMOIZED) ---

    const renderContentSection = useCallback((section: any) => {
        const key = `${section.type}-${currentSectionIndex}`;
        
        switch (section.type) {
            case 'text':
                return (
                    <div
                        key={key}
                        className="prose dark:prose-invert max-w-none mb-8 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]"
                    >
                        <p className="text-lg leading-relaxed">{section.content}</p>
                    </div>
                );
            case 'list':
                return (
                    <div
                        key={key}
                        className="mb-8 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]"
                    >
                        {section.caption && (
                            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3">{section.caption}</h3>
                        )}
                        <ul className="list-disc pl-6 space-y-2">
                            {Array.isArray(section.content) && section.content.map((item: string, idx: number) => (
                                <li key={idx} className="text-slate-700 dark:text-slate-300">{item}</li>
                            ))}
                        </ul>
                    </div>
                );
            case 'code':
                return (
                    <div
                        key={key}
                        className="mb-8 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]"
                    >
                        <div className="bg-slate-800 text-slate-100 rounded-lg p-4 overflow-x-auto font-mono text-sm">
                            {typeof section.content === 'string' && section.content.split('\n').map((line: string, idx: number) => (
                                <div key={idx} className="whitespace-pre">{line}</div>
                            ))}
                        </div>
                        {section.caption && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">{section.caption}</p>
                        )}
                    </div>
                );
            case 'quote':
                return (
                    <div
                        key={key}
                        className="mb-8 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]"
                    >
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-700 dark:text-slate-300">
                            {section.content}
                            {section.caption && (
                                <footer className="text-sm text-slate-500 dark:text-slate-400 mt-2 not-italic">— {section.caption}</footer>
                            )}
                        </blockquote>
                    </div>
                );
            case 'image':
                return (
                    <div
                        key={key}
                        className="mb-8 flex flex-col items-center opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]"
                    >
                        <img
                            src={typeof section.content === 'string' ? section.content : ''}
                            alt={section.caption || 'Ilustracja'}
                            className="max-w-full rounded-lg shadow-md"
                        />
                        {section.caption && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{section.caption}</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    }, [currentSectionIndex]);

    // --- RENDER FUNCTIONS FOR EACH STAGE ---

    const renderLessonContent = () => (
        <motion.div
            key="lesson"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-3xl mx-auto"
        >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/40 mb-6 mx-auto">
                <subject.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>

            {/* Progress indicator */}
            <div className="w-full mb-6">
                <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
                    <span>Sekcja {currentSectionIndex + 1} z {totalSections}</span>
                    <span>{Math.round(((currentSectionIndex + 1) / totalSections) * 100)}% ukończone</span>
                </div>
                <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-1 bg-blue-500 transition-all duration-300"
                        style={{ width: `${((currentSectionIndex + 1) / totalSections) * 100}%` }}
                    ></div>
                </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                {lessonDetails.title}
            </h1>

            {/* Content section container with scroll */}
            <div
                ref={contentRef}
                className="w-full max-h-[60vh] overflow-y-auto mb-6 px-2 py-4 rounded-lg"
            >
                {renderContentSection(currentSection)}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={goToPreviousSection}
                    disabled={currentSectionIndex === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentSectionIndex === 0
                        ? 'opacity-50 cursor-not-allowed text-slate-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Poprzednia</span>
                </button>
                <button
                    onClick={goToNextSection}
                    className="flex items-center gap-2 px-8 py-3 font-semibold text-white bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all transform hover:-translate-y-1"
                >
                    <span>{isLastSection ? (lessonDetails.activityType ? 'Rozpocznij quiz' : 'Zakończ lekcję') : 'Dalej'}</span>
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );

    const renderActivity = () => (
        <motion.div
            key="activity"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full h-full flex flex-col items-center justify-center"
        >
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
                Sprawdź swoją wiedzę
            </h2>

            {lessonDetails.activityType === 'quiz' && (
                <>
                    <LearnView
                        exam={lessonDetails.activityData}
                        isEmbedded={true}
                    />
                    {/* Since LearnView doesn't have an `onComplete` prop, we add a manual button */}
                    <div className="mt-4">
                        <button onClick={() => setStage('completed')} className="px-6 py-2 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors">
                            Zakończ Test
                        </button>
                    </div>
                </>
            )}

            {lessonDetails.activityType === 'flashcards' && (
                <FlashcardLearnSession
                    cards={lessonDetails.activityData}
                    onSessionComplete={() => setStage('completed')}
                />
            )}

            {/* Back button to return to lesson content */}
            <button
                onClick={() => {
                    setStage('lesson');
                    setCurrentSectionIndex(totalSections - 1); // Go to the last content section
                }}
                className="mt-8 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
                <ArrowLeft className="h-4 w-4" />
                <span>Wróć do treści lekcji</span>
            </button>
        </motion.div>
    );

    const renderCompletion = () => (
        <motion.div
            key="completion"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center flex flex-col items-center max-w-lg"
        >
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/40 mb-6">
                <PartyPopper className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">Lekcja ukończona!</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
                Świetna robota! Udało Ci się ukończyć lekcję "{lessonDetails.title}".
            </p>

            {/* Summary points */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 mb-8 text-left w-full">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Czego się nauczyłeś:</h3>
                <ul className="space-y-3">
                    {lessonDetails.contentSections
                        .filter(section => section.type === 'text' || section.type === 'list')
                        .slice(0, 3)
                        .map((section, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-700 dark:text-slate-300">
                                    {section.type === 'text'
                                        ? typeof section.content === 'string'
                                            ? section.content.length > 100
                                                ? section.content.substring(0, 100) + '...'
                                                : section.content
                                            : 'Treść tekstowa'
                                        : section.caption || 'Ważne pojęcia i definicje'}
                                </span>
                            </li>
                        ))}
                </ul>
            </div>

            <button
                onClick={onComplete}
                className="px-8 py-3 font-semibold text-white bg-green-500 rounded-lg shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all transform hover:-translate-y-1"
            >
                Wróć do ścieżki nauki
            </button>
        </motion.div>
    );

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 flex flex-col">
            {/* Header with progress bar - shown for all stages except completion */}
            <AnimatePresence>
                {stage !== 'completed' && (
                    <motion.header
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10"
                    >
                        <div className="w-full max-w-4xl mx-auto flex items-center p-4">
                            {/* Header content - show back button when appropriate */}
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-3">
                                    <subject.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    <span className="font-medium text-slate-800 dark:text-slate-200">
                                        {subject.name}: {lesson.title}
                                    </span>
                                </div>

                                {/* Show back button for activity stage */}
                                {stage === 'activity' && (
                                    <button
                                        onClick={() => setStage('lesson')}
                                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        <span>Wróć do lekcji</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.header>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-grow w-full flex items-center justify-center p-4 pt-8">
                <AnimatePresence mode="wait">
                    {stage === 'lesson' && renderLessonContent()}
                    {stage === 'activity' && renderActivity()}
                    {stage === 'completed' && renderCompletion()}
                </AnimatePresence>
            </main>
        </div>
    );
}