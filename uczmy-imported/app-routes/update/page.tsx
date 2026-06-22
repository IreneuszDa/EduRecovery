// app/update/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/landing/Header'; // Upewnij się, że ścieżka jest poprawna
import Footer from '@/components/landing/Footer'; // Upewnij się, że ścieżka jest poprawna
import { motion } from 'framer-motion';
import { Calendar, Tag, Zap, Newspaper} from 'lucide-react'; // Ikony dla lepszej wizualizacji

// Przykładowe dane aktualizacji - w przyszłości można je pobierać z CMS lub API
const updates = [
    {
        date: '24 sierpnia 2025',
        category: 'Nowa funkcja',
        title: 'Uruchomienie Dziennika Aktualizacji!',
        description: 'Z radością prezentujemy nową stronę z aktualizacjami! Od teraz wszystkie nowości, poprawki i ważne informacje są tutaj !',
        icon: <Zap className="h-5 w-5 text-green-500" />,
        color: 'green'
    },
    {
        date: '20 sierpnia 2025',
        category: 'Ulepszenie',
        title: 'Aktualizacja wyglądu i poprawki błędów',
        description: 'Wprowadziliśmy odświeżony wygląd platformy oraz szereg poprawek i bug fixów, dzięki czemu korzystanie z Uczmy.pl jest jeszcze przyjemniejsze i bardziej stabilne.',
        icon: <Newspaper className="h-5 w-5 text-yellow-500" />,
        color: 'yellow'
    },
    {
        date: '17 sierpnia 2025',
        category: 'Aktualności',
        title: 'Uczmy.pl w sieci',
        description: 'Oficjalnie wystartowaliśmy online! Od teraz Uczmy.pl jest dostępne w sieci, a uczniowie i nauczyciele mogą korzystać z pierwszych funkcji platformy wspieranej przez AI.',
        icon: <Zap className="h-5 w-5 text-blue-500" />,
        color: 'blue'

    }
];

// Komponent pojedynczego wpisu na osi czasu
const UpdateItem = ({ update, index }: { update: typeof updates[0], index: number }) => {
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="relative pl-8 sm:pl-12 py-6 group"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.15, duration: 0.5 }}
        >
            {/* Kropka i linia na osi czasu */}
            <div className={`flex items-center absolute left-0 sm:left-4 top-6 h-full`}>
                <span className={`h-4 w-4 rounded-full bg-gray-200 dark:bg-slate-700 group-hover:bg-${update.color}-500 transition-colors`}></span>
                <div className="w-px h-full bg-gray-200 dark:bg-slate-700"></div>
            </div>

            <div className="flex flex-col sm:flex-row items-start mb-1">
                {/* Data */}
                <time className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 sm:absolute sm:left-14 sm:top-6">
                    <Calendar className="w-4 h-4 mr-2" />
                    {update.date}
                </time>
            </div>

            {/* Treść aktualizacji (TUTAJ ZASZŁA ZMIANA) */}
            <div className="mt-2 sm:mt-0 p-6 rounded-xl bg-white dark:bg-slate-800/50 shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                    <span className={`bg-${update.color}-100 dark:bg-${update.color}-900/50 p-2 rounded-full`}>{update.icon}</span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-${update.color}-100 text-${update.color}-800 dark:bg-${update.color}-900/50 dark:text-${update.color}-300`}>
                        {update.category}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{update.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{update.description}</p>
            </div>
        </motion.div>
    );
};


export default function UpdatePage() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
            <Header isScrolled={isScrolled} />

            <main className="pt-24 sm:pt-32 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">

                    {/* Nagłówek strony */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12 sm:mb-16"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                            Nowości i <span className="text-blue-600">Aktualizacje</span>
                        </h1>
                        <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                            Zobacz, co nowego dodaliśmy i jakie ulepszenia wprowadziliśmy. Bądź na bieżąco z rozwojem Uczmy.pl.
                        </p>
                    </motion.div>

                    {/* Oś czasu z aktualizacjami */}
                    <div className="relative">
                        {/* Linia osi czasu */}
                        <div className="hidden sm:block absolute top-6 left-4 bottom-0 w-px bg-gray-200 dark:bg-slate-700"></div>

                        {updates.map((update, index) => (
                            <UpdateItem key={index} update={update} index={index} />
                        ))}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}