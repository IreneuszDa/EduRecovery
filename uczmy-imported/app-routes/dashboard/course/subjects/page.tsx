'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, BookOpen, Brain, Target, Sparkles, ChevronRight, Play, ArrowRight } from 'lucide-react';
import { Subject } from '@/components/course/SubjectSelectionPage';
import { LearningPathPage } from '@/components/course/LearningPathPage';
import { LessonPage } from '@/components/course/LessonPage';
import { UserProgress, LessonNodeData } from '../types';

// Types for the adaptive course selection
interface CourseStep {
    id: string;
    type: 'subject' | 'topic' | 'goal' | 'level' | 'confirmation';
    question: string;
    description?: string;
    options: CourseOption[];
}

interface CourseOption {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    color?: string;
    nextStep?: string;
    subject?: Subject;
}

interface UserSelection {
    subject?: string;
    topic?: string;
    goal?: string;
    level?: string;
}

// Mock current courses data
const mockCurrentCourses = [
    {
        id: 1,
        subject: 'Matematyka',
        topic: 'Funkcje kwadratowe',
        progress: 65,
        nextLesson: 'Obliczanie delty i miejsc zerowych',
        color: 'from-blue-500 to-indigo-600',
        icon: '📐'
    },
    {
        id: 2,
        subject: 'Język Polski',
        topic: 'Analiza tekstu literackiego',
        progress: 40,
        nextLesson: 'Interpretacja motywów',
        color: 'from-purple-500 to-pink-600',
        icon: '📚'
    }
];

// Adaptive course selection flow
const courseSelectionSteps: Record<string, CourseStep> = {
    subject: {
        id: 'subject',
        type: 'subject',
        question: 'Z czego chcesz się uczyć?',
        description: 'Wybierz przedmiot, który Cię interesuje',
        options: [
            {
                id: 'math',
                title: 'Matematyka',
                description: 'Algebra, geometria, analiza',
                icon: '🔢',
                color: 'from-blue-500 to-indigo-600',
                nextStep: 'math_topic'
            },
            {
                id: 'polish',
                title: 'Język Polski',
                description: 'Literatura, gramatyka, stylistyka',
                icon: '📚',
                color: 'from-purple-500 to-pink-600',
                nextStep: 'polish_topic'
            },
            {
                id: 'physics',
                title: 'Fizyka',
                description: 'Mechanika, termodynamika, optyka',
                icon: '⚛️',
                color: 'from-green-500 to-emerald-600',
                nextStep: 'physics_topic'
            },
            {
                id: 'chemistry',
                title: 'Chemia',
                description: 'Chemia organiczna i nieorganiczna',
                icon: '🧪',
                color: 'from-orange-500 to-red-600',
                nextStep: 'chemistry_topic'
            }
        ]
    },
    math_topic: {
        id: 'math_topic',
        type: 'topic',
        question: 'Czego konkretnie chcesz się nauczyć z matematyki?',
        options: [
            {
                id: 'functions',
                title: 'Funkcje',
                description: 'Funkcje liniowe, kwadratowe, wykładnicze',
                nextStep: 'goal'
            },
            {
                id: 'geometry',
                title: 'Geometria',
                description: 'Planimetria, stereometria, trygonometria',
                nextStep: 'goal'
            },
            {
                id: 'algebra',
                title: 'Algebra',
                description: 'Równania, nierówności, układy równań',
                nextStep: 'goal'
            },
            {
                id: 'calculus',
                title: 'Analiza matematyczna',
                description: 'Pochodne, całki, granice',
                nextStep: 'goal'
            }
        ]
    },
    polish_topic: {
        id: 'polish_topic',
        type: 'topic',
        question: 'Czego konkretnie chcesz się nauczyć z języka polskiego?',
        options: [
            {
                id: 'literature',
                title: 'Literatura',
                description: 'Analiza utworów, interpretacja',
                nextStep: 'goal'
            },
            {
                id: 'grammar',
                title: 'Gramatyka',
                description: 'Składnia, morfologia, ortografia',
                nextStep: 'goal'
            },
            {
                id: 'writing',
                title: 'Pisanie',
                description: 'Rozprawka, charakterystyka, opowiadanie',
                nextStep: 'goal'
            }
        ]
    },
    goal: {
        id: 'goal',
        type: 'goal',
        question: 'Jaki jest Twój cel?',
        description: 'Pomoże mi to dostosować tempo i poziom trudności',
        options: [
            {
                id: 'exam_prep',
                title: 'Przygotowanie do egzaminu',
                description: 'Matura, egzamin ósmoklasisty',
                icon: '🎯',
                nextStep: 'level'
            },
            {
                id: 'improve_grades',
                title: 'Poprawa ocen',
                description: 'Nadrobienie zaległości',
                icon: '📈',
                nextStep: 'level'
            },
            {
                id: 'curiosity',
                title: 'Ciekawość i rozwój',
                description: 'Uczę się dla siebie',
                icon: '🌟',
                nextStep: 'level'
            },
            {
                id: 'competition',
                title: 'Olimpiada/konkurs',
                description: 'Przygotowanie do zawodów',
                icon: '🏆',
                nextStep: 'level'
            }
        ]
    },
    level: {
        id: 'level',
        type: 'level',
        question: 'Jaki jest Twój obecny poziom?',
        description: 'Bądź szczery - pomoże mi to dobrać odpowiednie zadania',
        options: [
            {
                id: 'beginner',
                title: 'Początkujący',
                description: 'Zaczynam przygodę z tym tematem',
                nextStep: 'confirmation'
            },
            {
                id: 'intermediate',
                title: 'Średniozaawansowany',
                description: 'Znam podstawy, chcę pogłębić wiedzę',
                nextStep: 'confirmation'
            },
            {
                id: 'advanced',
                title: 'Zaawansowany',
                description: 'Potrzebuję wyzwań i trudnych zadań',
                nextStep: 'confirmation'
            }
        ]
    },
    confirmation: {
        id: 'confirmation',
        type: 'confirmation',
        question: 'Świetnie! Utworzyć dla Ciebie spersonalizowaną ścieżkę nauki?',
        options: [
            {
                id: 'create',
                title: 'Tak, stwórz mój kurs!',
                description: 'Zacznij naukę już teraz'
            },
            {
                id: 'back',
                title: 'Zmień wybór',
                description: 'Chcę wybrać coś innego'
            }
        ]
    }
};

