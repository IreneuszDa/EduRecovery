'use client';
// IMPORTANT: This component requires react-spring and @use-gesture/react
// npm install react-spring @use-gesture/react
import { useState } from 'react';
import { useSprings } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { LessonFlashcard } from './lesson-types';
import { LearnControls } from '@/components/learn/LearnControls'; // Adjust path
import { FlashcardView } from '@/components/learn/FlashcardView'; // Adjust path

// Helper function to convert our simple flashcard type to your session card type
const toSessionCard = (card: LessonFlashcard, index: number) => ({
    ...card,
    _id: `card-${index}`,
    originalIndex: index,
    isStarred: false,
    history: [],
});

interface FlashcardStepProps {
    cards: LessonFlashcard[];
    onComplete: () => void;
}

export function FlashcardStep({ cards, onComplete }: FlashcardStepProps) {
    // This is simplified state management for the flashcard session.
    // A full implementation would be more complex.
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const sessionCards = cards.map(toSessionCard);

    // Dummy state and handlers for props required by your components
    const [typedAnswer, setTypedAnswer] = useState('');
    const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'incorrect'>('idle');

    // Minimal setup for react-spring animations (can be removed if not using drag)
    const [props, api] = useSprings(cards.length, i => ({
        from: { x: 0, rot: 0, scale: 1.5, y: -1000 },
        to: { x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 }
    }));
    const bind = useDrag(() => { }); // Dummy drag handler

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsRevealed(false);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setIsRevealed(false);
        }
    }

    return (
        <div className="w-full max-w-lg flex flex-col items-center">
            {/* We render only the current card for simplicity */}
            <FlashcardView
                card={sessionCards[currentIndex]}
                isRevealed={isRevealed}
                bind={bind}
                style={props[currentIndex]}
                // Dummy props
                isReversed={false}
                isStarred={false}
                learnMode="vanilla" // Use 'vanilla' mode as it is simplest
                typedAnswer={typedAnswer}
                answerState={answerState}
                onToggleStar={() => { }}
                onSpeak={() => { }}
                onTypedAnswerChange={setTypedAnswer}
            />
            <LearnControls
                learnMode="vanilla"
                isRevealed={isRevealed}
                isFirstCard={currentIndex === 0}
                isLastCard={currentIndex === cards.length - 1}
                answerState={answerState}
                onReveal={() => setIsRevealed(true)}
                onNext={handleNext}
                onPrev={handlePrev}
                // Dummy handlers
                onMarkKnown={handleNext}
                onMarkUnknown={handleNext}
                onCheckAnswer={() => { }}
            />
        </div>
    );
}