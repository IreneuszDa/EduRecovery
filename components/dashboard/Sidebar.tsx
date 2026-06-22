// Plik: components/dashboard/Sidebar.tsx

"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession, signOut, signIn } from "next-auth/react";
import { Session } from "next-auth";
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, LogOut, FileText, Layers, TrendingUp, Compass,
    MessageSquarePlus, MessageSquare, LayoutDashboard, Library, Bug,
    Moon, Star, HelpCircle, Loader2,
    HardDrive
} from "lucide-react";

type ChatSession = {
    _id: string;
    title: string;
    createdAt: string;
};

// --- POCZĄTEK ZMIAN w SidebarNavItem ---
type SidebarNavItemProps = {
    icon: React.ComponentType<{ className?: string, strokeWidth?: number }>;
    label: string;
    href: string;
    isActive?: boolean;
    // Dodajemy nową, opcjonalną właściwość
    onNavigate?: () => void;
};

const SidebarNavItem = ({ icon: Icon, label, href, isActive = false, onNavigate }: SidebarNavItemProps) => (
    // Dodajemy zdarzenie onClick, które wywoła przekazaną funkcję
    <Link
        href={href}
        title={label}
        onClick={onNavigate}
        className="flex items-center py-2.5 px-3.5 rounded-lg text-sm transition-all duration-200 group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
        {isActive && (
            <motion.div
                layoutId="active-main-nav"
                className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-md"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
        )}
        <div className="relative z-10 flex items-center">
            <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`}
                strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={`ml-4 whitespace-nowrap overflow-hidden ${isActive ? "text-gray-900 dark:text-gray-50 font-semibold" : "text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 font-medium"}`}>
                {label}
            </span>
        </div>
    </Link>
);
// --- KONIEC ZMIAN w SidebarNavItem ---


type ChatHistoryProps = {
    isLoading: boolean;
    sessions: ChatSession[];
    activeSessionId: string | null;
};

const ChatHistory = ({ isLoading, sessions, activeSessionId }: ChatHistoryProps) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-20">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
        );
    }

    // --- POCZĄTEK ZMIAN w ChatHistory (dodajemy onNavigate do linków historii) ---
    // Aby to działało również dla linków historii, musimy dodać 'onNavigate' tutaj
    const { onNavigate } = React.useContext(SidebarContext);

    return (
        // ZMODYFIKOWANA LINIA: Zmieniono 'scrollbar-hide' na 'custom-scrollbar'
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <nav className="flex flex-col space-y-1 pr-2">
                <AnimatePresence>
                    {sessions.map(cs => (
                        <motion.div key={cs._id} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                            <Link
                                href={`/dashboard/chat?sessionId=${cs._id}`}
                                onClick={onNavigate}
                                className={`flex items-center py-2 px-3 rounded-md text-sm transition-colors group ${activeSessionId === cs._id ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'}`}
                            >
                                <MessageSquare className="w-4 h-4 mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400" strokeWidth={2} />
                                <span className="truncate flex-1">{cs.title}</span>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </nav>
        </div>
    );
};
// --- KONIEC ZMIAN w ChatHistory ---


type SidebarProfileMenuProps = {
    onReportBugClick: () => void;
};

