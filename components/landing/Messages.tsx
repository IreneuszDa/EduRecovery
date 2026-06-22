'use client';

import { motion, useScroll, useTransform, MotionStyle } from 'framer-motion';
import { useRef } from 'react';

// Komponent akceptuje 'style' do dynamicznych animacji
const DemoMessage = ({ text, isUser, style }: { text: string; isUser?: boolean; style: MotionStyle }) => {
    const bubbleClasses = isUser
        ? "bg-blue-500 text-white self-end"
        : "bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 self-start";
    const containerClasses = isUser ? "flex justify-end" : "flex justify-start";

    return (
        <motion.div style={style} className={containerClasses}>
            {/* ZMIANA 4: Ustawiono responsywną szerokość dymka, aby pasowała do węższych ekranów. */}
            <div className={`rounded-2xl px-4 py-2 max-w-[18rem] sm:max-w-xs shadow-md ${bubbleClasses}`}>
                {text}
            </div>
        </motion.div>
    );
};

export default function Messages() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start end', 'end center']
    });

    // Zaawansowane animacje sterowane przewijaniem
    const headingOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
    const headingY = useTransform(scrollYProgress, [0.1, 0.3], [30, 0]);

    const paragraphOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
    const paragraphY = useTransform(scrollYProgress, [0.15, 0.35], [30, 0]);

    const listOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
    const listY = useTransform(scrollYProgress, [0.2, 0.4], [30, 0]);

    const chatContainerY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
    const chatContainerOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

    const createBubbleAnimation = (start: number, end: number) => ({
        opacity: useTransform(scrollYProgress, [start, end], [0, 1]),
        scale: useTransform(scrollYProgress, [start, end], [0.9, 1]),
    });

    const bubble1Style = createBubbleAnimation(0.25, 0.4);
    const bubble2Style = createBubbleAnimation(0.3, 0.45);
    const bubble3Style = createBubbleAnimation(0.35, 0.5);
    const bubble4Style = createBubbleAnimation(0.4, 0.55);

    return (
        <motion.section
            ref={targetRef}
            id="messages"
            className="relative pb-24 sm:pb-32 overflow-hidden bg-white dark:bg-slate-900"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* 
                  ZMIANA 1: Zmieniono 'lg:grid-cols-2' na 'md:grid-cols-2'.
                  To aktywuje układ dwukolumnowy na telefonach w trybie poziomym i tabletach,
                  zachowując jedną kolumnę w trybie pionowym.
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Lewa strona: Treść z płynną animacją */}
                    {/* ZMIANA 2: Zmieniono 'text-center lg:text-left' na 'text-left' dla spójnego wyrównania. */}
                    <div className="text-left">
                        <motion.h2
                            style={{ opacity: headingOpacity, y: headingY }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter"
                        >
                            Ucz się poprzez rozmowę
                        </motion.h2>
                        <motion.p
                            style={{ opacity: paragraphOpacity, y: paragraphY }}
                            className="mt-6 text-lg text-gray-600 dark:text-gray-400"
                        >
                            Zadawaj pytania, proś o wyjaśnienia i testuj swoją wiedzę w interaktywnym czacie. Nasza AI jest Twoim osobistym korepetytorem, dostępnym 24/7.
                        </motion.p>
                        <motion.ul
                            style={{ opacity: listOpacity, y: listY }}
                            className="mt-8 space-y-5 inline-block"
                        >
                            <li className="flex items-center">
                                <span className="flex-shrink-0 h-7 w-7 flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/10 rounded-full mr-4">
                                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.425v-2.287a6.75 6.75 0 0 1 .616-3.414.625.625 0 0 0 .625-.625v-1.5a6.75 6.75 0 0 1 3.75-5.864m-1.125 6.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" />
                                    </svg>
                                </span>
                                <span className="text-gray-700 dark:text-gray-300 text-base">Tłumaczenie skomplikowanych zagadnień.</span>
                            </li>
                            <li className="flex items-center">
                                <span className="flex-shrink-0 h-7 w-7 flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/10 rounded-full mr-4">
                                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                                    </svg>
                                </span>
                                <span className="text-gray-700 dark:text-gray-300 text-base">Proponowanie pytań do sprawdzenia wiedzy.</span>
                            </li>
                        </motion.ul>
                    </div>
                    {/* 
                      ZMIANA 3: Zmieniono padding z 'p-6' na responsywny 'p-4 sm:p-6',
                      aby dać więcej przestrzeni na telefonach.
                    */}
                    <motion.div
                        style={{ y: chatContainerY, opacity: chatContainerOpacity }}
                        className="p-4 sm:p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl shadow-xl"
                    >
                        <div className="flex flex-col space-y-4">
                            <DemoMessage style={bubble1Style} text="Cześć! Wyjaśnij mi, czym jest twierdzenie Pitagorasa." isUser />
                            <DemoMessage style={bubble2Style} text="Jasne! Twierdzenie Pitagorasa mówi, że w trójkącie prostokątnym..." />
                            <DemoMessage style={bubble3Style} text="Super, dziękuję! A możesz podać jakiś przykład?" isUser />
                            <DemoMessage style={bubble4Style} text="Oczywiście. Jeśli przyprostokątne mają długość 3 i 4, to..." />
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}