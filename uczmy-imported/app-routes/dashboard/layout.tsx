// Plik: app/(main)/dashboard/layout.tsx

"use client";

import React, { useState, useEffect, isValidElement } from "react";
import { usePathname, redirect } from 'next/navigation';
import { useSession } from "next-auth/react";
import { toast } from 'sonner';
import { AnimatePresence, motion } from "framer-motion";

import { ChatSession } from "@/types";
import { Session } from "next-auth";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import BugReportModal from "@/components/dashboard/BugReportModal";
import DashboardLoading from "@/components/ui/DashboardLoading";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        },
    });

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [isBugModalOpen, setIsBugModalOpen] = useState(false);
    const [isSubmittingBug, setIsSubmittingBug] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarVisible(false);
            } else {
                setIsSidebarVisible(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchSessions = async () => {
            if (!session) return;
            setIsHistoryLoading(true);
            try {
                const response = await fetch('/api/chat/sessions');
                if (!response.ok) throw new Error('Nie udało się pobrać sesji czatów');
                const data = await response.json();
                setChatSessions(data);
            } catch (error) {
                console.error("Błąd podczas pobierania historii czatów:", error);
            } finally {
                setIsHistoryLoading(false);
            }
        };
        fetchSessions();
    }, [session]);

    const handleBugSubmit = async (description: string) => {
        if (!session?.user) {
            toast.error("Błąd: Brak sesji użytkownika.");
            return;
        }
        setIsSubmittingBug(true);
        toast.loading("Wysyłanie Twojego zgłoszenia...");
        try {
            const response = await fetch('/api/bugs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, pathname }),
            });
            toast.dismiss();
            if (response.ok) {
                toast.success("Dziękujemy! Twoje zgłoszenie zostało wysłane.");
                setIsBugModalOpen(false);
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Wystąpił nieznany błąd serwera.');
            }
        } catch (error) {
            toast.dismiss();
            console.error("Błąd podczas wysyłania formularza zgłoszenia:", error);
            toast.error(`Błąd sieci: ${error instanceof Error ? error.message : 'Spróbuj ponownie.'}`);
        } finally {
            setIsSubmittingBug(false);
        }
    };

    const handleNavigation = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarVisible(false);
        }
    };

    if (status === 'loading' || !session) {
        return <DashboardLoading />;
    }

    const childrenWithProps = isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ setChatSessions?: React.Dispatch<React.SetStateAction<ChatSession[]>> }>, { setChatSessions })
        : children;

    return (
        <>
            <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 font-sans antialiased">
                <div
                    className={`
                        hidden lg:block flex-shrink-0 bg-white dark:bg-gray-900
                        transition-all duration-300 ease-in-out
                        ${isSidebarVisible ? 'w-72' : 'w-0'}
                    `}
                >
                    <div className="w-72 h-full overflow-hidden whitespace-nowrap">
                        {/* --- POCZĄTEK KLUCZOWEJ ZMIANY --- */}
                        {/* Renderujemy Sidebar tylko, gdy jest widoczny */}
                        {isSidebarVisible && (
                            <Sidebar
                                isHistoryLoading={isHistoryLoading}
                                chatSessions={chatSessions}
                                session={session as Session}
                                onReportBugClick={() => setIsBugModalOpen(true)}
                                isVisible={isSidebarVisible}
                                onNavigate={handleNavigation}
                            />
                        )}
                        {/* --- KONIEC KLUCZOWEJ ZMIANY --- */}
                    </div>
                </div>

                <div className="flex flex-1 flex-col overflow-y-hidden">
                    <Header
                        onToggleSidebar={() => setIsSidebarVisible(prev => !prev)}
                        isSidebarVisible={isSidebarVisible}
                    />
                    {/* ZMODYFIKOWANA LINIA: Dodano klasę 'custom-scrollbar' */}
                    <main className="flex-1 overflow-y-auto custom-scrollbar">
                        {childrenWithProps}
                    </main>
                </div>
            </div>

            {/* Logika dla mobilnego sidebara jest już poprawna i nie wymaga zmian */}
            <div className="lg:hidden">
                <AnimatePresence>
                    {isSidebarVisible && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/60 z-40"
                            onClick={() => setIsSidebarVisible(false)}
                            aria-hidden="true"
                        />
                    )}
                </AnimatePresence>

                <div
                    className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="w-72 h-full">
                        <Sidebar
                            isHistoryLoading={isHistoryLoading}
                            chatSessions={chatSessions}
                            session={session as Session}
                            onReportBugClick={() => setIsBugModalOpen(true)}
                            isVisible={isSidebarVisible}
                            onNavigate={handleNavigation}
                        />
                    </div>
                </div>
            </div>

            <BugReportModal
                isOpen={isBugModalOpen}
                onClose={() => !isSubmittingBug && setIsBugModalOpen(false)}
                onSubmit={handleBugSubmit}
                user={session.user}
                pathname={pathname}
            />
        </>
    );
}