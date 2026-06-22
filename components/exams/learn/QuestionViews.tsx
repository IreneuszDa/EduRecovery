// Plik: components/exams/learn/QuestionViews.tsx
'use client';

import { ReactNode, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { MathJax } from 'better-react-mathjax';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { Question, QuestionType, IMultipleChoiceQuestion, ITrueFalseQuestion, IOpenEndedQuestion, IFillInTheBlankQuestion } from '../question-types';

// --- TYPY (Bez zmian) ---
type UserAnswer = string | boolean[] | string[] | null;
type OnAnswer = (questionId: string, answer: UserAnswer) => void;

interface ViewProps<T extends Question> {
    q: T;
    userAnswer: UserAnswer;
    onAnswer: OnAnswer;
    isAnswerChecked: boolean;
}

// --- Widok dla pytań jednokrotnego wyboru (z trybem ciemnym) ---
const MultipleChoiceView = ({ q, userAnswer, onAnswer, isAnswerChecked }: ViewProps<IMultipleChoiceQuestion>) => {
    const getOptionClassName = (optionKey: string) => {
        const isSelected = userAnswer === optionKey;
        const isCorrect = optionKey === q.correctAnswer;
        let classes = 'border-2 rounded-[var(--radius-container)] transition-all duration-200 ease-in-out transform';
        if (!isAnswerChecked) {
            return classes + (isSelected ? ' bg-blue-100 dark:bg-blue-900/50 border-blue-500 ring-4 ring-blue-500/20' : ' bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 hover:-translate-y-1');
        }
        if (isCorrect) return `${classes} bg-green-100 dark:bg-green-500/10 border-green-500 text-green-900 dark:text-green-200`;
        if (isSelected && !isCorrect) return `${classes} bg-red-100 dark:bg-red-500/10 border-red-500 text-red-900 dark:text-red-200`;
        return `${classes} bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-70 cursor-not-allowed`;
    };

    return (
        <div className="space-y-[var(--space-sm)]">
            {Object.entries(q.options).map(([key, value]) => (
                <button key={key} onClick={() => onAnswer(q._id!, key)} disabled={isAnswerChecked}
                    className={`w-full text-left p-[var(--space-md)] flex items-center gap-[var(--space-md)] text-[var(--font-size-lg)] ${getOptionClassName(key)} ${!isAnswerChecked ? 'cursor-pointer' : 'cursor-default'}`}>
                    <span className="flex-shrink-0 h-[var(--mcq-key-size)] w-[var(--mcq-key-size)] flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-full">{key}</span>
                    <div className="flex-1 text-slate-800 dark:text-slate-200 font-medium">
                        {value && typeof value === 'string' && <MathJax inline>{value}</MathJax>}
                    </div>
                    {isAnswerChecked && key === q.correctAnswer && <CheckCircleIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-green-600 dark:text-green-500 shrink-0" />}
                    {isAnswerChecked && userAnswer === key && key !== q.correctAnswer && <XCircleIcon className="h-[var(--icon-size-md)] w-[var(--icon-size-md)] text-red-600 dark:text-red-500 shrink-0" />}
                </button>
            ))}
            {isAnswerChecked && userAnswer !== q.correctAnswer && (
                <div className="mt-[var(--margin-lg)] p-[var(--space-sm)] bg-yellow-50 dark:bg-yellow-500/10 border-l-4 border-yellow-400 dark:border-yellow-500 text-yellow-900 dark:text-yellow-200 rounded-r-[var(--radius-container)] flex items-start gap-[var(--space-xs)]">
                    <InformationCircleIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] mt-0.5 text-yellow-500 dark:text-yellow-400 shrink-0" />
                    {/* --- POCZĄTEK ZMIANY: Poprawna odpowiedź opakowana w MathJax --- */}
                    <div className="text-[var(--font-size-base)]">
                        Poprawna odpowiedź:{' '}
                        <span className="font-bold">
                            {q.options[q.correctAnswer] && typeof q.options[q.correctAnswer] === 'string' && (
                                <MathJax inline>{`${q.correctAnswer}. ${q.options[q.correctAnswer]}`}</MathJax>
                            )}
                        </span>
                    </div>
                    {/* --- KONIEC ZMIANY --- */}
                </div>
            )}
        </div>
    );
};

// --- Widok dla pytań Prawda/Fałsz (bez zmian) ---
const TrueFalseView = ({ q, userAnswer, onAnswer, isAnswerChecked }: ViewProps<ITrueFalseQuestion>) => {
    const answers = (userAnswer as boolean[]) || Array(q.statements.length).fill(null);
    const handleSelect = (stmtIndex: number, value: boolean) => { if (isAnswerChecked) return; const newAnswers = [...answers]; newAnswers[stmtIndex] = value; onAnswer(q._id!, newAnswers); };
    const getButtonClass = (isTrueButton: boolean, stmtIndex: number) => {
        const userChoice = answers[stmtIndex]; const isCorrect = isAnswerChecked ? userChoice === q.statements[stmtIndex].isCorrect : null;
        if (!isAnswerChecked) return userChoice === isTrueButton ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200';
        if (userChoice === isTrueButton) return isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white';
        if (q.statements[stmtIndex].isCorrect === isTrueButton) return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 ring-2 ring-green-500';
        return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 opacity-80';
    };

    return (
        <div className="space-y-[var(--space-md)]">
            {q.statements.map((stmt, i) => (
                <div key={i} className={`p-[var(--space-lg)] rounded-[var(--radius-container)] border-2 transition-colors ${isAnswerChecked ? (answers[i] === stmt.isCorrect ? 'border-green-200 dark:border-green-700/50 bg-green-50/70 dark:bg-green-500/10' : 'border-red-200 dark:border-red-700/50 bg-red-50/70 dark:bg-red-500/10') : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                    <div className="mb-[var(--margin-sm)] text-[var(--font-size-lg)] text-slate-700 dark:text-slate-300">
                        {stmt.statementText && typeof stmt.statementText === 'string' && <MathJax inline>{stmt.statementText}</MathJax>}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-[var(--space-xs)]" role="group">
                            <button onClick={() => handleSelect(i, true)} disabled={isAnswerChecked} className={`px-[var(--tf-button-px)] py-[var(--tf-button-py)] font-bold text-[var(--font-size-base)] rounded-[var(--radius-button)] transition-all duration-200 ease-in-out focus-visible:ring-4 focus-visible:ring-blue-400 ${getButtonClass(true, i)}`}>Prawda</button>
                            <button onClick={() => handleSelect(i, false)} disabled={isAnswerChecked} className={`px-[var(--tf-button-px)] py-[var(--tf-button-py)] font-bold text-[var(--font-size-base)] rounded-[var(--radius-button)] transition-all duration-200 ease-in-out focus-visible:ring-4 focus-visible:ring-blue-400 ${getButtonClass(false, i)}`}>Fałsz</button>
                        </div>
                        {isAnswerChecked && (answers[i] === stmt.isCorrect ? <CheckCircleIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-green-500" /> : <XCircleIcon className="h-[var(--icon-size-lg)] w-[var(--icon-size-lg)] text-red-500" />)}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Widok rozwiązania (ZMIENIONY) ---
const SolutionView = ({ q }: { q: IOpenEndedQuestion | IFillInTheBlankQuestion }) => {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-[var(--margin-lg)] p-[var(--space-md)] bg-blue-50/70 dark:bg-blue-900/40 border-2 border-blue-200 dark:border-blue-700/60 text-blue-900 dark:text-blue-200 rounded-[var(--radius-container)] space-y-[var(--space-xs)]">
            <h4 className="font-bold flex items-center gap-[var(--space-xs)] text-[var(--font-size-lg)] text-blue-800 dark:text-blue-300">
                <SparklesIcon className="h-[var(--icon-size-sm)] w-[var(--icon-size-sm)] text-blue-500" /> Sugerowane Rozwiązanie
            </h4>
            <div className="pl-[calc(var(--icon-size-sm)_+var(--space-xs))] prose prose-[var(--font-size-base)] prose-slate dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 text-blue-900/80 dark:text-blue-200/80">
                {/* --- POCZĄTEK ZMIANY: Renderowanie odpowiedzi w MathJax --- */}
                {q.questionType === QuestionType.FillInTheBlank
                    ? (Array.isArray(q.correctAnswers) && q.correctAnswers.length > 0 && (
                        <p>
                            <strong>Sugerowane odpowiedzi:</strong>{' '}
                            <em>
                                <MathJax inline>{q.correctAnswers.join(', ')}</MathJax>
                            </em>
                        </p>
                    ))
                    : (q.finalAnswer && typeof q.finalAnswer === 'string' && (
                        <>
                            <p className="font-bold">Sugerowana odpowiedź:</p>
                            <MathJax>{q.finalAnswer}</MathJax>
                        </>
                    ))
                }
                {/* --- KONIEC ZMIANY --- */}
            </div>
        </motion.div>
    );
};


// --- Widok dla pól tekstowych ---
const TextInputView = ({ q, userAnswer, onAnswer, isAnswerChecked }: ViewProps<IOpenEndedQuestion | IFillInTheBlankQuestion>) => {
    const currentText = (userAnswer as string) || '';
    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => { onAnswer(q._id!, e.target.value); };
    return (
        <div className="space-y-[var(--space-sm)]">
            <textarea
                value={currentText}
                onChange={handleTextChange}
                readOnly={isAnswerChecked}
                placeholder="Twoja odpowiedź..."
                className="w-full p-[var(--space-sm)] border-2 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 rounded-[var(--radius-container)] text-[var(--font-size-lg)] font-medium text-slate-800 dark:text-slate-200 transition-all duration-200 ease-in-out focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-700 read-only:bg-slate-100 dark:read-only:bg-slate-800 read-only:border-slate-200 dark:read-only:border-slate-700 read-only:cursor-not-allowed"
                rows={5}
            />
            {isAnswerChecked && <SolutionView q={q} />}
        </div>
    );
};

// --- Główny komponent-dyspozytor (bez zmian) ---
export function QuestionViewRenderer(props: ViewProps<Question>): ReactNode {
    const { q } = props;
    switch (q.questionType) {
        case QuestionType.MultipleChoice:
            return <MultipleChoiceView {...props} q={q} />;
        case QuestionType.TrueFalse:
            return <TrueFalseView {...props} q={q} />;
        case QuestionType.OpenEnded:
        case QuestionType.FillInTheBlank:
            return <TextInputView {...props} q={q} />;
        default:
            return (
                <div className="p-[var(--space-sm)] bg-red-100 dark:bg-red-500/10 border-red-400 dark:border-red-500/50 rounded-[var(--radius-container)] text-red-800 dark:text-red-300">
                    Error: Unknown question type.
                </div>
            );
    }
}