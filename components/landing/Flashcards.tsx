"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

import { DemoFlashcardView } from '@/components/landing/DemoFlashcardView';
import { DemoLearnControls } from '@/components/landing/DemoLearnControls';
import { ISessionCard } from '@/lib/types';
import { FlashcardDemo } from '@/components/landing/FlashcardDemo';

const demoCards: ISessionCard[] = [
    { term: "Fotosynteza", definition: "Proces, w którym rośliny, algi i niektóre bakterie przekształcają energię świetlną w energię chemiczną.", originalIndex: 0 },
    { term: "Twierdzenie Pitagorasa", definition: "W trójkącie prostokątnym suma kwadratów długości przyprostokątnych jest równa kwadratowi długości przeciwprostokątnej (a² + b² = c²).", originalIndex: 1 },
    { term: "Efekt Dopplera", definition: "Zmiana częstotliwości fali odbieranej przez obserwatora, gdy źródło fali i obserwator poruszają się względem siebie.", originalIndex: 2 },
];

const quickFadeConfig = { tension: 300, friction: 30 };

function DesktopFlashcards({ className, isChatActionActive }: { className?: string; isChatActionActive: boolean }) {
    const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [starredIndices, setStarredIndices] = useState(() => new Set<number>());

    const [props, api] = useSpring(() => ({ x: 0, y: 0, scale: 1, rotateZ: 0, opacity: 1 }));
    const currentCard = useMemo(() => demoCards[currentIndex], [currentIndex]);

    useEffect(() => {
        if (isChatActionActive && !hasAnimatedIn) {
            setHasAnimatedIn(true);
        }
    }, [isChatActionActive, hasAnimatedIn]);

    // POPRAWKA: Przywrócenie pełnych definicji funkcji
    const handleToggleStar = useCallback((cardIndex: number) => {
        setStarredIndices(prev => {
            const newSet = new Set(prev);
            if (newSet.has(cardIndex)) newSet.delete(cardIndex);
            else newSet.add(cardIndex);
            return newSet;
        });
    }, []);

    const runFadeTransition = useCallback(async (direction: 'next' | 'prev') => {
        if (isAnimating) return;
        setIsAnimating(true);
        const nextIndex = direction === 'next' ? (currentIndex + 1) % demoCards.length : (currentIndex - 1 + demoCards.length) % demoCards.length;
        await api.start({ opacity: 0, scale: 0.98, config: quickFadeConfig });
        setIsRevealed(false);
        setCurrentIndex(nextIndex);
        api.set({ x: 0, rotateZ: 0 });
        await api.start({ opacity: 1, scale: 1, config: quickFadeConfig });
        setIsAnimating(false);
    }, [api, currentIndex, isAnimating]);

    const handleNext = useCallback(() => runFadeTransition('next'), [runFadeTransition]);
    const handlePrev = useCallback(() => runFadeTransition('prev'), [runFadeTransition]);

    const bind = useDrag(({ active, movement: [mx], direction: [xDir], tap, cancel }) => {
        if (isAnimating) return;
        if (tap) {
            setIsRevealed(p => !p);
            return;
        }
        const trigger = Math.abs(mx) > (window.innerWidth / 4);
        if (!active && trigger) {
            cancel();
            runFadeTransition(xDir > 0 ? 'prev' : 'next');
            return;
        }
        api.start({
            x: active ? mx : 0,
            scale: active ? 1.05 : 1,
            rotateZ: active ? mx / 15 : 0,
            immediate: active,
            config: { tension: active ? 800 : 210, friction: active ? 50 : 30 },
        });
    });
    
    const cardVariants: Variants = {
        hidden: { x: '100vw', opacity: 0 },
        visible: (custom: number) => ({
            x: '0%',
            opacity: 1,
            transition: {
                type: 'spring',
                bounce: 0.2,
                duration: 1.2,
                delay: custom * 0.1
            }
        })
    };
    
    return (
        <motion.section
            id="flashcards-desktop"
            className={`w-full overflow-hidden ${className} py-24 sm:py-32`}
            initial="hidden"
            animate={hasAnimatedIn ? "visible" : "hidden"}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div className="lg:order-last text-left">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter">
                            Twórz fiszki w mgnieniu oka
                        </h2>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
                            Wklej swoje notatki, prześlij plik PDF lub po prostu opisz temat, a nasza AI wygeneruje dla Ciebie kompletny zestaw interaktywnych fiszek.
                        </p>
                        <ul className="mt-8 space-y-5">
                             {/* ... Twoje elementy listy ... */}
                        </ul>
                    </div>
                    <div className="lg:order-first flex flex-col items-center">
                        <div className="relative flex items-center justify-center min-h-[26rem] w-full">
                            <motion.div custom={2} variants={cardVariants} className="absolute w-full max-w-2xl h-full" style={{ translateY: '20px', rotate: 6, scale: 1 }}>
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/80 dark:border-slate-700 shadow-xl w-full h-full min-h-[22rem]"></div>
                            </motion.div>
                            <motion.div custom={1} variants={cardVariants} className="absolute w-full max-w-2xl h-full" style={{ translateY: '10px', rotate: -3, scale: 1 }}>
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/80 dark:border-slate-700 shadow-xl w-full h-full min-h-[22rem]"></div>
                            </motion.div>
                            <motion.div custom={0} variants={cardVariants} className="relative w-full z-10">
                                <DemoFlashcardView
                                    card={currentCard}
                                    isRevealed={isRevealed}
                                    bind={bind}
                                    style={props}
                                    isStarred={starredIndices.has(currentCard.originalIndex)}
                                    onToggleStar={() => handleToggleStar(currentCard.originalIndex)}
                                />
                            </motion.div>
                        </div>
                        <motion.div custom={0} variants={cardVariants} className="mt-8 flex items-center justify-center gap-4 h-24 w-full">
                            <DemoLearnControls
                                isRevealed={isRevealed}
                                onReveal={() => !isAnimating && setIsRevealed(true)}
                                onNext={handleNext}
                                onPrev={handlePrev}
                                disablePrev={isAnimating}
                                disableNext={isAnimating}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

function MobileFlashcards({ className }: { className?: string }) {
    // ... bez zmian
    return (
        <motion.section
            id="flashcards-mobile"
            className={`py-24 sm:py-32 overflow-hidden bg-white dark:bg-slate-900 ${className}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 gap-16 items-start">
                    <div className="text-left">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tighter">
                            Twórz fiszki w mgnieniu oka
                        </h2>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
                           Wklej swoje notatki, prześlij plik PDF lub po prostu opisz temat, a nasza AI wygeneruje dla Ciebie kompletny zestaw interaktywnych fiszek.
                        </p>
                        <ul className="mt-8 space-y-5">
                             {/* ... Twoje elementy listy ... */}
                        </ul>
                    </div>
                    <div>
                        <FlashcardDemo />
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

export default function Flashcards({ isChatActionActive }: { isChatActionActive: boolean }) {
    return (
        <>
            <DesktopFlashcards className="hidden lg:flex" isChatActionActive={isChatActionActive} />
            <MobileFlashcards className="block lg:hidden" />
        </>
    );
}