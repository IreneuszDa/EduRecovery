'use client';
import { X } from 'lucide-react';
import { Subject } from '../SubjectSelectionPage';

interface LessonHeaderProps {
    subject: Subject;
    lessonTitle: string;
    currentStep: number;
    totalSteps: number;
    onExit: () => void;
}

export function LessonHeader({ subject, lessonTitle, currentStep, totalSteps, onExit }: LessonHeaderProps) {
    const progressPercentage = (currentStep / totalSteps) * 100;
    return (
        <header className="w-full flex-shrink-0 p-4">
            <div className="container mx-auto max-w-4xl flex items-center gap-4">
                <subject.icon className="h-6 w-6 text-blue-500 flex-shrink-0" />
                <div className="flex-grow">
                    <h1 className="font-semibold text-slate-800 dark:text-slate-200">{lessonTitle}</h1>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-1">
                        <div
                            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}>
                        </div>
                    </div>
                </div>
                <button onClick={onExit} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full">
                    <X className="h-6 w-6" />
                </button>
            </div>
        </header>
    );
}