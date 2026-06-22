// File: components/dashboard/BugReportModal.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Session } from "next-auth";

// Definicja typów dla propsów komponentu
type BugReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (description: string) => void;
    user: Session["user"];
    pathname: string;
};

const BugReportModal = ({ isOpen, onClose, onSubmit, user, pathname }: BugReportModalProps) => {
    const [description, setDescription] = useState("");

    // Resetuj pole opisu przy każdym otwarciu modala
    useEffect(() => {
        if (isOpen) {
            setDescription("");
        }
    }, [isOpen]);

    // Obsługa wysłania formularza
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Wyślij tylko jeśli opis nie jest pusty
        if (description.trim()) {
            onSubmit(description);
        }
    };

    // Nie renderuj nic, jeśli nie ma sesji użytkownika
    if (!user) {
        return null;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Tło z efektem rozmycia */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />
                    {/* Główny kontener modala z animacją */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-lg p-8 m-4 border border-gray-200/50 dark:border-gray-700/50"
                    >
                        {/* Nagłówek modala */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Zgłoś błąd</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200"
                                aria-label="Zamknij okno"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {/* Box informacyjny */}
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl mb-6 space-y-2 border border-blue-200/30 dark:border-blue-700/30">
                            <p>Zauważyłeś błąd lub coś nie działa tak, jak powinno?</p>
                            <p>Dziękujemy za pomoc w ulepszaniu platformy!</p>
                        </div>

                        {/* Formularz zgłoszenia */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Zgłaszający</label>
                                <div className="w-full p-3 bg-gray-100/80 dark:bg-gray-700/80 rounded-xl text-sm border border-gray-200/50 dark:border-gray-600/50">
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{user.name}</p>
                                    <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                                </div>
                            </div>
                            <div className="mb-5">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Lokalizacja zgłoszenia</label>
                                <div className="w-full p-3 bg-gray-100/80 dark:bg-gray-700/80 rounded-xl text-sm border border-gray-200/50 dark:border-gray-600/50">
                                    <p className="font-mono text-gray-600 dark:text-gray-400 truncate">{pathname}</p>
                                </div>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="bug-description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Opisz problem</label>
                                <textarea
                                    id="bug-description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Opisz błąd lub nietypowe zachowanie, które zauważyłeś/aś..."
                                    className="w-full h-32 p-4 border border-gray-300/80 dark:border-gray-600/80 rounded-xl bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 backdrop-blur-sm"
                                    required
                                />
                            </div>
                            {/* Przyciski akcji */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/90 dark:bg-gray-700/90 border border-gray-300/80 dark:border-gray-600/80 rounded-xl hover:bg-gray-50/90 dark:hover:bg-gray-600/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800 transition-all duration-200 backdrop-blur-sm"
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                    disabled={!description.trim()}
                                >
                                    Wyślij zgłoszenie
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BugReportModal;