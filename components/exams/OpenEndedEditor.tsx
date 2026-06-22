import { IOpenEndedQuestion } from "@/components/exams/question-types";

interface Props {
    question: IOpenEndedQuestion;
    onChange: (updatedQuestion: IOpenEndedQuestion) => void;
}

export default function OpenEndedEditor({ question, onChange }: Props) {
    const handleChange = (field: 'finalAnswer', value: string) => {
        onChange({ ...question, [field]: value });
    };

    // Define reusable styles for form elements to ensure consistency.
    const inputStyles = "w-full px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="space-y-4 mt-4">

            <div>
                <label
                    htmlFor={`finalAnswer-${question._id || 'new'}`}
                    className="block text-sm font-semibold text-gray-600 dark:text-slate-400 mb-1"
                >
                    Final Answer (for grading reference)
                </label>
                <input
                    id={`finalAnswer-${question._id || 'new'}`}
                    value={question.finalAnswer || ''}
                    onChange={(e) => handleChange('finalAnswer', e.target.value)}
                    placeholder="e.g., x = 5, or 'Dowód zakończony.'"
                    className={inputStyles}
                />
            </div>
        </div>
    );
}