// @/app/dashboard/explore/page.tsx
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { AcademicCapIcon, PlayIcon } from '@heroicons/react/24/solid';
import { Search, Compass, Layers, FileText, ArrowUpDown } from 'lucide-react';
import { clsx } from 'clsx';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface UserInfo { _id: string; name: string; }
interface PublicExam { _id: string; title: string; subject: string; createdAt: string; user: UserInfo; }
interface PublicSet { _id: string; title: string; cards: any[]; category?: string; createdAt: string; user: UserInfo; }
type ExploreItem = (PublicExam & { type: 'exam' }) | (PublicSet & { type: 'set' });
type FilterType = 'all' | 'exam' | 'set';
type SortByType = 'newest' | 'oldest';

// ============================================================================
// UI COMPONENTS
// ============================================================================

function PublicItemCard({ item }: { item: ExploreItem }) {
    const isExam = item.type === 'exam';

    const cardData = {
        icon: isExam ? <FileText className="h-5 w-5 text-indigo-500" /> : <Layers className="h-5 w-5 text-sky-500" />,
        tag: isExam ? 'Egzamin' : 'Fiszki',
        tagBgColor: isExam ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
        title: item.title,
        subtitle: isExam ? item.subject : item.category,
        author: item.user?.name,
        metadata: isExam ? null : `${item.cards?.length || 0} kart`,
        buttonText: isExam ? 'Rozwiąż Egzamin' : 'Ucz się Fiszki',
        buttonIcon: isExam ? <AcademicCapIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />,
        href: isExam ? `/dashboard/exams/learn/${item._id}` : `/dashboard/fiszki/learn/${item._id}`,
    };

    return (
        <div className="bg-white border border-slate-200/70 rounded-2xl flex flex-col group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-500">
            <div className="px-5 pt-5">
                <div className="flex items-center gap-2">
                    {cardData.icon}
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${cardData.tagBgColor}`}>
                        {cardData.tag}
                    </span>
                </div>
            </div>
            <div className="p-5 flex-grow flex flex-col">
                <p className="font-semibold text-sm text-slate-500 dark:text-slate-400 mb-1">{cardData.subtitle || 'Ogólne'}</p>
                <h3 className="font-bold text-lg text-slate-800 leading-tight break-words flex-grow dark:text-slate-100" title={cardData.title}>
                    {cardData.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    {cardData.author && (
                        <div className="flex items-center gap-1.5" title={`Autor: ${cardData.author}`}>
                            <UserCircleIcon className="h-4 w-4" />
                            <span className="truncate">{cardData.author}</span>
                        </div>
                    )}
                    {cardData.metadata && <span className="font-medium text-slate-600 dark:text-slate-300">{cardData.metadata}</span>}
                </div>
            </div>
            <div className="p-5 pt-0">
                <Link
                    href={cardData.href}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-800/10 hover:bg-slate-900 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-blue-600/20"
                >
                    {cardData.buttonIcon}
                    <span>{cardData.buttonText}</span>
                </Link>
            </div>
        </div>
    );
}

function FilterControls({ filter, setFilter, sort, setSort }: {
    filter: FilterType;
    setFilter: (type: FilterType) => void;
    sort: SortByType;
    setSort: (type: SortByType) => void;
}) {
    const filterOptions: { label: string; value: FilterType }[] = [
        { label: 'Wszystko', value: 'all' },
        { label: 'Egzaminy', value: 'exam' },
        { label: 'Fiszki', value: 'set' },
    ];

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="p-1.5 bg-slate-100 rounded-xl flex items-center space-x-1 dark:bg-slate-800 w-full sm:w-auto">
                {filterOptions.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => setFilter(opt.value)}
                        className={clsx(
                            "w-full px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-slate-800",
                            filter === opt.value ? 'bg-white shadow-md text-blue-600 dark:bg-slate-700 dark:text-white' : 'text-slate-600 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-700/50'
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <div className="relative hidden sm:block">
                <select
                    id="sort-by"
                    value={sort}
                    onChange={e => setSort(e.target.value as SortByType)}
                    className="w-48 appearance-none pl-4 pr-10 py-2.5 bg-white text-slate-800 text-sm font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
                    aria-label="Sortuj według"
                >
                    <option value="newest">Najnowsze</option>
                    <option value="oldest">Najstarsze</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    const SkeletonCard = () => (
        <div className="bg-white border border-slate-200/70 rounded-2xl p-5 space-y-4 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 animate-pulse dark:bg-slate-700"></div>
                <div className="w-24 h-5 rounded bg-slate-200 animate-pulse dark:bg-slate-700"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 w-1/3 rounded bg-slate-200 animate-pulse dark:bg-slate-700"></div>
                <div className="h-5 w-3/4 rounded bg-slate-200 animate-pulse dark:bg-slate-700"></div>
            </div>
            <div className="h-10 w-full rounded-lg bg-slate-200 animate-pulse mt-4 dark:bg-slate-700"></div>
        </div>
    );
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
    );
}

function EmptyState({ searchActive, filterActive }: { searchActive: boolean, filterActive: boolean }) {
    const message = searchActive ? 'Brak wyników dla Twojego wyszukiwania.' :
        filterActive ? 'Brak materiałów w tej kategorii.' :
            'Brak publicznych materiałów do odkrycia.';
    const suggestion = searchActive ? 'Spróbuj użyć innych słów kluczowych.' :
        filterActive ? 'Wybierz inną kategorię lub sprawdź później.' :
            'Bądź pierwszy, który coś udostępni!';
    return (
        <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 py-20 dark:text-slate-400">
            <Compass className="w-20 h-20 mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">{message}</h3>
            <p className="max-w-xs mt-2">{suggestion}</p>
        </div>
    );
}

function SortToast({ message, isVisible }: { message: string; isVisible: boolean }) {
    return (
        <div
            className={clsx(
                "fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200/80 rounded-xl shadow-lg transition-all duration-300 ease-in-out pointer-events-none",
                "dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600",
                isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-4 invisible'
            )}
            aria-live="polite"
        >
            <ArrowUpDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>{message}</span>
        </div>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function ExplorePage() {
    const [publicExams, setPublicExams] = useState<PublicExam[]>([]);
    const [publicSets, setPublicSets] = useState<PublicSet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [sortBy, setSortBy] = useState<SortByType>('newest');

    const [isHeaderSticky, setIsHeaderSticky] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showSortToast, setShowSortToast] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
    const STICKY_THRESHOLD = 10;

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;
        const handleScroll = () => setIsHeaderSticky(scrollContainer.scrollTop > STICKY_THRESHOLD);
        scrollContainer.addEventListener('scroll', handleScroll);
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchAllPublicData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [examsRes, setsRes] = await Promise.all([
                    fetch('/api/exams/public'),
                    fetch('/api/flashcard-sets/public')
                ]);
                if (!examsRes.ok || !setsRes.ok) throw new Error('Nie udało się pobrać publicznych materiałów.');
                const [examsData, setsData] = await Promise.all([examsRes.json(), setsRes.json()]);
                setPublicExams(examsData.exams || []);
                setPublicSets(setsData.sets || []);
            } catch (err: any) { setError(err.message); }
            finally { setIsLoading(false); }
        };
        fetchAllPublicData();
    }, []);

    useEffect(() => {
        return () => {
            if (toastTimerRef.current) {
                clearTimeout(toastTimerRef.current);
            }
        };
    }, []);

    const processedItems = useMemo(() => {
        const typedExams: ExploreItem[] = publicExams.map(exam => ({ ...exam, type: 'exam' }));
        const typedSets: ExploreItem[] = publicSets.map(set => ({ ...set, type: 'set' }));
        let allItems: ExploreItem[] = [...typedExams, ...typedSets];

        if (filterType !== 'all') {
            allItems = allItems.filter(item => item.type === filterType);
        }

        allItems.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
        });

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            allItems = allItems.filter(item => {
                const titleMatch = item.title.toLowerCase().includes(lowerCaseSearchTerm);
                const userMatch = item.user?.name?.toLowerCase().includes(lowerCaseSearchTerm);
                const contentMatch = item.type === 'exam'
                    ? item.subject.toLowerCase().includes(lowerCaseSearchTerm)
                    : item.category?.toLowerCase().includes(lowerCaseSearchTerm);
                return titleMatch || userMatch || contentMatch;
            });
        }

        return allItems;
    }, [publicExams, publicSets, searchTerm, filterType, sortBy]);

    const handleSortChange = () => {
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }
        const newSortOrder = sortBy === 'newest' ? 'oldest' : 'newest';
        setSortBy(newSortOrder);
        const newMessage = newSortOrder === 'newest'
            ? 'Wyświetlanie najnowszych'
            : 'Wyświetlanie najstarszych';
        setToastMessage(newMessage);
        setShowSortToast(true);
        toastTimerRef.current = setTimeout(() => {
            setShowSortToast(false);
        }, 2500);
    };

    if (error) {
        return <section className="flex-1 p-8 flex items-center justify-center text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">{error}</section>;
    }

    return (
        <section className="p-6 md:p-8 h-full flex flex-col relative bg-slate-50 dark:bg-slate-900">
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <div
                        className={clsx(
                            'text-center transition-all duration-500 ease-in-out overflow-hidden',
                            isHeaderSticky
                                ? 'max-h-0 opacity-0 invisible'
                                : 'max-h-96 opacity-100 visible mb-8'
                        )}
                    >
                        <Compass className="mx-auto h-12 w-12 text-blue-600" />
                        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                            Odkrywaj Materiały
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
                            Przeglądaj publiczne fiszki i egzaminy udostępnione przez całą społeczność Uczmy.pl.
                        </p>
                    </div>

                    <div
                        className={clsx(
                            'sticky top-0 z-20 space-y-4 transition-all duration-300 ease-in-out',
                            isHeaderSticky
                                ? 'bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm pt-4 pb-4 shadow-sm border-b border-slate-200 dark:border-slate-800'
                                : 'mb-6 p-4 bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-2xl'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative flex-grow">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                <input
                                    id="search-public-items" type="text" placeholder="Szukaj po tytule, temacie lub autorze..."
                                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-500 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-400 dark:border-slate-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleSortChange}
                                className="sm:hidden flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
                                aria-label={sortBy === 'newest' ? 'Sortuj od najstarszych' : 'Sortuj od najnowszych'}
                            >
                                <ArrowUpDown className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                            </button>
                        </div>

                        <FilterControls filter={filterType} setFilter={setFilterType} sort={sortBy} setSort={setSortBy} />
                    </div>

                    <div
                        className={clsx(
                            'transition-all duration-300 ease-in-out',
                            isHeaderSticky ? 'h-[148px] sm:h-36' : 'h-0'
                        )}
                    />

                    <div>
                        {isLoading ? (
                            <LoadingSkeleton />
                        ) : processedItems.length === 0 ? (
                            <EmptyState searchActive={searchTerm.length > 0} filterActive={filterType !== 'all'} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {processedItems.map(item => (
                                    <PublicItemCard key={`${item.type}-${item._id}`} item={item} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <SortToast message={toastMessage} isVisible={showSortToast} />
        </section>
    );
}