const SidebarProfileMenu = ({ onReportBugClick }: SidebarProfileMenuProps) => {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return false;
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const handleReportClick = () => {
        setIsOpen(false);
        onReportBugClick();
    };

    if (!session?.user) return null;

    const userInitial = session.user.name?.charAt(0).toUpperCase() || <User size={16} />;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="Otwórz menu profilu"
                className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
                <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-semibold text-sm flex-shrink-0 border-2 border-white dark:border-gray-700 shadow-sm">
                    {userInitial}
                </div>
                <div className="flex-1 flex flex-col items-start overflow-hidden ml-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate w-full">{session.user.name}</p>
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute origin-bottom-left bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50 p-2 bottom-full left-0 mb-2 w-full"
                    >
                        {/* Nawigacja w menu profilu również powinna zamykać sidebar */}
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate" title={session.user.name || ""}>{session.user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={session.user.email || ""}>{session.user.email}</p>
                        </div>
                        <nav className="py-1">
                            <Link href="/dashboard/profile" onClick={() => setIsOpen(false)} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-md transition-colors">
                                <User className="w-4 h-4 mr-3 text-gray-500" strokeWidth={2} />
                                Profil
                            </Link>

                            <div className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                            <button onClick={handleReportClick} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-md transition-colors">
                                <Bug className="w-4 h-4 mr-3 text-gray-500" strokeWidth={2} />
                                Zgłoś błąd
                            </button>

                            <Link href="/help" onClick={() => setIsOpen(false)} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 rounded-md transition-colors">
                                <HelpCircle className="w-4 h-4 mr-3 text-gray-500" strokeWidth={2} />
                                Centrum pomocy
                            </Link>
                            <div className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                            <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium rounded-md transition-colors" >
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


// --- POCZĄTEK ZMIAN w MAIN SIDEBAR ---
type SidebarProps = {
    isVisible: boolean;
    isHistoryLoading: boolean;
    chatSessions: ChatSession[];
    session: Session;
    onReportBugClick: () => void;
    // Odbieramy nową, opcjonalną właściwość
    onNavigate?: () => void;
};

// Tworzymy kontekst, aby przekazać `onNavigate` w głąb drzewa komponentów bez "prop drillingu"
const SidebarContext = React.createContext<{ onNavigate?: () => void }>({});

const Sidebar = ({ isVisible, isHistoryLoading, chatSessions, session, onReportBugClick, onNavigate }: SidebarProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeSessionId = searchParams.get('sessionId');

    const isTeacher = session?.user?.profileType === 1;
    const isParent = session?.user?.profileType === 2;

    const studentNavItems = [
        { icon: LayoutDashboard, label: "Strona główna", href: "/dashboard/student" },
        { icon: Layers, label: "Fiszki", href: "/dashboard/fiszki" },
        { icon: FileText, label: "Egzaminy", href: "/dashboard/exams" },
        { icon: Compass, label: "Odkrywaj", href: "/dashboard/explore" },
    ];

    const teacherNavItems = [
        { icon: LayoutDashboard, label: "Strona główna", href: "/dashboard/teacher" },
        { icon: Layers, label: "Fiszki", href: "/dashboard/fiszki" },
        { icon: FileText, label: "Egzaminy", href: "/dashboard/exams" },
        { icon: Compass, label: "Odkrywaj", href: "/dashboard/explore" },
    ];

    const parentNavItems = [
        { icon: LayoutDashboard, label: "Strona główna", href: "/dashboard/parent" },
        { icon: TrendingUp, label: "Postępy", href: "/dashboard/parent/report" },
        { icon: MessageSquare, label: "Ogłoszenia", href: "/dashboard/parent/inbox" },
    ];

    let navItemsToDisplay = studentNavItems;
    if (isTeacher) navItemsToDisplay = teacherNavItems;
    if (isParent) navItemsToDisplay = parentNavItems;

    // Kliknięcie w "Nowa rozmowa" też powinno zamykać sidebar
    const handleNewChatClick = (e: React.MouseEvent) => {
        onNavigate?.();
    };

    return (
        // Opakowujemy wszystko w Provider Kontekstu
        <SidebarContext.Provider value={{ onNavigate }}>
            <aside className="w-full h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200/80 dark:border-gray-700/60">
                <div className="flex flex-col flex-1 min-w-0 overflow-x-hidden p-5 whitespace-nowrap">
                    <div className="flex-shrink-0">
                        <Link href="/dashboard" onClick={handleNewChatClick} className="flex items-center space-x-3 px-2 mb-6 group">
                            <img src="/logo1t.png" alt="Logo Uczmy.pl" className="h-10 w-10 flex-shrink-0" />
                            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Uczmy.pl</span>
                        </Link>
                    </div>

                    <nav className="flex flex-col space-y-1.5 mb-6 flex-shrink-0">
                        {isTeacher && (
                            <p className="px-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Narzędzia</p>
                        )}
                        {navItemsToDisplay.map(item => (
                            <SidebarNavItem
                                key={item.href}
                                {...item}
                                isActive={item.href === "/dashboard" ? pathname === item.href && !activeSessionId : pathname.startsWith(item.href)}
                                // Przekazujemy `onNavigate` dalej
                                onNavigate={onNavigate}
                            />
                        ))}
                    </nav>

                    <div className="flex flex-col flex-1 min-h-0">
                        {!isParent && (
                            <div className="flex-shrink-0 mb-4">
                                <Link href="/dashboard/chat" onClick={handleNewChatClick} className="flex items-center justify-center gap-2.5 w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                                    <MessageSquarePlus className="w-5 h-5" strokeWidth={2.5} />
                                    Nowa rozmowa
                                </Link>
                            </div>
                        )}
                        {!isParent && (
                            <>
                                <p className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex-shrink-0">Historia</p>
                                <ChatHistory
                                    isLoading={isHistoryLoading}
                                    sessions={chatSessions}
                                    activeSessionId={activeSessionId}
                                />
                            </>
                        )}
                    </div>
                    <div className="border-t border-gray-200/80 dark:border-gray-700/60 pt-4 mt-4 flex-shrink-0">
                        <SidebarProfileMenu onReportBugClick={onReportBugClick} />
                    </div>
                </div>
            </aside>
        </SidebarContext.Provider>
    );
};
// --- KONIEC ZMIAN w MAIN SIDEBAR ---

export default Sidebar;