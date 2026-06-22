"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { Bot, BrainCircuit, FileText, HelpCircle, X, LucideProps, BookOpenCheck, Sigma, Languages, Dna, Beaker, Atom, Globe, History, Scale, Brain, Laptop, Code, Paintbrush, Palette, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MathJaxContext } from "better-react-mathjax";

// Import components
import ChatInputForm from "@/components/chat/ChatInputForm";
import ChatMessage from "@/components/chat/ChatMessage";
import { StreakWidget } from "@/components/dashboard/StreakWidget";
import { useSession } from "next-auth/react";

// --- TYPE DEFINITIONS ---
type Subject = {
  name: string;
  icon: React.FC<LucideProps>;
  key: string;
};

interface ClientExam {
  _id: string;
  title: string;
  subject: string;
  questions: any[];
}

type Message = {
  role: "user" | "assistant";
  content: string;
  linkType?: 0 | 1 | 2; // 0 for flashcards, 1 for exams, 2 for animations
  linkId?: string;
  proposedQuestions?: string[];
  exam?: ClientExam;
  animationPrompt?: string; // For storing the original animation prompt
};

type Action = 'chat' | 'generateFlashcards' | 'generateExam' | 'learn' | 'animate';

type ChatSessionItem = {
  _id: string;
  title: string;
  createdAt: string;
};

const mathJaxConfig = {
  loader: { load: ['[tex]/html'] },
  tex: {
    packages: { '[+]': ['html'] },
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']]
  }
};

// --- SLASH SPINNER ---
const SlashSpinner = () => {
  return (
    <>
      <style jsx>{`
                @keyframes spin-stepped {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spinner {
                    display: inline-block;
                    font-family: monospace;
                    font-size: 1.5rem; /* 24px */
                    font-weight: 200;
                    color: #cbd5e1; /* slate-300 */
                    animation-name: spin-stepped;
                    animation-duration: 1.2s;  
                    animation-iteration-count: infinite;
                    animation-timing-function: steps(16); 
                }
                @media (prefers-color-scheme: dark) {
                    .spinner { color: #94a3b8; /* slate-400 */ }
                }
            `}</style>
      <motion.div
        className="flex items-center space-x-3 p-4 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
        transition={{ duration: 0.3 }}
      >
        <div className="spinner">/</div>
      </motion.div>
    </>
  );
};

// --- LOCAL COMPONENTS ---
const SuggestionCard = ({ icon: Icon, title, description, onClick }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="group flex flex-col rounded-xl border border-slate-200/80 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600 dark:hover:bg-slate-700/50"
  >
    <Icon className="h-10 w-10 mb-4 text-blue-600" />
    <h4 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
  </button>
);

