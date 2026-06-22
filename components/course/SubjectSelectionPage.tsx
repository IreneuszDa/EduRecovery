'use client';

import React, { FC, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpenCheck, Languages, Beaker, Sigma, Globe, Code,
    Dna, Laptop, Atom, History, Scale, Brain,
    Paintbrush, Palette, Music, LucideProps, Search,
    TrendingUp, Clock, Star, Filter
} from 'lucide-react';

// --- TYPES AND DATA ---
export type Subject = {
    name: string;
    icon: FC<LucideProps>;
    key: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: string;
    popularity?: number;
    description?: string;
    prerequisites?: string[];
    trending?: boolean;
};

const subjectGroups: { title: string, subjects: Subject[] }[] = [
    {
        title: "Przedmioty Główne",
        subjects: [
            { 
                name: "Polski", 
                icon: BookOpenCheck, 
                key: 'pl_core',
                difficulty: 'intermediate',
                estimatedTime: '6-8 tygodni',
                popularity: 95,
                description: "Język polski, literatura i komunikacja",
                trending: true
            },
            { 
                name: "Matematyka", 
                icon: Sigma, 
                key: 'mat_core',
                difficulty: 'advanced',
                estimatedTime: '8-12 tygodni',
                popularity: 92,
                description: "Algebra, geometria i analiza matematyczna",
                trending: true
            },
            { 
                name: "Angielski", 
                icon: Languages, 
                key: 'en_core',
                difficulty: 'intermediate',
                estimatedTime: '4-6 tygodni',
                popularity: 98,
                description: "Język angielski i komunikacja międzynarodowa"
            },
        ]
    },
    {
        title: "Nauki Ścisłe",
        subjects: [
            { 
                name: "Biologia", 
                icon: Dna, 
                key: 'bio_sci',
                difficulty: 'intermediate',
                estimatedTime: '6-8 tygodni',
                popularity: 78,
                description: "Życie, organizmy i procesy biologiczne"
            },
            { 
                name: "Chemia", 
                icon: Beaker, 
                key: 'chem_sci',
                difficulty: 'advanced',
                estimatedTime: '8-10 tygodni',
                popularity: 72,
                description: "Reakcje chemiczne i właściwości materii"
            },
            { 
                name: "Fizyka", 
                icon: Atom, 
                key: 'phys_sci',
                difficulty: 'advanced',
                estimatedTime: '8-12 tygodni',
                popularity: 69,
                description: "Siły, energia i prawa natury"
            },
            { 
                name: "Geografia", 
                icon: Globe, 
                key: 'geo_sci',
                difficulty: 'beginner',
                estimatedTime: '4-6 tygodni',
                popularity: 65,
                description: "Ziemia, klimat i procesy geologiczne"
            },
        ]
    },
    {
        title: "Nauki Humanistyczne",
        subjects: [
            { 
                name: "Historia", 
                icon: History, 
                key: 'hist_hum',
                difficulty: 'intermediate',
                estimatedTime: '6-8 tygodni',
                popularity: 74,
                description: "Wydarzenia historyczne i ich wpływ"
            },
            { 
                name: "WOS", 
                icon: Scale, 
                key: 'wos_hum',
                difficulty: 'beginner',
                estimatedTime: '4-6 tygodni',
                popularity: 68,
                description: "Wiedza o społeczeństwie i obywatelstwie"
            },
            { 
                name: "Filozofia", 
                icon: Brain, 
                key: 'filo_hum',
                difficulty: 'advanced',
                estimatedTime: '8-10 tygodni',
                popularity: 45,
                description: "Myślenie krytyczne i systemy filozoficzne"
            },
        ]
    },
    {
        title: "Technologia i Umiejętności",
        subjects: [
            { 
                name: "Informatyka", 
                icon: Laptop, 
                key: 'it_tech',
                difficulty: 'intermediate',
                estimatedTime: '6-10 tygodni',
                popularity: 87,
                description: "Systemy komputerowe i technologie IT",
                trending: true
            },
            { 
                name: "Programowanie", 
                icon: Code, 
                key: 'code_tech',
                difficulty: 'advanced',
                estimatedTime: '12-16 tygodni',
                popularity: 89,
                description: "Tworzenie aplikacji i rozwiązań programistycznych",
                trending: true
            },
        ]
    },
    {
        title: "Sztuka i Muzyka",
        subjects: [
            { 
                name: "Sztuka", 
                icon: Paintbrush, 
                key: 'art_art',
                difficulty: 'beginner',
                estimatedTime: '4-6 tygodni',
                popularity: 56,
                description: "Twórczość artystyczna i ekspresja wizualna"
            },
            { 
                name: "Historia Sztuki", 
                icon: Palette, 
                key: 'hist_art',
                difficulty: 'intermediate',
                estimatedTime: '6-8 tygodni',
                popularity: 42,
                description: "Rozwój sztuki przez wieki"
            },
            { 
                name: "Muzyka", 
                icon: Music, 
                key: 'music_art',
                difficulty: 'beginner',
                estimatedTime: '4-8 tygodni',
                popularity: 51,
                description: "Teoria muzyki i praktyka wykonawcza"
            },
        ]
    },
];

// --- PROPS INTERFACE ---
interface SubjectSelectionPageProps {
    onSubjectSelect: (subject: Subject) => void;
}

// Filter types
type FilterType = 'all' | 'trending' | 'beginner' | 'popular';

