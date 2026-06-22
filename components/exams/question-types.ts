// components/exams/question-types.ts

// 1. Enum now uses NUMBERS to match the updated backend schema.
// This is the most critical change.
export enum QuestionType {
    MultipleChoice = 0,
    TrueFalse = 1,
    OpenEnded = 2,
    FillInTheBlank = 3,
}

// +++ (Recommended Addition) Helper function to get a user-friendly name for the UI +++
export const getQuestionTypeName = (type: QuestionType): string => {
    switch (type) {
        case QuestionType.MultipleChoice: return 'Multiple Choice';
        case QuestionType.TrueFalse: return 'True/False';
        case QuestionType.OpenEnded: return 'Open Ended';
        case QuestionType.FillInTheBlank: return 'Fill In The Blank';
        default: return 'Unknown';
    }
};

// 2. A core interface for properties common to ALL questions.
// NO CHANGE NEEDED HERE. It correctly references the enum.
export interface IQuestionCore {
    _id?: any; // Use `any` or `string | number` for temporary client-side IDs
    questionType: QuestionType;
    questionNumber: string;
    points: string;
    imageUrl?: string;
}

// 3. Base interface for questions that HAVE a content field.
// NO CHANGE NEEDED HERE.
export interface IBaseQuestion extends IQuestionCore {
    content: string;
}

// 4. Specific question type interfaces.
// NO CHANGE NEEDED HERE. The discriminated union pattern works perfectly with numeric enums.
// TypeScript will correctly infer `questionType` is the literal number 0, 1, etc.
export interface IMultipleChoiceQuestion extends IBaseQuestion {
    questionType: QuestionType.MultipleChoice;
    options: { [key: string]: string };
    correctAnswer: string;
}

export interface ITrueFalseQuestion extends IQuestionCore {
    questionType: QuestionType.TrueFalse;
    statements: {
        statementText: string;
        isCorrect: boolean;
    }[];
}

export interface IOpenEndedQuestion extends IBaseQuestion {
    questionType: QuestionType.OpenEnded;

    finalAnswer?: string;
}

export interface IFillInTheBlankQuestion extends IBaseQuestion {
    questionType: QuestionType.FillInTheBlank;
    correctAnswers: string[];
}

// 5. A union type that represents any possible question.
// NO CHANGE NEEDED HERE.
export type Question = IMultipleChoiceQuestion | ITrueFalseQuestion | IOpenEndedQuestion | IFillInTheBlankQuestion;

// 6. Blank question templates.
// NO CODE CHANGE NEEDED HERE. Because these templates reference the enum,
// they will now automatically have the correct numeric values for `questionType`.
export const BLANK_MULTIPLE_CHOICE: Omit<IMultipleChoiceQuestion, 'questionNumber'> = {
    questionType: QuestionType.MultipleChoice, // This will be 0
    points: '0-1',
    content: '',
    options: { A: '', B: '', C: '', D: '' },
    correctAnswer: 'A',
};

export const BLANK_TRUE_FALSE: Omit<ITrueFalseQuestion, 'questionNumber'> = {
    questionType: QuestionType.TrueFalse, // This will be 1
    points: '0-1',
    statements: [{ statementText: '', isCorrect: true }],
};

export const BLANK_OPEN_ENDED: Omit<IOpenEndedQuestion, 'questionNumber'> = {
    questionType: QuestionType.OpenEnded, // This will be 2
    points: '0-2',
    content: '',

    finalAnswer: '',
};

export const BLANK_FILL_IN_THE_BLANK: Omit<IFillInTheBlankQuestion, 'questionNumber'> = {
    questionType: QuestionType.FillInTheBlank, // This will be 3
    points: '0-1',
    content: 'Uzupełnij zdanie: ______ .',
    correctAnswers: [''],
};

export interface Exam {
    _id: string;
    title: string;
    questions: Question[];
}