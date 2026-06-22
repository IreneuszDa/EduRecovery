// File: components/dashboard/SidebarProfileMenu.tsx

"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    LogOut,
    Bug,
    Moon,
    Star,
    HelpCircle
} from "lucide-react";

// Definicja typów dla propsów komponentu
type SidebarProfileMenuProps = {
    onReportBugClick: () => void;
};

const SidebarProfileMenu = ({ onReportBugClick }: SidebarProfileMenuProps) => {
    // Pobranie danych sesji użytkownika
    const { data: session } = useSession();

    // Stan do zarządzania widocznością menu
    const [isOpen, setIsOpen] = useState(false);

    // Referencja do elementu menu, aby wykrywać kliknięcia na zewnątrz
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Stan do zarządzania trybem ciemnym, inicjalizowany z localStorage
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return false;
    });

    // Efekt do zamykania menu po kliknięciu poza jego obszarem
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    // Efekt do zarządzania klasą 'dark' na elemencie <html> i zapisywania w localStorage
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // Handler dla przycisku "Zgłoś błąd"
    const handleReportClick = () => {
        setIsOpen(false); // Najpierw zamknij menu
        onReportBugClick(); // Potem wywołaj funkcję z propsa
    };

    // Handler dla (przyszłej) funkcji polecania znajomych
    const handleReferFriend = () => {
        setIsOpen(false);
        alert("Funkcja polecania znajomych będzie dostępna wkrótce!");
    };

    // Jeśli nie ma sesji, nie renderuj komponentu
    if (!session?.user) {
        return null;
    }

    // Pobranie inicjału użytkownika lub domyślnej ikony
    const userInitial = session.user.name?.charAt(0).toUpperCase() || <User size={16} />;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Przycisk otwierający menu */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="Otwórz menu profilu"
                className="w-full flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0 shadow-md">
                    {userInitial}
                </div>
                <div className="flex-1 flex flex-col items-start overflow-hidden ml-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate w-full">{session.user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-full">{session.user.email}</p>
                </div>
            </button>

            {/* Animowane menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute origin-bottom-left bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50 p-3 bottom-full left-0 mb-3 w-full border border-gray-200/50 dark:border-gray-700/50"
                    >
                        {/* Nagłówek wewnątrz menu */}
                        <div className="px-3 py-3 border-b border-gray-100/80 dark:border-gray-700/80 mb-2">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate" title={session.user.name || ""}>{session.user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={session.user.email || ""}>{session.user.email}</p>
                        </div>

                        {/* Nawigacja w menu */}
                        <nav className="py-1">
                            <Link href="/dashboard/profile" onClick={() => setIsOpen(false)} className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:text-gray-900 dark:hover:text-gray-100 rounded-xl transition-all duration-200">
                                <User className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" strokeWidth={2} />
                                Profil
                            </Link>
                            <div className="my-2 h-px bg-gray-100/80 dark:bg-gray-700/80" />
                            <button onClick={handleReportClick} className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:text-gray-900 dark:hover:text-gray-100 rounded-xl transition-all duration-200">
                                <Bug className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" strokeWidth={2} />
                                Zgłoś błąd
                            </button>

                            <button onClick={handleReferFriend} className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:text-gray-900 dark:hover:text-gray-100 rounded-xl transition-all duration-200">
                                <Star className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" strokeWidth={2} />
                                Poleć znajomemu
                            </button>
                            <Link href="/help" onClick={() => setIsOpen(false)} className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:text-gray-900 dark:hover:text-gray-100 rounded-xl transition-all duration-200">
                                <HelpCircle className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" strokeWidth={2} />
                                Centrum pomocy
                            </Link>
                            <div className="my-2 h-px bg-gray-100/80 dark:bg-gray-700/80" />
                            <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50/80 dark:hover:bg-red-900/30 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium rounded-xl transition-all duration-200" >
                                <LogOut className="w-4 h-4 mr-3" strokeWidth={2} />
                                Wyloguj
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SidebarProfileMenu;