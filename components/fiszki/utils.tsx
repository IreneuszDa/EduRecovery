// Contains helper functions for display logic.
import { Layers3, FileText } from 'lucide-react';
import React from 'react';

export const getCategoryIcon = (category: string) => {
    // A simple placeholder. Could be expanded with more categories.
    if (category) return <Layers3 className="h-7 w-7 text-blue-600" />;
    return <FileText className="h-7 w-7 text-slate-500" />;
};

export const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return "przed chwilą";
    if (minutes < 60) return `${minutes} min temu`;
    if (hours < 24) return `${hours} godz. temu`;
    return `${days} dni temu`;
};