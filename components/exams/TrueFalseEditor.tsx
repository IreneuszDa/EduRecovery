import { ITrueFalseQuestion } from "@/components/exams/question-types";

interface Props {
    question: ITrueFalseQuestion;
    onChange: (updatedQuestion: ITrueFalseQuestion) => void;
}

export default function TrueFalseEditor({ question, onChange }: Props) {
    const handleStatementChange = (index: number, field: 'statementText' | 'isCorrect', value: string | boolean) => {
        const newStatements = [...question.statements];
        newStatements[index] = { ...newStatements[index], [field]: value };
        onChange({ ...question, statements: newStatements });
    };

    const handleRemoveStatement = (indexToRemove: number) => {
        if (question.statements.length <= 1) return;
        const newStatements = question.statements.filter((_, index) => index !== indexToRemove);
        onChange({ ...question, statements: newStatements });
    };

    const handleAddStatement = () => {
        const newStatements = [
            ...question.statements,
            { statementText: '', isCorrect: true }
        ];
        onChange({ ...question, statements: newStatements });
    };

    return (
        <div className="space-y-3 mt-4">
            {/* Statements Heading */}
            <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300">Statements:</h4>
            <div className="space-y-2">
                {question.statements.map((stmt, index) => (
                    <div key={index} className="flex items-center gap-4 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                        {/* Statement Text Input */}
                        <input
                            value={stmt.statementText}
                            onChange={(e) => handleStatementChange(index, 'statementText', e.target.value)}
                            // Assuming .input-style is defined globally with dark mode support.
                            // Example inline styles for dark mode are added here for completeness.
                            className="input-style flex-grow bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                            placeholder={`Statement ${index + 1}`}
                        />
                        {/* "Is True" Checkbox and Label */}
                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={stmt.isCorrect}
                                onChange={(e) => handleStatementChange(index, 'isCorrect', e.target.checked)}
                                // Most modern browsers handle checkbox colors well, but you can style it if needed.
                                // For example, using `accent-blue-600 dark:accent-blue-500`
                                className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <span>Is True</span>
                        </label>
                        {/* Remove Button */}
                        {question.statements.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveStatement(index)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 font-semibold text-sm"
                                aria-label={`Remove statement ${index + 1}`}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-2">
                {/* Add Statement Button */}
                <button
                    type="button"
                    onClick={handleAddStatement}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm px-3 py-1 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-700/60"
                >
                    + Add Statement
                </button>
            </div>
        </div>
    );
}