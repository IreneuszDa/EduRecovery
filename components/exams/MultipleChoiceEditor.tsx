import { IMultipleChoiceQuestion } from "@/components/exams/question-types";

interface Props {
    question: IMultipleChoiceQuestion;
    onChange: (updatedQuestion: IMultipleChoiceQuestion) => void;
}

export default function MultipleChoiceEditor({ question, onChange }: Props) {
    const handleOptionChange = (key: string, value: string) => {
        const newOptions = { ...question.options, [key]: value };
        onChange({ ...question, options: newOptions });
    };

    // Reusable styles for form elements for consistency
    const inputStyle = "w-full px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="space-y-4 mt-4">
            <h4 className="font-semibold text-sm text-gray-600 dark:text-slate-400">Options:</h4>
            {Object.entries(question.options).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-slate-700 dark:text-slate-300">{key}:</span>
                    <input
                        value={value}
                        onChange={(e) => handleOptionChange(key, e.target.value)}
                        className={`${inputStyle} flex-grow`}
                    />
                </div>
            ))}
            <div className="flex items-center gap-3 pt-2">
                <label className="font-semibold text-sm text-gray-600 dark:text-slate-400">Correct Answer:</label>
                <select
                    value={question.correctAnswer}
                    onChange={(e) => onChange({ ...question, correctAnswer: e.target.value })}
                    className={`${inputStyle} w-auto`}
                >
                    {Object.keys(question.options).map(key => <option key={key} value={key}>{key}</option>)}
                </select>
            </div>
        </div>
    );
}