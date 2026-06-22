"use client";

import React, { useState, useEffect } from "react";
import { MathJaxContext } from "better-react-mathjax";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Import komponentów-kroków
import LessonStep from "./components/LessonStep";
import InteractiveBottle from "./components/InteractiveBottle";
import QuizQuestion from "./components/QuizQuestion";
import InteractiveChart from "./components/InteractiveChart";

// Konfiguracja MathJax
const mathJaxConfig = {
    loader: { load: ["[tex]/html"] },
    tex: { packages: { "[+]": ["html"] }, inlineMath: [["$", "$"]], displayMath: [["$$", "$$"]] },
};

// --- GŁÓWNY KOMPONENT KONTROLUJĄCY LEKCJĘ ---
export default function RateOfChangeLessonPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Definicja wszystkich kroków lekcji w jednym miejscu
    const lessonSteps = [
        {
            title: "Czym jest zmiana?",
            component: (
                <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                    <p>Wyobraź sobie, że odkręcasz kran i napełniasz butelkę wodą. Objętość wody w butelce nieustannie się zmienia.</p>
                    <p>Matematyka daje nam precyzyjne narzędzia do opisywania takich zmian. Zaczynajmy!</p>
                </div>
            ),
        },
        { title: "Zobacz zmianę w akcji", component: <InteractiveBottle /> },
        { title: "Pytanie sprawdzające", component: <QuizQuestion onCorrectAnswer={() => handleNextStep(true)} /> },
        { title: "Zmiana na wykresie", component: <InteractiveChart /> },
        {
            title: "Doskonała robota!",
            component: (
                 <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                    <p>W tej lekcji odkryliśmy, że <strong>tempo zmian</strong> opisuje, jak szybko jedna wielkość (objętość) zmienia się w czasie.</p>
                    <p>Zobaczyliśmy to na przykładzie, odpowiedzieliśmy na pytanie i zwizualizowaliśmy na wykresie. Jesteś gotów na więcej!</p>
                </div>
            ),
        }
    ];

    // Symulacja ładowania danych, tak jak w Twoim przykładzie
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);
    
    // Nawigacja
    const handleNextStep = (isAutomatic = false) => {
        if (currentStep < lessonSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };
    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const progressPercentage = ((currentStep + 1) / lessonSteps.length) * 100;

    // Stan ładowania
    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Przygotowuję lekcję...</span>
                </div>
            </div>
        );
    }
    
    return (
        <MathJaxContext config={mathJaxConfig}>
            <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
                <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12 flex flex-col min-h-screen">
                    
                    {/* NAGŁÓWEK W STYLU TWOJEGO LAYOUTU */}
                    <motion.header
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <p className="text-blue-600 dark:text-blue-400 font-semibold">Podstawy Rachunku Różniczkowego</p>
                        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                            Lekcja 1: Tempo Zmian
                        </h1>
                    </motion.header>

                    {/* GŁÓWNA TREŚĆ LEKCJI Z ANIMACJAMI */}
                    <main className="flex-1 flex items-center">
                        <AnimatePresence mode="wait">
                            <LessonStep key={currentStep} title={lessonSteps[currentStep].title}>
                                {lessonSteps[currentStep].component}
                            </LessonStep>
                        </AnimatePresence>
                    </main>

                    {/* STOPKA Z NAWIGACJĄ I POSTĘPEM */}
                    <motion.footer
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-8"
                    >
                        <div className="w-full bg-white/50 dark:bg-slate-800/50 rounded-full h-2 mb-4 shadow-inner">
                            <motion.div
                                className="bg-blue-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handlePrevStep}
                                disabled={currentStep === 0}
                                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all transform hover:scale-[1.02] bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft size={16} /> Wstecz
                            </button>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Krok {currentStep + 1} <span className="text-slate-400 dark:text-slate-500">/ {lessonSteps.length}</span>
                            </span>
                            <button
                                onClick={() => handleNextStep()}
                                disabled={currentStep === lessonSteps.length - 1}
                                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all transform hover:scale-[1.02] bg-blue-500 hover:bg-blue-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                Dalej <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.footer>
                </div>
            </div>
        </MathJaxContext>
    );
}