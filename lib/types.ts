export interface ICard {
    term: string;
    definition: string;
}

export interface ISessionCard extends ICard {
    originalIndex: number;
}

export interface IFlashcardSet {
    _id: string;
    title: string;
    cards: ICard[];
}
export interface Exam {
    _id: string;
    title: string;
    subject: string;
    createdAt: string;
    isPublic: boolean;
    questions: any[];
}

export type SortByType = 'newest' | 'oldest';

export type LearnMode = 'vanilla' | 'active' | 'typed';