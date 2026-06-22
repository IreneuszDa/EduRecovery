// components/dashboard/Header.tsx

"use client";

import { Menu } from "lucide-react";
import { StreakDisplay } from "@/components/StreakDisplay";

type HeaderProps = {
    onToggleSidebar: () => void;
    isSidebarVisible: boolean;
};

const Header = ({ onToggleSidebar, isSidebarVisible }: HeaderProps) => {
    return (
        <header className="flex justify-between items-center h-16 px-6 md:px-8 border-b border-gray-200/90 dark:border-gray-700/80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-30 flex-shrink-0 shadow-sm">
            <button
                onClick={onToggleSidebar}
                aria-label={isSidebarVisible ? "Ukryj pasek boczny" : "Pokaż pasek boczny"}
                className="p-2.5 -ml-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all duration-200"
            >
                <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 md:gap-6">
                <StreakDisplay />
            </div>
        </header>
    );
};

export default Header;