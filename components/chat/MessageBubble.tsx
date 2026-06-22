'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink } from 'lucide-react';
import { Session } from 'next-auth';
import React, { HTMLAttributes, LiHTMLAttributes, OlHTMLAttributes } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// --- TYPE DEFINITIONS ---
type Message = {
    role: "user" | "assistant";
    content: string;
    linkType?: 0 | 1 | 2; // 0 for flashcards, 1 for exams, 2 for animations
    linkId?: string;
    animationPrompt?: string; // For storing the original animation prompt
};

// --- MODIFIED PROPS ---
interface MessageBubbleProps {
    message: Message;
    session: Session | null;
    shouldAnimate: boolean; // Replaced isLastMessage with this explicit prop
    onAnimationComplete: () => void;
}

// --- HELPER FUNCTION (Updated for animations) ---
const getLinkProps = (linkType?: 0 | 1 | 2, linkId?: string) => {
    if (typeof linkType === 'undefined' || !linkId) {
        return null;
    }
    switch (linkType) {
        case 0: return { href: `/dashboard/fiszki/learn/${linkId}`, text: 'Przejdź do zestawu fiszek' };
        case 1: return { href: `/dashboard/exams/learn/${linkId}`, text: 'Przejdź do egzaminu' };
        case 2: return null; // Animations don't have external links, they're displayed inline
        default: return null;
    }
};

// --- CUSTOM MARKDOWN COMPONENTS (Unchanged and New) ---
const CustomThematicBreak = () => <hr className="my-6 h-[2px] bg-slate-400 dark:bg-slate-500 border-none opacity-70" />;
const CustomStrong = ({ children, ...props }: HTMLAttributes<HTMLSpanElement>) => <strong className="font-bold text-lg" {...props}>{children}</strong>;
const CustomUnorderedList = ({ children, ...props }: HTMLAttributes<HTMLUListElement>) => <ul className="list-disc list-outside ml-5 space-y-1" {...props}>{children}</ul>;
const CustomOrderedList = ({ children, ...props }: OlHTMLAttributes<HTMLOListElement>) => <ol className="list-decimal list-outside ml-5 space-y-1" {...props}>{children}</ol>;
const CustomListItem = ({ children, ...props }: LiHTMLAttributes<HTMLLIElement>) => <li {...props}>{children}</li>;

const CustomCodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
        <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            {...props}
        >
            {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
    ) : (
        <code className={className} {...props}>
            {children}
        </code>
    );
};


// --- MODIFIED CUSTOM HOOK for Typing Animation ---
const useTypingAnimation = (
    content: string,
    shouldAnimate: boolean, // The trigger is now this explicit prop
    onAnimationComplete: () => void
) => {
    const [displayedContent, setDisplayedContent] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const animationFrameId = useRef<number | null>(null);
    const lastUpdateTime = useRef<number>(0);
    const currentIndex = useRef(0);

    useEffect(() => {
        // The animation now depends ONLY on the shouldAnimate prop.
        if (shouldAnimate) {
            setDisplayedContent('');
            setIsAnimating(true);
            currentIndex.current = 0;
            lastUpdateTime.current = 0;

            const animate = (timestamp: number) => {
                if (timestamp - lastUpdateTime.current > 40) {
                    lastUpdateTime.current = timestamp;
                    const chunkSize = Math.floor(Math.random() * 10) + 4;
                    const nextIndex = Math.min(currentIndex.current + chunkSize, content.length);
                    setDisplayedContent(content.substring(0, nextIndex));
                    currentIndex.current = nextIndex;
                }

                if (currentIndex.current < content.length) {
                    animationFrameId.current = requestAnimationFrame(animate);
                } else {
                    setDisplayedContent(content); // Ensure final content is accurate
                    setIsAnimating(false);
                    onAnimationComplete();
                }
            };

            animationFrameId.current = requestAnimationFrame(animate);
        } else {
            // If not animating, display the full content instantly.
            setDisplayedContent(content);
            setIsAnimating(false);
        }

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [content, shouldAnimate, onAnimationComplete]); // Dependency array updated

    return { displayedContent, isAnimating };
};


// --- COMPONENT DEFINITION ---
export function MessageBubble({ message, session, shouldAnimate, onAnimationComplete }: MessageBubbleProps) {
    const { displayedContent, isAnimating } = useTypingAnimation(
        message.content,
        shouldAnimate, // Pass the new prop to the hook
        onAnimationComplete
    );
    const [isReadyForMath, setIsReadyForMath] = useState(false);

    const isAssistant = message.role === 'assistant';

    useEffect(() => {
        const mathJaxTimer = setTimeout(() => setIsReadyForMath(true), 50);
        return () => clearTimeout(mathJaxTimer);
    }, []);

    const blinkingCursor = (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            className="text-slate-500 dark:text-slate-400 ml-1"
        >
            ▍
        </motion.span>
    );

    const linkProps = getLinkProps(message.linkType, message.linkId);

    const bubbleVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };

    // This check prevents rendering an empty bubble for an assistant message that is about to be animated
    // We also make sure to render the message if animation is active, even if content is empty
    if (isAssistant && !message.content && !shouldAnimate) {
        return null;
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={bubbleVariants}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`max-w-[85%] sm:max-w-[75%] text-base leading-relaxed font-sans ${message.role === 'user'
                ? 'bg-blue-500 dark:bg-slate-700 text-white rounded-2xl px-4 py-3 shadow-lg'
                : 'text-slate-800 dark:text-slate-200'
                }`}>
                <div className={`prose prose-base max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-strong:font-semibold transition-opacity duration-300 ${message.role === 'user' ? 'prose-invert' : 'dark:prose-invert'} ${isReadyForMath ? 'opacity-100' : 'opacity-0'}`}>
                    <MathJax hideUntilTypeset="first" key={message.content}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                hr: CustomThematicBreak,
                                strong: CustomStrong,
                                ul: CustomUnorderedList,
                                ol: CustomOrderedList,
                                li: CustomListItem,
                                code: CustomCodeBlock,
                            }}
                        >
                            {displayedContent}
                        </ReactMarkdown>
                        {isAnimating && blinkingCursor}
                    </MathJax>
                </div>

                {!isAnimating && linkProps && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        <Link
                            href={linkProps.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 group inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-semibold py-2 px-4 rounded-full text-base hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-all duration-200 ease-in-out transform hover:scale-105 border border-blue-200/80 dark:border-blue-800/90 shadow-md"
                        >
                            <span className="group-hover:underline decoration-blue-700/50 dark:decoration-blue-400/50 underline-offset-2">
                                {linkProps.text}
                            </span>
                            <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}