// --- MAIN COMPONENT (OPTIMIZED) ---
export function SubjectSelectionPage({ onSubjectSelect }: SubjectSelectionPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    // Memoize all subjects to prevent re-computation
    const allSubjects = useMemo(() => 
        subjectGroups.flatMap(group => group.subjects), 
        []
    );

    // Memoized filter logic
    const filteredGroups = useMemo(() => {
        return subjectGroups.map(group => ({
            ...group,
            subjects: group.subjects.filter(subject => {
                const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    subject.description?.toLowerCase().includes(searchTerm.toLowerCase());
                
                const matchesFilter = 
                    activeFilter === 'all' ||
                    (activeFilter === 'trending' && subject.trending) ||
                    (activeFilter === 'beginner' && subject.difficulty === 'beginner') ||
                    (activeFilter === 'popular' && (subject.popularity || 0) >= 80);
                
                return matchesSearch && matchesFilter;
            })
        })).filter(group => group.subjects.length > 0);
    }, [searchTerm, activeFilter]);

    // Memoize trending subjects
    const trendingSubjects = useMemo(() => 
        allSubjects.filter(subject => subject.trending).slice(0, 3), 
        [allSubjects]
    );

    // Memoized handlers
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleFilterChange = useCallback((filter: FilterType) => {
        setActiveFilter(filter);
    }, []);

    // Filter options - memoized
    const filterOptions = useMemo(() => [
        { id: 'all', label: 'Wszystkie', icon: Filter },
        { id: 'trending', label: 'Popularne', icon: TrendingUp },
        { id: 'beginner', label: 'Dla początkujących', icon: Star },
        { id: 'popular', label: 'Najczęściej wybierane', icon: Clock },
    ], []);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto max-w-6xl px-4 py-8">

                {/* --- SIMPLIFIED HEADER --- */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Wybierz przedmiot
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Rozpocznij swoją spersonalizowaną ścieżkę nauki. Każdy przedmiot został dostosowany do Twojego poziomu.
                    </p>
                </div>

                {/* --- SEARCH AND FILTERS --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 space-y-4"
                >
                    {/* Search Bar */}
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Szukaj przedmiotu..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {filterOptions.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => handleFilterChange(filter.id as FilterType)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    activeFilter === filter.id
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                <filter.icon className="w-4 h-4" />
                                <span>{filter.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* --- TRENDING SUBJECTS SECTION --- */}
                {activeFilter === 'all' && !searchTerm && trendingSubjects.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-10"
                    >
                        <div className="flex items-center space-x-2 mb-6">
                            <TrendingUp className="w-6 h-6 text-orange-500" />
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                Trending teraz
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {trendingSubjects.map((subject) => (
                                <SubjectCard
                                    key={subject.key}
                                    subject={subject}
                                    onClick={() => onSubjectSelect(subject)}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* --- SUBJECT GROUPS --- */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-10"
                >
                    <AnimatePresence>
                        {filteredGroups.map((group, groupIndex) => (
                            <motion.div
                                key={group.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: groupIndex * 0.1 }}
                            >
                                <h2 className="text-lg font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 px-2">
                                    {group.title}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {group.subjects.map((subject, index) => (
                                        <motion.div
                                            key={subject.key}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <SubjectCard
                                                subject={subject}
                                                onClick={() => onSubjectSelect(subject)}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* No results message */}
                {filteredGroups.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <Search className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                            Nie znaleziono przedmiotów
                        </h3>
                        <p className="text-slate-500 dark:text-slate-500">
                            Spróbuj zmienić kryteria wyszukiwania lub filtry
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// --- ENHANCED SUBJECT CARD COMPONENT ---
interface SubjectCardProps {
    subject: Subject;
    onClick: () => void;
}

const SubjectCard = React.memo(function SubjectCard({ subject, onClick }: SubjectCardProps) {
    const IconComponent = subject.icon;
    
    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
            case 'beginner': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
            case 'intermediate': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
            case 'advanced': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
            default: return 'text-slate-600 bg-slate-50 dark:bg-slate-800/50';
        }
    };

    const getDifficultyText = (difficulty?: string) => {
        switch (difficulty) {
            case 'beginner': return 'Początkujący';
            case 'intermediate': return 'Średniozaawansowany';
            case 'advanced': return 'Zaawansowany';
            default: return 'Wszystkie poziomy';
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group cursor-pointer"
            onClick={onClick}
        >
            <div className="relative h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                
                {/* Trending Badge */}
                {subject.trending && (
                    <div className="absolute top-3 right-3">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full"
                        >
                            <TrendingUp className="w-3 h-3" />
                            <span>Trending</span>
                        </motion.div>
                    </div>
                )}

                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>

                {/* Subject Name */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {subject.name}
                </h3>

                {/* Description */}
                {subject.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        {subject.description}
                    </p>
                )}

                {/* Metadata Row */}
                <div className="space-y-2">
                    {/* Difficulty Badge */}
                    {subject.difficulty && (
                        <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg ${getDifficultyColor(subject.difficulty)}`}>
                            {getDifficultyText(subject.difficulty)}
                        </div>
                    )}

                    {/* Time and Popularity */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        {subject.estimatedTime && (
                            <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{subject.estimatedTime}</span>
                            </div>
                        )}
                        {subject.popularity && (
                            <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3" />
                                <span>{subject.popularity}%</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 rounded-2xl pointer-events-none" />
            </div>
        </motion.div>
    );
});