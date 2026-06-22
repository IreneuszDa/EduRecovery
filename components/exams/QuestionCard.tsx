// components/exams/QuestionCard.tsx

import { Question, QuestionType, getQuestionTypeName } from "@/components/exams/question-types";
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import TrueFalseEditor from "./TrueFalseEditor";
import OpenEndedEditor from "./OpenEndedEditor";
import FillInTheBlankEditor from "./FillInTheBlankEditor";

interface Props {
    question: Question;
    index: number;
    onQuestionChange: (index: number, updatedQuestion: Question) => void;
    onDeleteQuestion: (index: number) => void;
}

export default function QuestionCard({ question, index, onQuestionChange, onDeleteQuestion }: Props) {

    const handleCommonFieldChange = (field: 'questionNumber' | 'points' | 'imageUrl', value: string) => {
        onQuestionChange(index, { ...question, [field]: value });
    };

    const renderSpecificEditor = () => {
        switch (question.questionType) {
            case QuestionType.MultipleChoice:
                return <MultipleChoiceEditor question={question} onChange={(q) => onQuestionChange(index, q)} />;
            case QuestionType.TrueFalse:
                return <TrueFalseEditor question={question} onChange={(q) => onQuestionChange(index, q)} />;
            case QuestionType.OpenEnded:
                return <OpenEndedEditor question={question} onChange={(q) => onQuestionChange(index, q)} />;
            case QuestionType.FillInTheBlank:
                return <FillInTheBlankEditor question={question} onChange={(q) => onQuestionChange(index, q)} />;
            default:
                return <div className="text-red-500">Error: Unknown question type!</div>;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-500 dark:border-blue-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Question {question.questionNumber || index + 1} ({getQuestionTypeName(question.questionType)})
                </h3>
                <button type="button" onClick={() => onDeleteQuestion(index)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 font-semibold">
                    Usuń
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input value={question.questionNumber} onChange={(e) => handleCommonFieldChange('questionNumber', e.target.value)} placeholder="Q. Number" className="input-style bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600" />
                <input value={question.points} onChange={(e) => handleCommonFieldChange('points', e.target.value)} placeholder="Points" className="input-style bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600" />
                <input value={question.imageUrl || ''} onChange={(e) => handleCommonFieldChange('imageUrl', e.target.value)} placeholder="Image URL (Optional)" className="input-style bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600" />
            </div>

            {question.questionType !== QuestionType.TrueFalse && 'content' in question && (
                <textarea
                    value={question.content}
                    onChange={(e) => onQuestionChange(index, { ...question, content: e.target.value })}
                    placeholder="Question Content"
                    className="input-style w-full h-24 mb-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                />
            )}

            {renderSpecificEditor()}
        </div>
    );
}

// You might want to define a base `input-style` in your global CSS file for better reusability:
/* styles/globals.css */
/* @tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .input-style {
    @apply block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
  }
} */