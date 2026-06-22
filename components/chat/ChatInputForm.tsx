'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from 'react-textarea-autosize';
import { Send, X, GraduationCap, Plus, LucideProps, SlidersHorizontal } from "lucide-react";

import { SubjectPopover, Subject } from './SubjectPopover';
import { ToolsPopover } from './ToolsPopover';
import { useMediaQuery } from '@/hooks/use-media-query';

// --- TYPE DEFINITIONS, ICONS, ETC. ---
type Action = 'chat' | 'generateFlashcards' | 'generateExam' | 'learn' | 'animate';

const FlashcardIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>);
const ExamIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>);
const LearnIcon = ({ className }: { className?: string }) => <GraduationCap className={className} />;


// --- PROP INTERFACE ---
interface ChatInputFormProps {
    onSendMessage: (message: string, file: File | null, action: Action) => void;
    isLoading: boolean;
    isHistoryLoading: boolean;
    action: Action;
    onActionChange: (action: Action) => void;
    activeSubject: Subject | null;
    onClearSubject: () => void;
    onSubjectSelect: (subject: Subject) => void;
    isTransparent?: boolean;
}

// --- CLICK OUTSIDE HOOK ---
const useClickOutside = (
    ref: React.RefObject<HTMLElement | null>,
    handler: (event: MouseEvent | TouchEvent) => void
) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) return;
            handler(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
};

