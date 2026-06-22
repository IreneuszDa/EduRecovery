// src/components/exams/FillInTheBlankEditor.tsx

import { IFillInTheBlankQuestion } from "@/components/exams/question-types";
import { Plus, X } from "lucide-react";

interface Props {
    question: IFillInTheBlankQuestion;
    onChange: (updatedQuestion: IFillInTheBlankQuestion) => void;
}

export default function FillInTheBlankEditor({ question, onChange }: Props) {
    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...question.correctAnswers];
        newAnswers[index] = value;
        onChange({ ...question, correctAnswers: newAnswers });
    };

    const addAnswerField = () => {
        onChange({ ...question, correctAnswers: [...question.correctAnswers, ''] });
    };

    const removeAnswerField = (indexToRemove: number) => {
        if (question.correctAnswers.length <= 1) return;
        const newAnswers = question.correctAnswers.filter((_, i) => i !== indexToRemove);
        onChange({ ...question, correctAnswers: newAnswers });
    };

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Correct Answers for Blanks</h4>
            <div className="space-y-3">
                {question.correctAnswers.map((answer, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <span className="flex-shrink-0 font-medium text-sm text-slate-500 dark:text-slate-400 w-16">Blank #{index + 1}</span>
                        <input
                            value={answer}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            placeholder={`Expected answer for blank #${index + 1}`}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                        />
                        <button
                            type="button"
                            onClick={() => removeAnswerField(index)}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 disabled:text-slate-300 dark:disabled:text-slate-600 disabled:bg-transparent disabled:cursor-not-allowed transition-colors"
                            disabled={question.correctAnswers.length <= 1}
                            title="Remove Blank"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addAnswerField}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg transition-colors"
            >
                <Plus size={16} />
                Add Another Blank
            </button>
        </div>
    );
}