// --- MAIN PAGE COMPONENT ---
export default function DashboardPage({ setChatSessions }: {
  setChatSessions?: React.Dispatch<React.SetStateAction<ChatSessionItem[]>>
}) {
  // --- STATE MANAGEMENT ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [currentAction, setCurrentAction] = useState<Action>('chat');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [animatingMessageIndex, setAnimatingMessageIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  // Routing and Params
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSessionId = searchParams.get('sessionId');
  const [currentSessionId, setCurrentSessionId] = useState(activeSessionId);

  // Static data
  const suggestions = [
    { key: 'explain', icon: HelpCircle, title: "Wyjaśnij mi temat", description: "Poproś o proste wytłumaczenie.", prompt: "Wyjaśnij mi temat." },
    { key: 'test', icon: FileText, title: "Wygeneruj mi test", description: "Sprawdź swoją wiedzę.", prompt: "Wygeneruj mi test." },
    { key: 'plan', icon: BrainCircuit, title: "Stwórz plan nauki", description: "Zaplanuj naukę do egzaminu.", prompt: "Stwórz mi tygodniowy plan nauki." }
  ];

  // --- REFINED SCROLLING LOGIC ---
  const isInitialLoad = useRef(true);

  // Reset the initial load flag when the chat session changes.
  useEffect(() => {
    isInitialLoad.current = true;
  }, [activeSessionId]);

  // This one effect now handles three distinct scrolling scenarios:
  // 1. Initial History Load: Jumps instantly to the bottom ('auto').
  // 2. New User Message: Scrolls smoothly to the new message ('smooth').
  // 3. Animation Completion: Performs a final scroll correction to ensure the view is at the very bottom.
  useEffect(() => {
    // While the AI message is animating, the dedicated effect below is in control.
    if (animatingMessageIndex !== null) return;
    // Don't do anything if history is still loading.
    if (isHistoryLoading) return;

    if (scrollRef.current) {
      // The first scroll after a history load should be instant. All others should be smooth.
      const behavior = isInitialLoad.current ? 'auto' : 'smooth';

      // If we just performed the 'auto' scroll, set the flag to false
      // so all future scrolls in this chat are 'smooth'.
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
      }

      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior });
      }, 100);
    }
    // This hook is designed to run after history loads, when a new message is added,
    // and after the AI typing animation completes.
  }, [messages, isHistoryLoading, animatingMessageIndex]);

  // Handles continuous, instant scrolling ONLY during the bot's typing animation.
  useEffect(() => {
    if (animatingMessageIndex === null) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    const scrollToBottom = () => {
      scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'auto' });
      animationFrameId = requestAnimationFrame(scrollToBottom);
    };

    animationFrameId = requestAnimationFrame(scrollToBottom);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [animatingMessageIndex]);


  // --- HISTORY FETCHING ---
  useEffect(() => {
    const fetchHistory = async () => {
      if (activeSessionId !== currentSessionId) {
        setIsHistoryLoading(true);
        setMessages([]);
        setCurrentSessionId(activeSessionId);
        setSelectedSubject(null);
        setAnimatingMessageIndex(null);
      }
      try {
        const endpoint = activeSessionId ? `/api/chat?sessionId=${activeSessionId}` : '/api/chat';
        const response = await fetch(endpoint);
        if (!response.ok) {
          if (response.status === 404) { router.replace('/dashboard'); return; }
          throw new Error('Failed to fetch chat history.');
        }
        const data = await response.json();
        setMessages(data.history || []);
      } catch (error) {
        console.error("[FRONTEND_ERROR] Fetch history error:", error);
        setMessages([{ role: 'assistant', content: 'Nie udało się załadować historii czatu.' }]);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [activeSessionId, router, currentSessionId]);

  // --- CORE FUNCTION ---
  const handleSendMessage = async (message: string, file: File | null, action: Action) => {
    if ((!message.trim() && !file) || isLoading || isHistoryLoading) return;

    const userMessageContent = file ? `${message}\n\n*Załączono plik: ${file.name}*` : message;
    const newUserMessage: Message = { role: "user", content: userMessageContent.trim() };

    setAnimatingMessageIndex(null);
    setMessages(prev => [...prev, newUserMessage]);

    setIsLoading(true);
    // This state update triggers the first scroll effect for the spinner
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const formData = new FormData();
      formData.append('action', action);
      formData.append('message', message);
      if (activeSessionId) formData.append('chatSessionId', activeSessionId);
      if (file) formData.append('file', file);
      if (selectedSubject) formData.append('maturaSubject', selectedSubject.name);

      const response = await fetch('/api/chat', { method: 'POST', body: formData });
      setIsLoading(false);

      if (!response.ok) {
        const errorText = await response.text();
        const errorData = JSON.parse(errorText || "{}");
        throw new Error(errorData.message || `Serwer zwrócił błąd: ${response.status}`);
      }
      const data = await response.json();

      setTimeout(() => {
        const handleNewSession = (newSessionData: { _id: string; title: string; }) => {
          const { _id, title } = newSessionData;
          window.history.pushState(null, '', `/dashboard?sessionId=${_id}`);
          setCurrentSessionId(_id);
          if (typeof setChatSessions === 'function') {
            setChatSessions((prevSessions) => [{ _id, title, createdAt: new Date().toISOString() }, ...prevSessions]);
          }
        };

        if (data.type === 'chat' || data.type === 'exam' || data.type === 'animate') {
          // For animation responses, the linkType, linkId and animationPrompt are already included in the message
          // We don't need to add them separately
          const newAiMessage: Message = {
            ...data.message,
            ...(data.exam && { exam: data.exam })
          };
          setMessages(prev => {
            const updatedMessages = prev.slice(0, -1);
            // This triggers the continuous scroll effect
            setAnimatingMessageIndex(updatedMessages.length);
            return [...updatedMessages, newAiMessage];
          });
          if (data.newSession) {
            handleNewSession(data.newSession);
          }
        }
      }, 100);

    } catch (error) {
      if (isLoading) setIsLoading(false);
      console.error("[FRONTEND_ERROR] Error in handleSendMessage:", error);
      const errorMessageContent = (error instanceof Error) ? error.message : 'Przepraszam, wystąpił krytyczny błąd.';

      setTimeout(() => {
        setMessages(prev => {
          const updatedMessages = prev.slice(0, -1);
          return [...updatedMessages, { role: 'assistant', content: errorMessageContent }];
        });
      }, 100);
    }
  };

  const handleAnimationComplete = () => {
    // This stops the continuous scroll effect
    setAnimatingMessageIndex(null);
  };

  const handleSubjectSelect = (subject: Subject) => { setSelectedSubject(subject); };
  const handleClearSubject = () => { setSelectedSubject(null); };
  const handleSuggestionClick = (prompt: string) => {
    setCurrentAction('chat');
    handleSendMessage(prompt, null, 'chat');
  };

  const isEmpty = messages.length === 0 && !activeSessionId;
  const explainWidget = suggestions.find(s => s.key === 'explain');
  const testWidget = suggestions.find(s => s.key === 'test');

  // --- RENDER ---
  return (
    <MathJaxContext config={mathJaxConfig}>
      <div key={activeSessionId || 'default'} className="flex h-full w-full flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
        {isHistoryLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <motion.div className="text-sm text-slate-500 dark:text-slate-400">
              Wczytywanie wiadomości...
            </motion.div>
          </div>
        ) : isEmpty ? (
          // --- MODIFIED BLOCK FOR RESPONSIVE LAYOUT ---
          <div className="flex h-full flex-col">
            <div className="flex flex-grow flex-col items-center justify-center px-4">
              <div className="w-full max-w-[60rem] text-center">
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                  <img src="/logo1t.png" alt="Logo Uczmy.pl" className="mx-auto mb-4 h-16 w-16" />
                  <h2 className="mb-2 text-3xl font-bold text-slate-800 dark:text-slate-100">Witaj w Uczmy.pl!</h2>
                  <p className="text-slate-500 dark:text-slate-400">Jak mogę Ci dzisiaj pomóc w nauce? Wpisz pytanie poniżej.</p>
                </motion.div>
                <div className="my-8 hidden md:block">
                  <ChatInputForm
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    isHistoryLoading={isHistoryLoading}
                    action={currentAction}
                    onActionChange={setCurrentAction}
                    activeSubject={selectedSubject}
                    onClearSubject={handleClearSubject}
                    onSubjectSelect={handleSubjectSelect}
                  />
                </div>

              </div>
            </div>
            <div className="block p-4 md:hidden">
              <div className="mx-auto max-w-[60rem]">
                <ChatInputForm
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  isHistoryLoading={isHistoryLoading}
                  action={currentAction}
                  onActionChange={setCurrentAction}
                  activeSubject={selectedSubject}
                  onClearSubject={handleClearSubject}
                  onSubjectSelect={handleSubjectSelect}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-1 flex-col overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-scroll p-4 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-800 dark:scrollbar-thumb-slate-600 md:p-6">
              <div className="space-y-4 pb-32">
                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => (
                    <ChatMessage
                      key={`${activeSessionId || 'msg'}-${index}`}
                      message={msg}
                      isLastMessage={index === messages.length - 1}
                      shouldAnimate={index === animatingMessageIndex}
                      onAnimationComplete={handleAnimationComplete}
                      onSuggestionClick={(prompt) => handleSendMessage(prompt, null, 'chat')}
                    />
                  ))}
                  {isLoading && messages[messages.length - 1]?.content === '' && <SlashSpinner key="loading-indicator" />}
                </AnimatePresence>
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 w-full">
              <div className="p-4 md:p-6">
                <div className="mx-auto max-w-[60rem]">
                  <ChatInputForm
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    isHistoryLoading={isHistoryLoading}
                    action={currentAction}
                    onActionChange={setCurrentAction}
                    activeSubject={selectedSubject}
                    onClearSubject={handleClearSubject}
                    onSubjectSelect={handleSubjectSelect}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MathJaxContext>
  );
}