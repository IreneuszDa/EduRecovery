import { IExam as DataModelExam } from '@/models/exam';

// The specific action requested by the client
// MODIFICATION: Added 'learn' and 'animate' action types
export type ActionType = 'chat' | 'generateFlashcards' | 'generateExam' | 'learn' | 'animate';

// Base message structure used for chat history and client-server communication
export type Message = {
    role: 'user' | 'assistant';
    content: string;
    // MODIFICATION: Replaced 'link' object with a more efficient type/id system
    linkType?: 0 | 1 | 2; // 0 for flashcards, 1 for exams, 2 for animations
    linkId?: string;
    animationPrompt?: string; // For storing the original animation prompt
};

// The message object sent to the client, which can include proposed questions
export type ChatResponseMessage = Message & {
    proposedQuestions?: string[];
};

// A lean user type for fetching chat history
export type UserWithChatHistory = {
    chatHistory: Message[];
};

// Re-exporting the IExam data model interface for use in handlers
export type IExam = DataModelExam;