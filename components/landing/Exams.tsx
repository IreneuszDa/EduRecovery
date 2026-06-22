'use client';

import { motion } from 'framer-motion';
// Import the interactive LearnView component
import LearnView from '@/components/exams/LearnView';
// It's good practice to import the types to ensure data conforms to them.
import { QuestionType, Exam } from '@/components/exams/question-types';

// --- Demo Data for the LearnView Component ---
// This data is now fully compliant with the updated 'question-types.ts' definitions.
const demoExam: Exam = {
    _id: 'demo-exam-landing',
    title: 'Biologia i Geografia',
    questions: [
        // --- Question 1: Multiple Choice (Corrected) ---
        {
            _id: 'q1-demo',
            content: 'Jaki proces, kluczowy dla życia na Ziemi, pozwala roślinom przekształcać energię świetlną w energię chemiczną?',
            questionNumber: '1', // FIX: Changed to string
            questionType: QuestionType.MultipleChoice,
            // FIX: Changed from string array to object with keys
            options: {
                'A': 'Oddychanie komórkowe',
                'B': 'Fotosynteza',
                'C': 'Transpiracja',
                'D': 'Chemosynteza'
            },
            correctAnswer: 'B', // FIX: Correct answer is now the key
            points: '0-1',
            imageUrl: undefined, // Using undefined for optional properties is cleaner
        },
        // --- Question 2: True/False (Corrected) ---
        {
            _id: 'q2-demo',
            // Note: The TrueFalse interface doesn't have a 'content' field.
            // The instruction is embedded in the component's UI for this type.
            questionNumber: '2', // FIX: Changed to string
            questionType: QuestionType.TrueFalse,
            // FIX: 'text' property renamed to 'statementText'
            statements: [
                { statementText: 'Najwyższym szczytem Polski są Rysy.', isCorrect: true },
                { statementText: 'Wisła jest najdłuższą rzeką w Polsce.', isCorrect: true },
                { statementText: 'Polska ma dostęp do Morza Czarnego.', isCorrect: false },
            ],
            points: '0-3',
            imageUrl: undefined,
        },
        // --- Question 3: Open Ended (Corrected) ---

    ]
};


export default function Exams() {
    return (
        <motion.section
            id="exams"
            className="py-20 sm:py-32 overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">

                    {/* Left Side: Text Content */}
                    <motion.div
                        className="text-center lg:text-left"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Sprawdzaj wiedzę jak nigdy dotąd
                        </h2>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
                            Przekształć dowolne notatki lub tematy w kompleksowe testy i egzaminy. Nasza AI oceni nawet pytania otwarte, dając Ci pełny obraz Twoich postępów.
                        </p>
                        <ul className="mt-8 space-y-5 text-left inline-block lg:inline-list">
                            <li className="flex items-start">
                                <span className="flex-shrink-0 h-7 w-7 flex items-center justify-center bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full mr-4">
                                    <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                </span>
                                <span className="text-gray-700 dark:text-gray-300">Różnorodne typy pytań: ABC, Prawda/Fałsz i otwarte.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="flex-shrink-0 h-7 w-7 flex items-center justify-center bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full mr-4">
                                    <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>

                                </span>
                                <span className="text-gray-700 dark:text-gray-300">Inteligentna ocena odpowiedzi otwartych z AI.</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Right Side: Interactive LearnView Component */}
                    <motion.div
                        className="w-full"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                    >
                        {/* This will now compile without type errors */}
                        <LearnView exam={demoExam} isEmbedded={false} />
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}