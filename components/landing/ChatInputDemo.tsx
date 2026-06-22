'use client';

import { GraduationCap, Plus, Send, FlashcardIcon, ExamIcon } from './Icons';
import TextareaAutosize from 'react-textarea-autosize';

type Action = 'chat' | 'generateFlashcards' | 'generateExam' | 'learn' | 'none';

interface ChatInputDemoProps {
    action: Action;
    demoInputText: string;
}

export default function ChatInputDemo({ action = 'learn', demoInputText = '' }: ChatInputDemoProps) {
    const isLearnMode = action === 'learn';
    const isFlashcardMode = action === 'generateFlashcards';
    const isExamMode = action === 'generateExam';

    const baseBubbleClasses = "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-300";
    const inactiveClasses = "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

    const learnClasses = isLearnMode ? "bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:ring-emerald-500/50" : inactiveClasses;
    const flashcardClasses = isFlashcardMode ? "bg-amber-100 text-amber-800 ring-2 ring-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:ring-amber-500/50" : inactiveClasses;
    const examClasses = isExamMode ? "bg-violet-100 text-violet-800 ring-2 ring-violet-300 dark:bg-violet-900/50 dark:text-violet-300 dark:ring-violet-500/50" : inactiveClasses;

    return (
        <div className="pointer-events-auto w-full flex-col rounded-2xl border border-slate-200/80 bg-white/70 shadow-2xl shadow-slate-500/10 dark:border-slate-700/80 dark:bg-slate-900/70 dark:shadow-black/20 p-2 sm:p-3 backdrop-blur-md">
            <div className="relative flex items-end">
                <TextareaAutosize
                    readOnly
                    value={demoInputText || ''}
                    placeholder="Zapytaj o cokolwiek..."
                    className="flex-grow resize-none border-none bg-transparent px-2 sm:px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 dark:text-slate-200 dark:placeholder-slate-500 leading-relaxed"
                    rows={1}
                    minRows={1}
                    maxRows={3}
                />
            </div>
            <div className="mt-2 sm:mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-slate-500 bg-slate-200/80 dark:bg-slate-800/80 dark:text-slate-400">
                        <Plus className="h-5 w-5" />
                    </div>
                    <div className={`${baseBubbleClasses} ${learnClasses}`}><GraduationCap className="h-4 w-4" />Ucz się</div>
                    <div className={`${baseBubbleClasses} ${flashcardClasses}`}><FlashcardIcon className="h-4 w-4" />Fiszki</div>
                    <div className={`${baseBubbleClasses} ${examClasses}`}><ExamIcon className="h-4 w-4" />Egzamin</div>
                </div>
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                    <Send className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}