// Defines the core data structures used by the flashcard components.

export interface IFlashcardSet {
    _id: string;
    title: string;
    category: string;
    createdAt: string;
    isPublic: boolean;
    cards: any[]; // Or a more specific type for cards
}

export type SortByType = 'newest' | 'oldest';