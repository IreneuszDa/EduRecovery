'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import React, { useRef } from 'react';

interface HeroProps { }

export default function Hero({ }: HeroProps) {
    const targetRef = useRef<React.ElementRef<'section'>>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        // Uwaga: offset może nie działać zgodnie z oczekiwaniami przy h-screen
        offset: ["start start", "end start"],
    });

    const textExitY = useTransform(scrollYProgress, [0, 0.25], ["0%", "-150%"]);
    const textExitOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    const imageExitY = useTransform(scrollYProgress, [0, 0.25], ["0%", "-50%"]);
    const imageExitScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.8]);
    const imageExitOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

    return (
        <section
            ref={targetRef}
            // OSTATECZNA ZMIANA: Wysokość zrównana z wysokością ekranu.
            // Eliminuje to jakąkolwiek przestrzeń do przewijania w tej sekcji.
            className="relative max-w-7xl mx-auto px-4 sm:px-6 h-screen"
        >
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Lewa strona: Treść tekstowa */}
                    <motion.div
                        className="text-center lg:text-left"
                        style={{ y: textExitY, opacity: textExitOpacity }}
                    >
                        <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Nauka, która Cię <span className="text-blue-600 dark:text-blue-500">rozumie.</span>
                        </h1>
                        <p className="mt-4 text-lg font-bold text-gray-800 dark:text-stone-200">
                            Osobisty korepetytor online, daje uczniom zrozumienie i pewność siebie, a nauczycielom skuteczne narzędzia do pracy.
                        </p>
                    </motion.div>

                    {/* Prawa strona: Obraz */}
                    <motion.div
                        style={{
                            y: imageExitY,
                            scale: imageExitScale,
                            opacity: imageExitOpacity,
                        }}
                        className="w-full max-w-md mx-auto lg:max-w-none"
                    >
                        <Image
                            src="/image.png"
                            alt="Student uczący się z pomocą AI"
                            width={600}
                            height={600}
                            className="w-full h-auto"
                            priority
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}