export default function SubjectsPage() {
    const router = useRouter();
    const [currentView, setCurrentView] = useState<'courses' | 'selection' | 'path' | 'lesson'>('courses');
    const [currentStep, setCurrentStep] = useState<string>('subject');
    const [userSelection, setUserSelection] = useState<UserSelection>({});
    const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
    const [activeLesson, setActiveLesson] = useState<LessonNodeData | null>(null);
    const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

    // Load user progress
    useEffect(() => {
        const mockProgress: UserProgress = {
            totalLessonsCompleted: 12,
            totalTimeSpent: 360,
            currentStreak: 5,
            weeklyGoal: 300,
            weeklyProgress: 180,
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
                    lastActivity: new Date(Date.now() - 86400000),
                }
            }
        };
        setUserProgress(mockProgress);
    }, []);

    const handleBackNavigation = useCallback(() => {
        if (currentView === 'lesson') {
            setCurrentView('path');
            setActiveLesson(null);
        } else if (currentView === 'path') {
            setCurrentView('courses');
            setActiveSubject(null);
        } else if (currentView === 'selection') {
            setCurrentView('courses');
            setCurrentStep('subject');
            setUserSelection({});
        } else {
            router.push('/dashboard/course');
        }
    }, [currentView, router]);

    const handleStartNewCourse = useCallback(() => {
        setCurrentView('selection');
        setCurrentStep('subject');
        setUserSelection({});
    }, []);

    const handleOptionSelect = useCallback((option: CourseOption) => {
        const currentStepData = courseSelectionSteps[currentStep];

        // Update user selection
        const newSelection = { ...userSelection };
        if (currentStepData.type === 'subject') {
            newSelection.subject = option.id;
        } else if (currentStepData.type === 'topic') {
            newSelection.topic = option.id;
        } else if (currentStepData.type === 'goal') {
            newSelection.goal = option.id;
        } else if (currentStepData.type === 'level') {
            newSelection.level = option.id;
        }

        setUserSelection(newSelection);

        if (option.nextStep) {
            setCurrentStep(option.nextStep);
        } else if (option.id === 'create') {
            // Create and navigate to course
            const mockSubject: Subject = {
                key: 'mat_core',
                name: 'Funkcje kwadratowe',
                icon: BookOpen,
                difficulty: newSelection.level as 'beginner' | 'intermediate' | 'advanced' || 'intermediate',
                estimatedTime: '2-3 tygodnie',
                description: 'Spersonalizowany kurs oparty na Twoich potrzebach'
            };
            setActiveSubject(mockSubject);
            setCurrentView('path');
        } else if (option.id === 'back') {
            setCurrentStep('subject');
            setUserSelection({});
        }
    }, [currentStep, userSelection]);

    const handleStartLesson = useCallback((lesson: LessonNodeData) => {
        setActiveLesson(lesson);
        setCurrentView('lesson');
    }, []);

    const handleCompleteLesson = useCallback(() => {
        setActiveLesson(null);
        setCurrentView('path');
    }, []);

    const backButtonText = useMemo(() => {
        switch (currentView) {
            case 'lesson': return 'Powrót do ścieżki';
            case 'path': return 'Powrót do kursów';
            case 'selection': return 'Powrót do kursów';
            default: return 'Powrót do dashboardu';
        }
    }, [currentView]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* Back button */}
                <button
                    onClick={handleBackNavigation}
                    className="flex items-center space-x-2 px-4 py-2 mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{backButtonText}</span>
                </button>

                {/* Main content */}
                {currentView === 'courses' && (
                    <CoursesOverview
                        currentCourses={mockCurrentCourses}
                        onStartNewCourse={handleStartNewCourse}
                    />
                )}

                {currentView === 'selection' && (
                    <AdaptiveCourseSelection
                        currentStep={currentStep}
                        userSelection={userSelection}
                        onOptionSelect={handleOptionSelect}
                        onBack={() => setCurrentStep('subject')}
                    />
                )}

                {currentView === 'path' && activeSubject && userProgress && (
                    <LearningPathPage
                        subject={activeSubject}
                        onBack={handleBackNavigation}
                        onStartLesson={handleStartLesson}
                        userProgress={userProgress}
                    />
                )}

                {currentView === 'lesson' && activeLesson && activeSubject && (
                    <LessonPage
                        subject={activeSubject}
                        lesson={activeLesson}
                        onComplete={handleCompleteLesson}
                        onBack={handleBackNavigation}
                    />
                )}
            </div>
        </div>
    );
}