// --- MAIN COMPONENT ---
function ChatInputForm({
    onSendMessage, isLoading, isHistoryLoading, action, onActionChange,
    activeSubject, onClearSubject, onSubjectSelect, isTransparent = false
}: ChatInputFormProps) {
    const [input, setInput] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isToolsPopoverOpen, setIsToolsPopoverOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const toolsPopoverRef = useRef<HTMLDivElement>(null);

    const isMobile = useMediaQuery("(max-width: 640px)");
    // OPTIMIZATION: New media query to detect very small screens
    const isExtraSmall = useMediaQuery("(max-width: 420px)");

    useClickOutside(toolsPopoverRef, () => setIsToolsPopoverOpen(false));

    const handleActionSelectAndClose = (newAction: Action) => {
        onActionChange(newAction);
        setIsToolsPopoverOpen(false);
    };

    const isFlashcardMode = action === 'generateFlashcards';
    const isExamMode = action === 'generateExam';
    const isLearnMode = action === 'learn';
    const isAnyToolActive = isLearnMode || isFlashcardMode || isExamMode;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) setFile(selectedFile);
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if ((!input.trim() && !file) || isLoading || isHistoryLoading) return;
        onSendMessage(input, file, action);
        setInput("");
        removeFile();
        if (isFlashcardMode || isExamMode) onActionChange('chat');
    };

    const getActionPrompt = () => {
        if (isLearnMode) return activeSubject ? `Zapytaj o coś z tematu: ${activeSubject.name}...` : "Wybierz przedmiot lub opisz nowy temat...";
        if (isFlashcardMode) return "Opisz temat fiszek lub dołącz plik...";
        if (isExamMode) return "Opisz egzamin lub dołącz plik...";
        return "Zapytaj o cokolwiek lub dołącz plik...";
    };

    const baseBubbleClasses = "flex items-center gap-1.5 rounded-full p-2 md:px-3 md:py-1.5 text-xs font-semibold transition-colors duration-200";
    const desktopInactiveClasses = "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600";
    const learnClasses = isLearnMode ? "bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:ring-emerald-500/50" : desktopInactiveClasses;
    const flashcardClasses = isFlashcardMode ? "bg-amber-100 text-amber-800 ring-2 ring-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:ring-amber-500/50" : desktopInactiveClasses;
    const examClasses = isExamMode ? "bg-violet-100 text-violet-800 ring-2 ring-violet-300 dark:bg-violet-900/50 dark:text-violet-300 dark:ring-violet-500/50" : desktopInactiveClasses;


    // OPTIMIZATION: Added `relative` to allow absolute positioning of the Send button inside the form.
    const formClasses = `
    relative pointer-events-auto mx-auto w-full max-w-[60rem] flex-col rounded-2xl
    ${isTransparent
            ? 'bg-transparent border-transparent shadow-none'
            : 'border border-slate-300/70 bg-white/70 shadow-2xl shadow-slate-500/10 dark:border-slate-700/70 dark:bg-slate-800/70 dark:shadow-black/20'
        }
    p-2 sm:p-3 backdrop-blur-md`;

    // OPTIMIZATION: Defined the Send button as a variable to avoid repeating code.
    const sendButton = (
        <button
            type="submit"
            disabled={(!input.trim() && !file) || isLoading || isHistoryLoading}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none dark:disabled:bg-slate-500"
            aria-label="Wyślij wiadomość"
        >
            <Send className="h-5 w-5" />
        </button>
    );

    return (
        <form onSubmit={handleSubmit} className={formClasses}>
            {/* OPTIMIZATION: On extra-small screens, render the button in the top-right corner. */}
            {isExtraSmall && (
                <div className="absolute top-3 right-3 z-10">
                    {sendButton}
                </div>
            )}

            <AnimatePresence>
                {file && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="mb-2 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-100 p-2 text-sm dark:border-slate-600 dark:bg-slate-700">
                        <span className="truncate pr-2 font-medium text-slate-600 dark:text-slate-300">{file.name}</span>
                        <button type="button" onClick={removeFile} className="rounded-full p-1 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-200"><X className="h-4 w-4" /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative flex items-end">
                <TextareaAutosize value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }} placeholder={getActionPrompt()} disabled={isLoading || isHistoryLoading} className="flex-grow resize-none border-none bg-transparent px-2 sm:px-3 py-2.5 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-0 dark:text-slate-200 dark:placeholder-slate-400" rows={1} maxRows={8} />
            </div>

            <div className="mt-2 sm:mt-3 flex items-center gap-x-2">
                <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf,image/*" className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading || isHistoryLoading || !!file} className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors duration-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700" title="Dołącz plik"><Plus className="h-5 w-5" /></button>

                    {isMobile ? (
                        <div className="relative" ref={toolsPopoverRef}>
                            <AnimatePresence>
                                {isToolsPopoverOpen && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.15 } }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="absolute bottom-full left-0 mb-2 z-10">
                                        <ToolsPopover currentAction={action} onActionSelect={handleActionSelectAndClose} onClose={() => setIsToolsPopoverOpen(false)} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="flex items-center gap-1.5">
                                {isAnyToolActive ? (
                                    <>
                                        <button type="button" onClick={() => setIsToolsPopoverOpen(p => !p)} disabled={isLoading || isHistoryLoading} className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors duration-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700" aria-label="Zmień narzędzie">
                                            <SlidersHorizontal className="h-4 w-4" />
                                        </button>
                                        {isLearnMode && <button type="button" onClick={() => onActionChange('chat')} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${learnClasses}`}><LearnIcon className="h-4 w-4" />Ucz się</button>}
                                        {isFlashcardMode && <button type="button" onClick={() => onActionChange('chat')} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${flashcardClasses}`}><FlashcardIcon className="h-4 w-4" />Fiszki</button>}
                                        {isExamMode && <button type="button" onClick={() => onActionChange('chat')} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${examClasses}`}><ExamIcon className="h-4 w-4" />Egzamin</button>}

                                    </>
                                ) : (
                                    <button type="button" onClick={() => setIsToolsPopoverOpen(p => !p)} disabled={isLoading || isHistoryLoading} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:text-slate-200">
                                        <SlidersHorizontal className="h-4 w-4" />
                                        <span>Narzędzia</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <button type="button" onClick={() => onActionChange(action === 'learn' ? 'chat' : 'learn')} disabled={isLoading || isHistoryLoading} className={`${baseBubbleClasses} ${learnClasses}`}><LearnIcon className="h-4 w-4" /><span className="hidden md:inline">Ucz się</span></button>
                            <button type="button" onClick={() => onActionChange(action === 'generateFlashcards' ? 'chat' : 'generateFlashcards')} disabled={isLoading || isHistoryLoading} className={`${baseBubbleClasses} ${flashcardClasses}`}><FlashcardIcon className="h-4 w-4" /><span className="hidden md:inline">Fiszki</span></button>
                            <button type="button" onClick={() => onActionChange(action === 'generateExam' ? 'chat' : 'generateExam')} disabled={isLoading || isHistoryLoading} className={`${baseBubbleClasses} ${examClasses}`}><ExamIcon className="h-4 w-4" /><span className="hidden md:inline">Egzamin</span></button>
                        </>
                    )}
                </div>

                <div className="flex-grow" />

                <div className="flex flex-shrink-0 items-center gap-2">
                    <SubjectPopover
                        activeSubject={activeSubject}
                        onSubjectSelect={onSubjectSelect}
                        onClearSubject={onClearSubject}
                    />

                    {/* OPTIMIZATION: Only render the button here if the screen is NOT extra small. */}
                    {!isExtraSmall && sendButton}
                </div>
            </div>
        </form>
    );
}

export default React.memo(ChatInputForm);