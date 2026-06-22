'use client';

import { motion } from 'framer-motion';

const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function Waitlist() {
    return (
        <motion.section
            id="waitlist"
            className="py-20 sm:py-32 bg-gray-50 dark:bg-slate-800"

            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Bądź pierwszy w kolejce!
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Nasza platforma jest już prawie gotowa. Zapisz się na listę oczekujących, aby otrzymać powiadomienie i wcześniejszy dostęp, gdy tylko wystartujemy.
                </p>
                <motion.a
                    href="/waitlist" // Make sure this link is correct
                    className="mt-10 inline-block px-10 py-5 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                >
                    Dołącz do listy oczekujących
                </motion.a>
            </div>
        </motion.section>
    );
}