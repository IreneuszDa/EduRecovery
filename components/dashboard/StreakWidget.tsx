import { CheckCircle2, Loader2 } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useStreak } from "@/lib/hooks/useStreak";

// Removed unused helpers as we use the new design

export const StreakWidget = () => {
    const { streak, loading, currentDayIndex } = useStreak();

    // Use streak directly
    const streakCount = streak;
    const isLoading = loading;
    const error = null;

    const containerVariants: Variants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeInOut"
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg min-h-[180px]">
                <Loader2 className="w-6 h-6 text-slate-400 dark:text-slate-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-red-500/20 dark:border-red-500/20 shadow-lg min-h-[180px]">
                <p className="text-base font-semibold text-red-600 dark:text-red-400">Wystąpił błąd</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">{error}</p>
            </div>
        );
    }

    return (
        <motion.div
            className="group flex flex-col justify-between p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg h-full border border-slate-200/80 dark:border-slate-700/80 transition-all duration-300 hover:shadow-xl hover:border-orange-200/50 dark:hover:border-orange-700/50 overflow-visible"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Seria nauki</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Twoja regularność to klucz do sukcesu</p>
                </div>
            </div>

            <div className="flex items-end justify-between w-full h-14">
                {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'].map((day, i) => {
                    // Match logic from Student Dashboard
                    const isCompleted = i < streakCount && i <= currentDayIndex;
                    const isCurrentDay = i === currentDayIndex;

                    return (
                        <div
                            key={i}
                            className="relative flex flex-col items-center gap-1 group flex-1"
                        >
                            {isCurrentDay && (
                                <span className="absolute -top-6 text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-800 whitespace-nowrap z-20">
                                    Dziś
                                </span>
                            )}
                            <div
                                className={`
                                    w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 rounded-full flex items-center justify-center transition-all duration-300
                                    ${isCompleted
                                        ? 'bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 scale-100'
                                        : isCurrentDay
                                            ? 'bg-white dark:bg-slate-800 border-2 border-blue-500 text-blue-600 dark:text-blue-400 shadow-xl shadow-blue-500/20 scale-110 z-10'
                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'
                                    }
                                `}
                            >
                                <span className="text-[10px] sm:text-xs font-bold">
                                    {isCompleted ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : day}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};