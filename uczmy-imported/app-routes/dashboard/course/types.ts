// Shared types for the course dashboard

export type LessonNodeData = {
    id: number;
    title: string;
    status: 'completed' | 'unlocked' | 'locked' | 'in-progress';
    duration: number; // in minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    progress?: number; // 0-100 percentage
    lastAccessed?: Date;
    estimatedCompletionTime?: number;
    subjectKey: string;
};

export type UserProgress = {
    totalLessonsCompleted: number;
    totalTimeSpent: number; // in minutes
    currentStreak: number;
    weeklyGoal: number;
    weeklyProgress: number;
    subjectProgress: Record<string, {
        completedLessons: number;
        totalLessons: number;
        timeSpent: number;
        lastActivity: Date;
    }>;
};

export type PlanView = 'dashboard' | 'subjects' | 'path' | 'lesson' | 'analytics' | 'lesson-plan';
