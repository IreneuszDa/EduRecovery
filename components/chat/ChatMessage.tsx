'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from "next-auth/react";
import { motion } from 'framer-motion';

// --- Child Component Imports ---
import { MessageBubble } from './MessageBubble'; // Ensure this path is correct
import { EmbeddedExam } from './EmbeddedExam';
import { FlashcardSession } from './FlashcardSession';
import { SuggestedQuestions } from './SuggestedQuestions'; // Ensure this path is correct
import { LoadingIndicator } from './LoadingIndicator';
import { LearnViewSkeleton } from '@/components/exams/learn/LearnViewSkeleton';
import AnimationPlayer from './AnimationPlayer'; // Import the animation player

// --- TYPE DEFINITIONS ---
interface ISessionCard {
  _id: string;
  term: string;
  definition: string;
  originalIndex: number;
}

interface ClientExam {
  _id: string;
  title: string;
  subject: string;
  questions: any[];
}

interface FlashcardSet {
  _id: string;
  title: string;
  cards: ISessionCard[];
}

type Message = {
  role: "user" | "assistant";
  content: string;
  linkType?: 0 | 1 | 2; // 0 for flashcards, 1 for exams, 2 for animations
  linkId?: string;
  proposedQuestions?: string[];
  exam?: ClientExam; // For pre-generated exams passed directly as a prop
  animationPrompt?: string; // For storing the original animation prompt
};

// --- MODIFIED PROPS ---
interface ChatMessageProps {
  message: Message;
  isLastMessage: boolean;
  shouldAnimate: boolean; // New prop to explicitly trigger animation
  onAnimationComplete: () => void; // New prop to notify parent when animation finishes
  onSuggestionClick: (prompt: string) => void;
}


// --- COMPONENT DEFINITION ---
export default function ChatMessage({ message, isLastMessage, shouldAnimate, onAnimationComplete, onSuggestionClick }: ChatMessageProps) {
  const { data: session } = useSession();

  // --- STATE MANAGEMENT ---
  const [examData, setExamData] = useState<ClientExam | null>(message.exam || null);
  const [isLoadingExam, setIsLoadingExam] = useState(false);

  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(false);

  // Animation state
  const [animationId, setAnimationId] = useState<string | null>(null);

  // Effect to sync animation ID from message
  useEffect(() => {
    if (message.linkType === 2 && message.linkId) {
      setAnimationId(message.linkId);
    }
  }, [message.linkType, message.linkId]);

  // This state tracks if the bubble is *currently* animating, based on the parent's instruction.
  const [isBubbleAnimating, setIsBubbleAnimating] = useState(shouldAnimate);

  // --- MODIFIED CALLBACK ---
  // This function is passed to the MessageBubble. When it's called, it means the
  // typing animation is done. It then notifies the parent component.
  const handleAnimationComplete = useCallback(() => {
    setIsBubbleAnimating(false);
    onAnimationComplete(); // Notify the parent (DashboardPage)
  }, [onAnimationComplete]);

  // --- DATA FETCHING EFFECTS ---
  useEffect(() => {
    const fetchExamData = async () => {
      if (message.role === 'assistant' && message.linkType === 1 && message.linkId && !examData) {
        setIsLoadingExam(true);
        try {
          const response = await fetch(`/api/exams/${message.linkId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch exam: ${response.statusText}`);
          }
          const data = await response.json();
          if (data.exam) {
            setExamData(data.exam);
          }
        } catch (error) {
          console.error("Error fetching exam:", error);
        } finally {
          setIsLoadingExam(false);
        }
      }
    };
    fetchExamData();
  }, [message.role, message.linkType, message.linkId, examData]);

  useEffect(() => {
    const fetchFlashcardData = async () => {
      if (message.role === 'assistant' && message.linkType === 0 && message.linkId && !flashcardSet) {
        setIsLoadingFlashcards(true);
        try {
          const response = await fetch(`/api/flashcard-sets/${message.linkId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch flashcard set: ${response.statusText}`);
          }
          const data: FlashcardSet = await response.json();
          setFlashcardSet(data);
        } catch (error) {
          console.error("Error fetching flashcards:", error);
        } finally {
          setIsLoadingFlashcards(false);
        }
      }
    };
    fetchFlashcardData();
  }, [message.role, message.linkType, message.linkId, flashcardSet]);

  // Syncs the local animation state with the prop from the parent.
  useEffect(() => {
    setIsBubbleAnimating(shouldAnimate);
  }, [shouldAnimate]);


  // --- CONDITIONAL RENDER FLAGS ---
  const hasContent = typeof message.content === 'string' && message.content.trim().length > 0;
  const isAnimation = message.role === 'assistant' && message.linkType === 2 && !!animationId;
  const hideMessageBubble = message.role === 'assistant' && (!!examData || isLoadingExam || !!flashcardSet || isLoadingFlashcards || isAnimation);
  const showMessageBubble = hasContent && !hideMessageBubble;

  // Show suggestions only on the last assistant message, after the bubble has finished animating.
  const showSuggestedQuestions = isLastMessage &&
    !isBubbleAnimating && // <-- This now depends on the controlled animation state
    message.role === 'assistant' &&
    !!message.proposedQuestions?.length &&
    !message.linkId && !examData && !flashcardSet;


  // --- RENDER ---
  return (
    <div className="mx-auto max-w-4xl space-y-1">
      {showMessageBubble && (
        <MessageBubble
          message={message}
          session={session}
          // --- MODIFIED PROPS PASSED TO BUBBLE ---
          shouldAnimate={shouldAnimate}
          onAnimationComplete={handleAnimationComplete}
        />
      )}

      {/* --- Loading and Content Blocks (Unchanged) --- */}
      {isLoadingFlashcards && <LoadingIndicator text="Wczytuję fiszki..." />}
      {flashcardSet && <FlashcardSession flashcardSetData={flashcardSet} />}

      {isLoadingExam && (
        <motion.div layout className="mt-4">
          <LearnViewSkeleton />
        </motion.div>
      )}
      {examData && <EmbeddedExam examData={examData} />}

      {/* Animation component */}
      {isAnimation && animationId && (
        <AnimationPlayer
          animationId={animationId}
          prompt={message.animationPrompt || 'Animacja matematyczna'}
        />
      )}

      {/* --- Suggested Questions (Logic updated above) --- */}
      {showSuggestedQuestions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex justify-start"
        >
          <div className="text-left">
            <SuggestedQuestions
              questions={message.proposedQuestions!}
              onSuggestionClick={onSuggestionClick}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}