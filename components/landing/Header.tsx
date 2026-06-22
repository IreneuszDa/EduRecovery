// components/landing/Header.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const HamburgerIcon = () => (<motion.svg whileHover={{ rotate: 90 }} className="w-8 h-8 text-gray-800 dark:text-gray-200" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16m-7 6h7"></path></motion.svg>);
const CloseIcon = () => (<motion.svg whileHover={{ rotate: 90 }} className="w-8 h-8 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></motion.svg>);

interface HeaderProps {
    isScrolled: boolean;
}

export default function Header({ isScrolled }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-md' : 'bg-transparent'}`}>
                <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 py-3">
                    <motion.a href="/" className="flex items-center" whileHover={{ scale: 1.05 }}>
                        <Image src="/logosm.png" alt="EduRecovery UA logo" width={186} height={100} className="h-12 w-auto" priority />
                    </motion.a>

                    <nav className="hidden md:flex items-center space-x-2">
                        <a href="#waitlist" className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 rounded-full transition-colors duration-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50">Lista oczekujących</a>
                        <a href="/formularz-szkola" className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 rounded-full transition-colors duration-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50">Dla szkół</a>
                        <motion.a href="/login" className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-blue-700 transition-all" whileHover={{ scale: 1.05, y: -2 }}>
                            Zaloguj się
                        </motion.a>
                    </nav>

                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(true)} aria-label="Otwórz menu"><HamburgerIcon /></button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl md:hidden" onClick={() => setIsMenuOpen(false)}>
                        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6" aria-label="Zamknij menu"><CloseIcon /></button>
                            <nav className="flex flex-col items-center space-y-8 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                <a href="#waitlist" onClick={() => setIsMenuOpen(false)}>Lista oczekujących</a>
                                <a href="/formularz-szkola" onClick={() => setIsMenuOpen(false)}>Dla szkół</a>
                                <a href="/login" onClick={() => setIsMenuOpen(false)} className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full">Zaloguj się</a>
                            </nav>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
