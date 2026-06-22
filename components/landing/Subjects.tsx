'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const subjects = [
    { name: "Matematyka", icon: "/icons/math.png" },
    { name: "Język Polski", icon: "/icons/polish.png" },
    { name: "Chemia", icon: "/icons/chemistry.png" },
    { name: "Geografia", icon: "/icons/geography.png" },
    { name: "Informatyka", icon: "/icons/computer.png" },
    { name: "Biologia", icon: "/icons/biology.png" },
    { name: "Historia", icon: "/icons/history.png" },
    { name: "Fizyka", icon: "/icons/physics.png" },
    { name: "Język Angielski", icon: "/icons/english.png" },
    { name: "Język Niemiecki", icon: "/icons/german.png" },
];

const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function Subjects() {
    return (
        <motion.section
            id="subjects"
            className="py-20 sm:py-32"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}

        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Wszystkie przedmioty w jednym miejscu
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                        Od szkoły podstawowej po maturę. Pokrywamy cały zakres materiału, którego potrzebujesz do sukcesu.
                    </p>
                </div>
            </div>

            {/* The overflow-hidden container is crucial */}
            <div className="mt-16 w-full overflow-hidden">
                {/* Apply the CSS animation class here */}
                <div className="flex w-max animate-marquee">
                    {/* We render the array twice for a seamless loop */}
                    {[...subjects, ...subjects].map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center justify-center w-[150px] sm:w-[180px] flex-shrink-0"
                        >
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                                <Image
                                    src={item.icon}
                                    alt={item.name}
                                    width={60}
                                    height={60}
                                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                                />
                            </div>
                            <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">{item.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}