// components/learn/LearnViewSkeleton.tsx

import { motion } from 'framer-motion';

export function LearnViewSkeleton() {
    return (
        <div className="w-full max-w-3xl min-h-[650px] flex flex-col mx-auto px-6 sm:px-6 bg-gray-50 dark:bg-gray-900">
            {/* Progress Bar Skeleton */}
            <div className="w-full mb-6">
                <div className="w-full bg-slate-200/70 dark:bg-slate-700 rounded-full h-4 shadow-inner overflow-hidden">
                    <motion.div
                        className="bg-slate-300 dark:bg-slate-600 h-4 rounded-full animate-pulse"
                    />
                </div>
            </div>

            <div className="flex-grow flex flex-col">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700 rounded-3xl shadow-lg flex flex-col flex-grow p-6 md:p-8 animate-pulse">
                    {/* Header Skeleton */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="space-y-4 mb-6">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                    </div>

                    {/* Options Skeleton */}
                    <div className="space-y-3">
                        <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                        <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                        <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                        <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                    </div>

                    {/* Footer Skeleton */}
                    <div className="border-t border-slate-200/80 dark:border-slate-700 mt-auto -m-6 md:-m-8 pt-4 md:pt-6 px-4 md:px-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex gap-3">
                                <div className="h-14 w-14 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                                <div className="h-14 w-14 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                            </div>
                            <div className="h-14 bg-slate-200 dark:bg-slate-700 rounded-xl w-36"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}