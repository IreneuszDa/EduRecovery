// @/components/drive/FilesLoadingSkeleton.tsx

export const FilesLoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-xl shadow-sm animate-pulse">
                {/* Dark mode: Changed background to dark slate */}
                <div className="flex items-center justify-between mb-4">
                    {/* Dark mode: Changed placeholder background */}
                    <div className="w-10 h-10 bg-gray-300 dark:bg-slate-700 rounded-lg"></div>
                    <div className="w-8 h-8 bg-gray-300 dark:bg-slate-700 rounded-full"></div>
                </div>
                <div className="space-y-2">
                    {/* Dark mode: Changed placeholder background */}
                    <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-300 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
            </div>
        ))}
    </div>
);