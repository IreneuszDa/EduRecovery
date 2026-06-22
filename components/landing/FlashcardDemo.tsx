"use client";

import { useState, useCallback, useMemo } from 'react';
import { useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { ISessionCard } from '@/lib/types';
import { DemoFlashcardView } from '@/components/landing/DemoFlashcardView';
import { DemoLearnControls } from '@/components/landing/DemoLearnControls';

const demoCards: ISessionCard[] = [
    { term: "Fotosynteza", definition: "Proces, w którym rośliny, algi i niektóre bakterie przekształcają energię świetlną w energię chemiczną.", originalIndex: 0 },
    { term: "Twierdzenie Pitagorasa", definition: "W trójkącie prostokątnym suma kwadratów długości przyprostokątnych jest równa kwadratowi długości przeciwprostokątnej (a² + b² = c²).", originalIndex: 1 },
    { term: "Efekt Dopplera", definition: "Zmiana częstotliwości fali odbieranej przez obserwatora, gdy źródło fali i obserwator poruszają się względem siebie.", originalIndex: 2 },
];

const gentleSpringConfig = { tension: 210, friction: 30 };
const quickFadeConfig = { tension: 300, friction: 30 };

export function FlashcardDemo() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [starredIndices, setStarredIndices] = useState(() => new Set<number>());

    const [props, api] = useSpring(() => ({
        x: 0,
        y: 0,
        scale: 1,
        rotateZ: 0,
        opacity: 1
    }));

    const currentCard = useMemo(() => demoCards[currentIndex], [currentIndex]);

    const handleToggleStar = useCallback((cardIndex: number) => {
        setStarredIndices(prev => {
            const newSet = new Set(prev);
            if (newSet.has(cardIndex)) {
                newSet.delete(cardIndex);
            } else {
                newSet.add(cardIndex);
            }
            return newSet;
        });
    }, []);

    const runSwipeAnimation = useCallback(async (direction: 'next' | 'prev') => {
        if (isAnimating) return;
        setIsAnimating(true);

        const dir = direction === 'next' ? 1 : -1;
        const nextIndex = direction === 'next'
            ? (currentIndex + 1) % demoCards.length
            : (currentIndex - 1 + demoCards.length) % demoCards.length;

        await api.start({
            x: window.innerWidth * 0.8 * dir,
            opacity: 0,
            rotateZ: 12 * dir,
            config: gentleSpringConfig
        });

        setIsRevealed(false);
        setCurrentIndex(nextIndex);
        api.set({
            x: -window.innerWidth * 0.8 * dir,
            opacity: 0,
            rotateZ: -12 * dir,
            scale: 1,
        });

        await api.start({
            x: 0,
            opacity: 1,
            rotateZ: 0,
            config: gentleSpringConfig
        });

        setIsAnimating(false);
    }, [api, currentIndex, isAnimating]);

    const runFadeTransition = useCallback(async (direction: 'next' | 'prev') => {
        if (isAnimating) return;
        setIsAnimating(true);

        const nextIndex = direction === 'next'
            ? (currentIndex + 1) % demoCards.length
            : (currentIndex - 1 + demoCards.length) % demoCards.length;

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

        const trigger = Math.abs(mx) > window.innerWidth / 4;

        if (!active && trigger) {
            cancel();
            runSwipeAnimation(xDir > 0 ? 'prev' : 'next');
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

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
            <DemoFlashcardView
                card={currentCard}
                isRevealed={isRevealed}
                bind={bind}
                style={props}
                isStarred={starredIndices.has(currentCard.originalIndex)}
                onToggleStar={() => handleToggleStar(currentCard.originalIndex)}
            />
            <div className="mt-8 flex items-center justify-center gap-4 h-24 w-full">
                <DemoLearnControls
                    isRevealed={isRevealed}
                    onReveal={() => !isAnimating && setIsRevealed(true)}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    disablePrev={isAnimating}
                    disableNext={isAnimating}
                />
            </div>
        </div>
    );
}