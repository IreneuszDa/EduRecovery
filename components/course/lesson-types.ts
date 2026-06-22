import { Exam } from '@/components/exams/question-types'; // Adjust path if needed

// Represents a single flashcard for the lesson
export interface LessonFlashcard {
    term: string;
    definition: string;
}

// Represents the complete data package for one lesson
export interface LessonData {
    id: number;
    title: string;
    explanation: {
        title: string;
        content: string; // Can be simple text or even Markdown
    };
    flashcards: LessonFlashcard[];
    exam: Exam;
}

// --- MOCK DATA ---
// This is a sample lesson object that the AI would generate.
export const mockLessonData: LessonData = {
    id: 3,
    title: 'Obliczanie delty i miejsc zerowych',
    explanation: {
        title: "Klucz do Równań Kwadratowych: Delta",
        content: "Delta (Δ) to wyróżnik funkcji kwadratowej, który mówi nam, ile ma ona miejsc zerowych. Obliczamy ją ze wzoru: Δ = b² - 4ac. Jeśli Δ > 0, mamy dwa rozwiązania. Jeśli Δ = 0, jest jedno rozwiązanie. A gdy Δ < 0, nie ma rozwiązań w zbiorze liczb rzeczywistych. To fundamentalne narzędzie do rozwiązywania równań!"
    },
    flashcards: [
        { term: "Wzór na deltę (Δ)", definition: "b² - 4ac" },
        { term: "Co oznacza Δ > 0?", definition: "Dwa miejsca zerowe" },
        { term: "Co oznacza Δ = 0?", definition: "Jedno miejsce zerowe" },
        { term: "Co oznacza Δ < 0?", definition: "Brak miejsc zerowych" },
    ],
    exam: {
        _id: 'exam-delta-1',
        title: 'Test z Delty',
        questions: [
            {
                _id: 'q1',
                questionNumber: '1',
                questionType: 0, // MultipleChoice
                content: 'Ile miejsc zerowych ma funkcja, której Δ = 16?',
                points: '0-1',
                options: { A: 'Zero', B: 'Jedno', C: 'Dwa', D: 'Nieskończenie wiele' },
                correctAnswer: 'C',
            },
            {
                _id: 'q2',
                questionNumber: '2',
                questionType: 0, // MultipleChoice
                content: 'Dla funkcji y = x² + 4x + 4, ile wynosi delta?',
                points: '0-1',
                options: { A: '0', B: '4', C: '8', D: '-16' },
                correctAnswer: 'A',
            }
        ]
    }
};