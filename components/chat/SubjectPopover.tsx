'use client';

import React, { useState, useMemo, FC } from 'react';
import {
    useFloating, autoUpdate, offset, shift, size, useClick, useDismiss, useInteractions, FloatingPortal
} from '@floating-ui/react';
import {
    BookOpenCheck, Languages, Beaker, Sigma, Globe, Code,
    Dna, Laptop, X, Search, Atom, History, Scale, Brain,
    Paintbrush, Palette, Music, LucideProps, ChevronDown
} from 'lucide-react';

// --- TYPY I DANE ---
export type Subject = {
    name: string;
    icon: FC<LucideProps>;
    key: string;
};

const subjectGroups: { title: string, subjects: Subject[] }[] = [
    {
        title: "Przedmioty Główne",
        subjects: [
            { name: "Polski", icon: BookOpenCheck, key: 'pl_core' },
            { name: "Matematyka", icon: Sigma, key: 'mat_core' },
            { name: "Angielski", icon: Languages, key: 'en_core' },
        ]
    },
    {
        title: "Nauki Ścisłe",
        subjects: [
            { name: "Biologia", icon: Dna, key: 'bio_sci' },
            { name: "Chemia", icon: Beaker, key: 'chem_sci' },
            { name: "Fizyka", icon: Atom, key: 'phys_sci' },
            { name: "Geografia", icon: Globe, key: 'geo_sci' },
        ]
    },
    {
        title: "Nauki Humanistyczne",
        subjects: [
            { name: "Historia", icon: History, key: 'hist_hum' },
            { name: "WOS", icon: Scale, key: 'wos_hum' },
            { name: "Filozofia", icon: Brain, key: 'filo_hum' },
        ]
    },
    {
        title: "Technologia i Umiejętności",
        subjects: [
            { name: "Informatyka", icon: Laptop, key: 'it_tech' },
            { name: "Programowanie", icon: Code, key: 'code_tech' },
        ]
    },
    {
        title: "Sztuka i Muzyka",
        subjects: [
            { name: "Sztuka", icon: Paintbrush, key: 'art_art' },
            { name: "Historia Sztuki", icon: Palette, key: 'hist_art' },
            { name: "Muzyka", icon: Music, key: 'music_art' },
        ]
    },
];

// --- INTERFEJS PROPSÓW ---
interface SubjectPopoverProps {
    onSubjectSelect: (subject: Subject) => void;
    onClearSubject: () => void;
    activeSubject: Subject | null;
}

// --- GŁÓWNY KOMPONENT ---
export function SubjectPopover({ onSubjectSelect, onClearSubject, activeSubject }: SubjectPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        // ZMIANA: Ustawienie domyślnego umiejscowienia na górze
        placement: 'top-end',
        middleware: [
            offset(8),
            // ZMIANA: Usunięto 'flip()', aby zapobiec wyświetlaniu się popovera pod przyciskiem
            shift({ padding: 24 }),
            size({
                apply({ availableHeight, elements }) {
                    const desiredMaxHeight = 256;
                    const newMaxHeight = Math.min(availableHeight, desiredMaxHeight);
                    Object.assign(elements.floating.style, {
                        maxHeight: `${newMaxHeight}px`,
                    });
                },
                padding: 24,
            }),
        ],
        whileElementsMounted: autoUpdate,
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        useClick(context),
        useDismiss(context),
    ]);

    const filteredGroups = useMemo(() => {
        if (!searchTerm) return subjectGroups;
        return subjectGroups
            .map(group => ({
                ...group,
                subjects: group.subjects.filter(subject =>
                    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
                ),
            }))
            .filter(group => group.subjects.length > 0);
    }, [searchTerm]);

    const handleSelect = (subject: Subject) => {
        onSubjectSelect(subject);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClearSubject();
    };

    return (
        <>
            <button
                ref={refs.setReference}
                {...getReferenceProps()}
                type="button"
                className="flex h-8 flex-shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 font-medium transition-colors hover:bg-slate-400/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:hover:bg-slate-500/10"
            >
                {activeSubject ? (
                    <>
                        <activeSubject.icon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-slate-700 dark:text-slate-200">{activeSubject.name}</span>
                        <div onClick={handleClear} className="flex items-center justify-center h-5 w-5 rounded-full hover:bg-slate-500/20" aria-label="Wyczyść przedmiot">
                            <X className="h-3 w-3 text-slate-500" />
                        </div>
                    </>
                ) : (
                    <>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Przedmiot</span>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </>
                )}
            </button>

            <FloatingPortal>
                {isOpen && (
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                        className="z-50 flex w-[360px] max-w-[95vw] flex-col rounded-2xl border border-slate-900/10 bg-white/80 font-sans text-slate-800 shadow-2xl shadow-black/10 backdrop-blur-lg dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-200"
                    >
                        <div className="flex-shrink-0 p-2">
                             <div className="group relative flex items-center">
                                <Search className="absolute left-4 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-blue-500 dark:text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Szukaj przedmiotu..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                    className="w-full rounded-full border border-transparent bg-black/5 py-2 pl-10 pr-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:bg-white/5 dark:placeholder-slate-400"
                                />
                             </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-slate-400/70 scrollbar-track-transparent hover:scrollbar-thumb-slate-500 dark:scrollbar-thumb-slate-600 dark:hover:scrollbar-thumb-slate-500">
                           {filteredGroups.length > 0 ? (
                            filteredGroups.map((group) => (
                                <div key={group.title} className="pt-2">
                                    <h4 className="px-3 pb-1.5 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{group.title}</h4>
                                    {group.subjects.map((subject) => (
                                        <button
                                            key={subject.key}
                                            onClick={() => handleSelect(subject)}
                                            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors duration-150 ${
                                                activeSubject?.key === subject.key
                                                ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300'
                                                : 'text-slate-600 hover:bg-slate-500/10 dark:text-slate-300 dark:hover:bg-slate-400/10'
                                            }`}
                                        >
                                            <subject.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${
                                                activeSubject?.key === subject.key
                                                ? 'text-blue-500'
                                                : 'text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400'
                                            }`} />
                                            <span>{subject.name}</span>
                                        </button>
                                    ))}
                                </div>
                            ))
                            ) : (
                                <div className="py-12 text-center text-sm text-slate-500">
                                    <p className="font-semibold">Brak wyników</p>
                                    <p className="text-xs">Nie znaleziono przedmiotów dla "{searchTerm}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </FloatingPortal>
        </>
    );
}