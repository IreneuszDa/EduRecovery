// @/components/drive/ErrorDisplay.tsx

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { button } from './Button';

type ErrorDisplayProps = {
    message: string;
    onRetry: () => void;
};

export const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps) => (
    <div className="flex flex-col items-center justify-center text-center bg-red-50/50 text-red-900 dark:bg-red-900/20 dark:text-red-200 p-8 rounded-2xl mt-8 border-2 border-dashed border-red-200 dark:border-red-500/30">
        <AlertTriangle className="w-14 h-14 mb-4 text-red-500 dark:text-red-400" />
        <h3 className="text-xl font-semibold mb-2">An Unexpected Error Occurred</h3>
        <p className="text-sm max-w-md text-red-800 dark:text-red-300">{message}</p>
        <button onClick={onRetry} className={button({ variant: 'danger', class: 'mt-6' })}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
        </button>
    </div>
);