"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, ArrowLeft, Sparkles, Pencil, Check, X } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

// --- INTERFACES ---
interface ICard {
    _id: string;
    term: string;
    definition: string;
}

interface IFlashcardSet {
    _id: string;
    title: string;
    cards: ICard[];
    isPublic: boolean;
}

type ActiveTab = "manual" | "ai";

export default function SetManagementPage() {
    const router = useRouter();
    const params = useParams();
    const setId = params.id as string;

    // --- STATE MANAGEMENT ---
    const [set, setSet] = useState<IFlashcardSet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>("manual");

    // State for manual card addition
    const [newTerm, setNewTerm] = useState("");
    const [newDefinition, setNewDefinition] = useState("");
    const [isAddingCard, setIsAddingCard] = useState(false);

    // State for AI card generation
    const [aiTopic, setAiTopic] = useState("");
    const [aiNumberOfCards, setAiNumberOfCards] = useState(10);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    // State for title editing
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);

    // --- DATA FETCHING & EVENT HANDLERS ---
    useEffect(() => {
        if (!setId) return;
        const fetchSet = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/flashcard-sets/${setId}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Nie udało się pobrać zestawu.");
                }
                const data: IFlashcardSet = await res.json();
                setSet(data);
                setNewTitle(data.title);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSet();
    }, [setId]);

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTerm.trim() || !newDefinition.trim() || isAddingCard) return;
        setIsAddingCard(true);
        try {
            const res = await fetch(`/api/flashcard-sets/${setId}/cards`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ term: newTerm, definition: newDefinition }),
            });
            if (!res.ok) { throw new Error((await res.json()).message || "Błąd"); }
            const newCard = await res.json();
            setSet(prevSet => prevSet ? { ...prevSet, cards: [...prevSet.cards, newCard] } : null);
            setNewTerm(""); setNewDefinition("");
        } catch (err: any) {
            alert(`Błąd: ${err.message}`);
        } finally { setIsAddingCard(false); }
    };

    const handleAiGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiTopic.trim() || isGenerating) return;
        setIsGenerating(true); setAiError(null);
        try {
            const res = await fetch(`/api/flashcard-sets/${setId}/generate-cards`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: aiTopic, numberOfCards: aiNumberOfCards }),
            });
            if (!res.ok) { throw new Error((await res.json()).message || "Błąd"); }
            const updatedSet = await res.json();
            setSet(updatedSet); setAiTopic("");
        } catch (err: any) {
            setAiError(err.message);
        } finally { setIsGenerating(false); }
    };

    const handleUpdateTitle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!set || newTitle.trim() === "" || newTitle.trim() === set.title || isUpdatingTitle) {
            setIsEditingTitle(false);
            setNewTitle(set?.title || "");
            return;
        }

        setIsUpdatingTitle(true);
        try {
            const res = await fetch(`/api/flashcard-sets/${setId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle.trim() }),
            });

            if (!res.ok) { throw new Error((await res.json()).message || "Nie udało się zaktualizować tytułu."); }
            const updatedSetData: IFlashcardSet = await res.json();
            setSet(updatedSetData);
            setNewTitle(updatedSetData.title);
            setIsEditingTitle(false);
        } catch (err: any) {
            alert(`Błąd: ${err.message}`);
            if (set) { setNewTitle(set.title); }
        } finally {
            setIsUpdatingTitle(false);
        }
    };


    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>;
    }
    if (error) {
        return <div className="flex-1 flex items-center justify-center text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 p-6 rounded-2xl"><p>{error}</p></div>;
    }
    if (!set) {
        return <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">Nie znaleziono zestawu fiszek.</div>;
    }

    return (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col border border-slate-200/70 dark:border-slate-700 sticky top-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                        <Link href="/dashboard/fiszki" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mb-2 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Powrót do zestawów
                        </Link>
                        {!isEditingTitle ? (
                            <div className="flex items-center gap-2 group">
                                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 break-words">{set.title}</h1>
                                <button
                                    onClick={() => setIsEditingTitle(true)}
                                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-colors"
                                    title="Edytuj tytuł"
                                >
                                    <Pencil className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateTitle} className="flex items-center gap-2 w-full animate-in fade-in-0 duration-200">
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="flex-1 text-3xl font-bold text-slate-800 dark:text-slate-100 bg-transparent border-b-2 border-blue-500 focus:outline-none py-1 -my-1"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                            setIsEditingTitle(false);
                                            setNewTitle(set.title);
                                        }
                                    }}
                                />
                                <button type="submit" disabled={isUpdatingTitle} className="p-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 rounded-full disabled:opacity-50" title="Zapisz">
                                    {isUpdatingTitle ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                </button>
                                <button type="button" onClick={() => { setIsEditingTitle(false); setNewTitle(set.title); }} disabled={isUpdatingTitle} className="p-2 text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full" title="Anuluj">
                                    <X className="w-5 h-5" />
                                </button>
                            </form>
                        )}
                    </div>
                    <Link href={`/dashboard/fiszki/learn/${set._id}`} className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                        Zacznij naukę
                    </Link>
                </div>
                <div>
                    <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            <button onClick={() => setActiveTab("manual")} className={clsx("flex items-center gap-2 whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors", activeTab === 'manual' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600')}>
                                <Plus className="w-5 h-5" />
                                Dodaj Ręcznie
                            </button>
                            <button onClick={() => setActiveTab("ai")} className={clsx("flex items-center gap-2 whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors", activeTab === 'ai' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600')}>
                                <Sparkles className="w-5 h-5" />
                                Generuj z AI
                            </button>
                        </nav>
                    </div>
                    <div>
                        {activeTab === 'manual' && (
                            <div className="animate-in fade-in-0 duration-300">
                                <form onSubmit={handleAddCard} className="space-y-4">
                                    <input type="text" value={newTerm} onChange={(e) => setNewTerm(e.target.value)} placeholder="Termin (awers)" className="w-full px-4 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                    <textarea value={newDefinition} onChange={(e) => setNewDefinition(e.target.value)} placeholder="Definicja (rewers)" rows={4} className="w-full px-4 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                    <button type="submit" disabled={isAddingCard} className="w-full flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-semibold px-4 py-2.5 rounded-lg hover:bg-slate-900 dark:hover:bg-slate-300 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-500">
                                        {isAddingCard ? <Loader2 className="w-5 h-5 animate-spin" /> : "Dodaj fiszkę"}
                                    </button>
                                </form>
                            </div>
                        )}
                        {activeTab === 'ai' && (
                            <div className="animate-in fade-in-0 duration-300">
                                <form onSubmit={handleAiGenerate} className="space-y-4">
                                    <input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="np. 'II Wojna Światowa - kluczowe daty'" className="w-full px-4 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                    <div>
                                        <label htmlFor="card-count" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Liczba fiszek:</label>
                                        <input id="card-count" type="number" value={aiNumberOfCards} onChange={(e) => setAiNumberOfCards(Number(e.target.value))} min="1" max="20" className="w-full px-4 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    {aiError && <p className="text-sm text-red-600 dark:text-red-500 text-center">{aiError}</p>}
                                    <button type="submit" disabled={isGenerating} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed">
                                        {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> Generowanie...</> : "Generuj z AI"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col border border-slate-200/70 dark:border-slate-700 max-h-[calc(100vh-3rem)]">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 text-lg">
                    Karty w zestawie ({set.cards.length})
                </h2>
                <div className="flex-1 overflow-y-auto -mr-4 pr-4">
                    {set.cards.length === 0 ? (
                        <div className="text-center text-slate-500 dark:text-slate-400 py-10 bg-slate-50 dark:bg-slate-900/50 rounded-lg h-full flex items-center justify-center">
                            <p>Ten zestaw jest pusty. Dodaj swoją pierwszą fiszkę!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {[...set.cards].reverse().map((card, index) => (
                                <div key={card._id} className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 transition-all hover:shadow-sm hover:border-slate-300 dark:hover:border-slate-600">
                                    <span className="font-semibold text-slate-500 dark:text-slate-400 text-sm w-8 text-center">{set.cards.length - index}.</span>
                                    <p className="text-slate-900 dark:text-slate-100 font-medium break-words">{card.term}</p>
                                    <p className="text-slate-700 dark:text-slate-300 break-words">{card.definition}</p>
                                    <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors" title="Usuń fiszkę (funkcja do zaimplementowania)">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}