// Courses Overview Component
interface CoursesOverviewProps {
    currentCourses: any[];
    onStartNewCourse: () => void;
}

function CoursesOverview({ currentCourses, onStartNewCourse }: CoursesOverviewProps) {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    Twoje kursy
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Kontynuuj naukę lub rozpocznij nowy kurs
                </p>
            </div>

            {/* Current Courses */}
            {currentCourses.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Kontynuuj naukę
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {currentCourses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl`}>
                                            {course.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                                                {course.subject}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {course.topic}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="w-5 h-5 text-blue-500" />
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                            Postęp
                                        </span>
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            {course.progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                        <div
                                            className={`h-2 bg-gradient-to-r ${course.color} rounded-full transition-all duration-300`}
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Next lesson */}
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    <span className="font-medium">Następna lekcja:</span> {course.nextLesson}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Start New Course */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Rozpocznij nowy kurs
                </h2>

                <div
                    onClick={onStartNewCourse}
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white cursor-pointer hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] group"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-2">
                                Stwórz spersonalizowany kurs
                            </h3>
                            <p className="text-blue-100 mb-4">
                                Odpowiedz na kilka pytań, a stworzymy idealny plan nauki specjalnie dla Ciebie
                            </p>
                            <div className="flex items-center gap-2 text-blue-200">
                                <Brain className="w-4 h-4" />
                                <span className="text-sm">Adaptuje się do Twojego poziomu</span>
                            </div>
                        </div>
                        <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Adaptive Course Selection Component
interface AdaptiveCourseSelectionProps {
    currentStep: string;
    userSelection: UserSelection;
    onOptionSelect: (option: CourseOption) => void;
    onBack: () => void;
}

function AdaptiveCourseSelection({ currentStep, userSelection, onOptionSelect, onBack }: AdaptiveCourseSelectionProps) {
    const stepData = courseSelectionSteps[currentStep];

    if (!stepData) {
        return <div>Błąd: Nieznany krok</div>;
    }

    const getSelectionSummary = () => {
        const parts = [];
        if (userSelection.subject) {
            const subjectOption = courseSelectionSteps.subject.options.find(opt => opt.id === userSelection.subject);
            if (subjectOption) parts.push(subjectOption.title);
        }
        if (userSelection.topic) {
            const topicSteps = Object.values(courseSelectionSteps).filter(step => step.type === 'topic');
            for (const step of topicSteps) {
                const topicOption = step.options.find(opt => opt.id === userSelection.topic);
                if (topicOption) {
                    parts.push(topicOption.title);
                    break;
                }
            }
        }
        if (userSelection.goal) {
            const goalOption = courseSelectionSteps.goal.options.find(opt => opt.id === userSelection.goal);
            if (goalOption) parts.push(goalOption.title);
        }
        if (userSelection.level) {
            const levelOption = courseSelectionSteps.level.options.find(opt => opt.id === userSelection.level);
            if (levelOption) parts.push(levelOption.title);
        }
        return parts.join(' • ');
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Progress indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Krok {Object.keys(courseSelectionSteps).indexOf(currentStep) + 1} z {Object.keys(courseSelectionSteps).length}
                    </span>
                    {Object.keys(userSelection).length > 0 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {getSelectionSummary()}
                        </span>
                    )}
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                        className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                        style={{
                            width: `${((Object.keys(courseSelectionSteps).indexOf(currentStep) + 1) / Object.keys(courseSelectionSteps).length) * 100}%`
                        }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                    {stepData.question}
                </h1>
                {stepData.description && (
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        {stepData.description}
                    </p>
                )}
            </div>

            {/* Options */}
            <div className="grid gap-4 md:grid-cols-2">
                {stepData.options.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => onOptionSelect(option)}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-xl"
                    >
                        <div className="flex items-start gap-4">
                            {option.icon && (
                                <div className="text-2xl flex-shrink-0 mt-1">
                                    {option.icon}
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {option.title}
                                </h3>
                                {option.description && (
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                                        {option.description}
                                    </p>
                                )}
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Back button for multi-step flow */}
            {currentStep !== 'subject' && (
                <div className="text-center mt-8">
                    <button
                        onClick={onBack}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                        ← Powrót do poprzedniego kroku
                    </button>
                </div>
            )}
        </div>
    );
}
