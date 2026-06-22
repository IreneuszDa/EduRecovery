// Mock lesson data for development purposes
// Will be replaced with real data from API in production

// Learning objective interface
interface LearningObjective {
    id: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Resource link interface
interface Resource {
    title: string;
    type: 'article' | 'video' | 'book' | 'website' | 'tool';
    url: string;
    description: string;
}

// Interactive element data
interface InteractiveData {
    type: 'drag-drop' | 'fill-blank' | 'code-execution' | 'multiple-choice' | 'prompt-graph';
    question?: string;
    options?: Array<{ id: string; text: string }>;
    answer?: string | string[];
    feedback?: {
        correct: string;
        incorrect: string;
    };
    graphPrompt?: string; // For prompt-graph type - the description of the graph to render
    initialInputs?: Record<string, string>; // Initial values for any inputs in interactive components
}

// Media content with accessibility features
interface MediaMetadata {
    source: string;
    format: string;
    duration?: number;
    transcription?: string; // For accessibility
    alternativeText?: string;
}

// Enhanced content section interface
interface ContentSection {
    id: string; // Unique identifier for each section
    type: 'text' | 'image' | 'video' | 'code' | 'quote' | 'list' | 'interactive' | 'exercise' | 'table' | 'diagram';
    content: string | string[] | Record<string, any>;
    caption?: string;
    media?: MediaMetadata;
    interactive?: InteractiveData;
    importance: 'core' | 'supplementary' | 'advanced'; // Indicates the importance of this section
    tags?: string[]; // Tags for categorizing content
}

// Assessment interface for quizzes and other evaluations
interface Assessment {
    type: 'multiple-choice' | 'true-false' | 'fill-in-blank' | 'flashcards' | 'coding-challenge';
    instructions: string;
    timeLimit?: number; // in seconds
    passingScore?: number; // percentage required to pass
    data: any; // Specific to assessment type
}

// Enhanced lesson detail structure
interface LessonDetail {
    id: number;
    type: 'lesson' | 'exam' | 'flashcards';
    title: string;
    shortDescription: string;
    estimatedDuration: number; // in minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';

    // Core content structure
    learningObjectives: LearningObjective[];
    contentSections: ContentSection[];

    // Assessment and activities
    assessments?: Assessment[];
    activityType?: 'quiz' | 'flashcards' | 'practice' | 'project';
    activityData?: any;

    // Additional resources and metadata
    resources?: Resource[];
    prerequisites?: number[]; // IDs of prerequisite lessons
    nextLessons?: number[]; // Suggested next lessons

    // Metadata
    author?: string;
    lastUpdated?: string;
    tags?: string[];
}

// Sample mock lesson details by lesson ID
export const mockLessonDetails: Record<number, LessonDetail> = {
    1: {
        id: 1,
        type: 'lesson',
        title: 'Podstawy programowania',
        shortDescription: 'W tej lekcji nauczysz się podstawowych zasad składni języka programowania.',
        estimatedDuration: 25, // 25 minutes
        difficulty: 'beginner',

        // Learning objectives
        learningObjectives: [
            {
                id: 'lo-1-1',
                description: 'Zrozumieć pojęcie zmiennej i jej zastosowanie w programowaniu',
                difficulty: 'beginner'
            },
            {
                id: 'lo-1-2',
                description: 'Rozpoznawać i rozumieć podstawowe struktury kontrolne, takie jak pętle',
                difficulty: 'beginner'
            },
            {
                id: 'lo-1-3',
                description: 'Napisać prosty kod wykorzystujący zmienne i pętle',
                difficulty: 'intermediate'
            }
        ],

        // Enhanced content sections
        contentSections: [
            {
                id: 'sec-1-1',
                type: 'interactive',
                content: 'Witaj w świecie programowania! Zanim zaczniemy, sprawdźmy Twoją znajomość tematu.',
                caption: 'Szybki quiz wprowadzający',
                importance: 'core',
                interactive: {
                    type: 'multiple-choice',
                    question: 'Co według Ciebie najlepiej opisuje programowanie?',
                    options: [
                        { id: 'a', text: 'Projektowanie stron internetowych i aplikacji' },
                        { id: 'b', text: 'Tworzenie instrukcji, które wykonuje komputer' },
                        { id: 'c', text: 'Naprawianie błędów w komputerze' },
                        { id: 'd', text: 'Wszystkie powyższe' }
                    ],
                    answer: 'b',
                    feedback: {
                        correct: 'Dokładnie tak! Programowanie to proces tworzenia instrukcji (kodu), które komputer może zrozumieć i wykonać.',
                        incorrect: 'Nie do końca. Programowanie to przede wszystkim tworzenie instrukcji (kodu), które komputer może zrozumieć i wykonać. Projektowanie interfejsów i debugowanie to ważne, ale oddzielne aspekty tworzenia oprogramowania.'
                    }
                },
                tags: ['wprowadzenie', 'interaktywne', 'quiz']
            },
            {
                id: 'sec-1-2',
                type: 'text',
                content: 'Programowanie to jak nauka nowego języka - z tą różnicą, że rozmawiasz z komputerem! 💻 Podobnie jak w każdym języku, programowanie ma swoją składnię, gramatykę i słownictwo. Opanowanie tych elementów pozwoli Ci tworzyć programy, które rozwiązują problemy i automatyzują zadania.',
                importance: 'core',
                tags: ['wprowadzenie', 'definicje']
            },
            {
                id: 'sec-1-3',
                type: 'interactive',
                content: 'Zanim zaczniemy, zastanów się: co chciałbyś zautomatyzować lub stworzyć za pomocą programowania?',
                importance: 'core',
                interactive: {
                    type: 'multiple-choice',
                    question: 'Który z poniższych projektów najbardziej Cię interesuje?',
                    options: [
                        { id: 'a', text: 'Tworzenie gier' },
                        { id: 'b', text: 'Budowanie stron internetowych' },
                        { id: 'c', text: 'Analiza danych' },
                        { id: 'd', text: 'Aplikacje mobilne' }
                    ],
                    feedback: {
                        correct: 'Świetny wybór! W trakcie nauki programowania będziesz mógł rozwijać umiejętności w tym kierunku.',
                        incorrect: 'Świetny wybór! W trakcie nauki programowania będziesz mógł rozwijać umiejętności w tym kierunku.'
                    }
                },
                tags: ['interaktywne', 'motywacja']
            },
            {
                id: 'sec-1-4',
                type: 'text',
                content: 'W tej lekcji poznasz podstawowe elementy składni, które są wspólne dla większości języków programowania. Będziemy pracować głównie z językiem JavaScript, ale zdobyte umiejętności łatwo przeniesiesz na inne języki!',
                importance: 'core',
                tags: ['wprowadzenie']
            },
            {
                id: 'sec-1-5',
                type: 'list',
                content: [
                    'Zmienne - miejsca przechowywania danych (jak magiczne pudełka na informacje)',
                    'Typy danych - różne rodzaje wartości (liczby, tekst, prawda/fałsz)',
                    'Operatory - znaki służące do wykonywania operacji (jak matematyczne +, -, *)',
                    'Instrukcje warunkowe - pozwalają na podejmowanie decyzji (jeśli-to-w-przeciwnym-razie)',
                    'Pętle - umożliwiają wielokrotne wykonanie kodu (powtarzaj dopóki)'
                ],
                caption: 'Podstawowe elementy składni, które dzisiaj opanujemy:',
                importance: 'core',
                tags: ['składnia', 'pojęcia']
            },
            {
                id: 'sec-1-6',
                type: 'interactive',
                content: 'Interaktywny algorytm sortowania bąbelkowego',
                caption: 'Wizualizacja algorytmu sortowania',
                importance: 'core',
                interactive: {
                    type: 'code-execution',
                    question: 'Poniżej znajduje się interaktywna wizualizacja algorytmu sortowania bąbelkowego. Możesz śledzić krok po kroku, jak elementy są porównywane i zamieniane miejscami. Eksperymentuj z różnymi wartościami wejściowymi.',
                    options: [
                        {
                            id: 'bubble-sort',
                            text: 'const array = [5, 3, 8, 1, 2, 7, 4, 6];\n\n// Kliknij "Uruchom", aby zobaczyć wizualizację sortowania bąbelkowego\nfunction bubbleSort(arr) {\n  let steps = [];\n  let len = arr.length;\n  for (let i = 0; i < len; i++) {\n    for (let j = 0; j < len - 1 - i; j++) {\n      if (arr[j] > arr[j + 1]) {\n        // Zamiana miejscami\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n        // Zapisanie stanu po zamianie\n        steps.push([...arr]);\n      }\n    }\n  }\n  return { sorted: arr, steps: steps };\n}\n\nconst result = bubbleSort(array);\nconsole.log("Posortowana tablica:", result.sorted);\nconsole.log("Kroki sortowania:", result.steps);'
                        },
                        {
                            id: 'customize',
                            text: '// Możesz tutaj zmienić wartości wejściowe\nconst myArray = [9, 1, 5, 3, 8];\nconst result = bubbleSort(myArray);\nconsole.log("Twoja posortowana tablica:", result.sorted);'
                        }
                    ],
                    answer: ['bubble-sort'],
                    feedback: {
                        correct: 'Świetnie! Teraz widzisz jak działa algorytm sortowania bąbelkowego. Zauważ, że w każdym przejściu "największy" element "wypływa" na koniec tablicy - stąd nazwa "sortowanie bąbelkowe".',
                        incorrect: 'Spróbuj jeszcze raz. Zwróć uwagę na to, jak elementy są porównywane parami i jak większe elementy "wypływają" na koniec tablicy.'
                    }
                },
                tags: ['algorytmy', 'sortowanie', 'wizualizacja', 'interaktywny wykres']
            },
            {
                id: 'sec-1-7',
                type: 'text',
                content: 'Przyjrzyjmy się bliżej zmiennym. 🔍 Zmienna to podstawowy element w programowaniu, służący do przechowywania danych. Wyobraź sobie pudełko z etykietą - etykieta to nazwa zmiennej, a zawartość to jej wartość. Możesz zmieniać zawartość, ale etykieta pozostaje ta sama!',
                importance: 'core',
                tags: ['zmienne']
            },
            {
                id: 'sec-1-8',
                type: 'code',
                content: '// Przykład w JavaScript:\nlet wiek = 25; // Zmienna przechowująca liczbę\nconst imie = "Anna"; // Zmienna przechowująca tekst\nlet czyAktywny = true; // Zmienna przechowująca wartość logiczną',
                caption: 'Deklarowanie zmiennych różnych typów w JavaScript',
                importance: 'core',
                tags: ['zmienne', 'JavaScript', 'przykład']
            },
            {
                id: 'sec-1-8b',
                type: 'interactive',
                content: 'Wizualizacja wzrostu wartości zmiennej w pętli',
                caption: 'Interaktywny wykres generowany z opisu',
                importance: 'core',
                interactive: {
                    type: 'prompt-graph',
                    question: 'Poniższy wykres pokazuje, jak zmienia się wartość zmiennej w pętli. Możesz zmienić opis wykresu, aby zobaczyć różne wizualizacje.',
                    graphPrompt: 'Draw a quadratic function y = x^2 with range 0, 10 with title "Wzrost wartości zmiennej" x-label "Iteracja pętli" y-label "Wartość zmiennej"',
                    initialInputs: {
                        graphInput: 'Draw a quadratic function y = x^2 with range 0, 10 with title "Wzrost wartości zmiennej" x-label "Iteracja pętli" y-label "Wartość zmiennej"'
                    },
                    feedback: {
                        correct: 'Świetnie! Zauważ, jak zmienia się wartość zmiennej w kolejnych iteracjach pętli.',
                        incorrect: 'Spróbuj innego opisu wykresu, aby lepiej zobrazować wzrost wartości zmiennej.'
                    }
                },
                tags: ['zmienne', 'pętle', 'wizualizacja', 'interaktywny wykres']
            },
            {
                id: 'sec-1-6',
                type: 'interactive',
                content: 'Uzupełnij poniższy kod, deklarując zmienną "ocena" z wartością 4.5',
                importance: 'core',
                interactive: {
                    type: 'code-execution',
                    question: 'Uzupełnij brakujący fragment kodu:',
                    answer: 'let ocena = 4.5;',
                    feedback: {
                        correct: 'Świetnie! Prawidłowo zadeklarowałeś zmienną "ocena" z wartością 4.5.',
                        incorrect: 'Spróbuj ponownie. Musisz użyć słowa kluczowego "let", nazwy zmiennej "ocena", operatora przypisania "=" oraz wartości 4.5.'
                    }
                },
                tags: ['zmienne', 'ćwiczenie', 'interaktywne']
            },
            {
                id: 'sec-1-7',
                type: 'text',
                content: 'Pętle to mechanizmy, które pozwalają na wielokrotne wykonanie określonego bloku kodu. Są bardzo przydatne, gdy chcemy wykonać tę samą operację wiele razy.',
                importance: 'core',
                tags: ['pętle']
            },
            {
                id: 'sec-1-8',
                type: 'code',
                content: '// Pętla for w JavaScript:\nfor (let i = 0; i < 5; i++) {\n  console.log("Iteracja numer: " + i);\n}',
                caption: 'Przykład pętli for',
                importance: 'core',
                tags: ['pętle', 'JavaScript', 'przykład']
            },
            {
                id: 'sec-1-9',
                type: 'interactive',
                content: 'Jak wiele razy wykona się poniższa pętla?',
                importance: 'supplementary',
                interactive: {
                    type: 'multiple-choice',
                    question: 'Ile razy wykona się pętla: for (let i = 0; i < 10; i += 2)?',
                    options: [
                        { id: 'a', text: '5 razy' },
                        { id: 'b', text: '10 razy' },
                        { id: 'c', text: '6 razy' },
                        { id: 'd', text: '4 razy' }
                    ],
                    answer: 'a',
                    feedback: {
                        correct: 'Dokładnie! Pętla wykona się 5 razy dla wartości i: 0, 2, 4, 6, 8.',
                        incorrect: 'Nie do końca. Pętla zacznie od i=0 i będzie zwiększać i o 2 za każdym razem (0, 2, 4, 6, 8), więc wykona się 5 razy.'
                    }
                },
                tags: ['pętle', 'quiz', 'interaktywne']
            },
            {
                id: 'sec-1-10',
                type: 'quote',
                content: 'Programowanie to nauka o tym, jak kontrolować złożoność.',
                caption: 'Bjarne Stroustrup, twórca języka C++',
                importance: 'supplementary',
                tags: ['cytat', 'inspiracja']
            },
            {
                id: 'sec-1-11',
                type: 'interactive',
                content: 'Podstawy programowania w praktyce',
                caption: 'Interaktywna nauka programowania',
                importance: 'core',
                interactive: {
                    type: 'code-execution',
                    question: 'Spróbuj wykonać poniższe zadania w kolejności:',
                    options: [
                        {
                            id: 'task-1',
                            text: 'Utwórz zmienną o nazwie "name" i przypisz jej swoje imię.\n// Wpisz swój kod tutaj\n\n// Sprawdź wynik\nconsole.log(name);'
                        },
                        {
                            id: 'task-2',
                            text: 'Napisz pętlę, która wypisze liczby od 1 do 5.\n// Użyj pętli for\n\n'
                        }
                    ],
                    answer: ['const name = "Anna";', 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}'],
                    feedback: {
                        correct: 'Świetnie! Udało Ci się zastosować podstawowe koncepcje programowania w praktyce.',
                        incorrect: 'Spróbuj jeszcze raz. Sprawdź podpowiedzi, które mogą Ci pomóc.'
                    }
                },
                tags: ['programowanie', 'interaktywne', 'praktyka', 'kod']
            }
        ],

        // Assessment
        activityType: 'quiz',
        activityData: {
            id: 'mock-exam-1',
            title: 'Podstawy programowania - quiz',
            questions: [
                {
                    id: 'q1',
                    text: 'Co to jest zmienna w programowaniu?',
                    options: [
                        { id: 'a', text: 'Miejsce w pamięci przechowujące wartość' },
                        { id: 'b', text: 'Typ danych' },
                        { id: 'c', text: 'Funkcja w programie' },
                        { id: 'd', text: 'Instrukcja warunkowa' }
                    ],
                    correctOptionId: 'a'
                },
                {
                    id: 'q2',
                    text: 'Która z poniższych jest pętlą w JavaScript?',
                    options: [
                        { id: 'a', text: 'if-else' },
                        { id: 'b', text: 'for' },
                        { id: 'c', text: 'switch' },
                        { id: 'd', text: 'try-catch' }
                    ],
                    correctOptionId: 'b'
                },
                {
                    id: 'q3',
                    text: 'Co zrobi poniższy kod?\nlet x = 5;\nwhile (x > 0) {\n  console.log(x);\n  x--;\n}',
                    options: [
                        { id: 'a', text: 'Wypisze liczby od 5 do 1' },
                        { id: 'b', text: 'Wypisze liczby od 1 do 5' },
                        { id: 'c', text: 'Wypisze liczby od 5 do 0' },
                        { id: 'd', text: 'Wypisze liczby od 0 do 5' }
                    ],
                    correctOptionId: 'a'
                }
            ]
        },

        // Additional resources
        resources: [
            {
                title: 'JavaScript dla początkujących',
                type: 'article',
                url: 'https://example.com/js-tutorial',
                description: 'Kompleksowy tutorial dla osób rozpoczynających naukę JavaScript.'
            },
            {
                title: 'Interaktywne ćwiczenia JavaScript',
                type: 'website',
                url: 'https://codecademy.com',
                description: 'Platforma z interaktywnymi ćwiczeniami do nauki programowania.'
            }
        ],

        // Metadata
        author: 'Jan Kowalski',
        lastUpdated: '2025-07-15',
        tags: ['programowanie', 'JavaScript', 'podstawy', 'zmienne', 'pętle'],
        nextLessons: [2, 4]
    },
    2: {
        id: 2,
        type: 'lesson',
        title: 'Podstawy analizy matematycznej',
        shortDescription: 'W tej lekcji poznasz kluczowe pojęcia z dziedziny matematyki.',
        estimatedDuration: 30, // 30 minutes
        difficulty: 'intermediate',

        learningObjectives: [
            {
                id: 'lo-2-1',
                description: 'Zrozumieć pojęcie pochodnej i jej interpretację geometryczną',
                difficulty: 'intermediate'
            },
            {
                id: 'lo-2-2',
                description: 'Poznać pojęcie całki i jej związek z polem pod krzywą',
                difficulty: 'intermediate'
            },
            {
                id: 'lo-2-3',
                description: 'Rozpoznawać i opisać podstawowe operacje na macierzach',
                difficulty: 'advanced'
            }
        ],

        contentSections: [
            {
                id: 'sec-2-1',
                type: 'text',
                content: 'Analiza matematyczna to dział matematyki zajmujący się badaniem funkcji i ich właściwości, szczególnie przy pomocy pojęć granicy, ciągłości, różniczkowalności i całkowalności.',
                importance: 'core',
                tags: ['wprowadzenie', 'definicje']
            },
            {
                id: 'sec-2-2',
                type: 'text',
                content: 'Wśród najważniejszych pojęć w analizie matematycznej są całka i pochodna.',
                importance: 'core',
                tags: ['wprowadzenie']
            },
            {
                id: 'sec-2-3',
                type: 'image',
                content: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Integral_as_region_under_curve.svg',
                caption: 'Całka jako pole pod krzywą',
                importance: 'core',
                media: {
                    source: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Integral_as_region_under_curve.svg',
                    format: 'svg',
                    alternativeText: 'Grafika przedstawiająca całkę jako pole pod krzywą funkcji'
                },
                tags: ['całka', 'grafika']
            },
            {
                id: 'sec-2-4',
                type: 'text',
                content: 'Całkowanie to operacja odwrotna do różniczkowania. Całka funkcji pozwala nam obliczyć pole obszaru pod wykresem tej funkcji.',
                importance: 'core',
                tags: ['całka', 'definicje']
            },
            {
                id: 'sec-2-5',
                type: 'interactive',
                content: 'Którą z poniższych całek obliczysz pole pod wykresem funkcji f(x) = x² w przedziale [0,2]?',
                importance: 'supplementary',
                interactive: {
                    type: 'multiple-choice',
                    question: 'Którą z poniższych całek obliczysz pole pod wykresem funkcji f(x) = x² w przedziale [0,2]?',
                    options: [
                        { id: 'a', text: '∫₀² x² dx' },
                        { id: 'b', text: '∫₀² 2x dx' },
                        { id: 'c', text: '∫₀² x³ dx' },
                        { id: 'd', text: '∫₂⁴ x dx' }
                    ],
                    answer: 'a',
                    feedback: {
                        correct: 'Dokładnie! Całka oznaczona ∫₀² x² dx pozwala obliczyć pole pod wykresem funkcji f(x) = x² w przedziale [0,2].',
                        incorrect: 'Nie do końca. Aby obliczyć pole pod wykresem funkcji f(x) = x² w przedziale [0,2], potrzebujemy całki ∫₀² x² dx.'
                    }
                },
                tags: ['całka', 'quiz', 'interaktywne']
            },
            {
                id: 'sec-2-6',
                type: 'text',
                content: 'Pochodna funkcji w danym punkcie reprezentuje szybkość zmian wartości tej funkcji. Geometrycznie, jest to współczynnik kierunkowy stycznej do wykresu funkcji w tym punkcie.',
                importance: 'core',
                tags: ['pochodna', 'definicje']
            },
            {
                id: 'sec-2-7',
                type: 'code',
                content: '// Przykład pochodnej w notacji matematycznej:\nf(x) = x^2\nf\'(x) = 2x',
                caption: 'Pochodna funkcji kwadratowej',
                importance: 'core',
                tags: ['pochodna', 'przykład']
            },
            {
                id: 'sec-2-7b',
                type: 'interactive',
                content: 'Interaktywna eksploracja funkcji i ich pochodnych',
                caption: 'Generuj wykresy funkcji i ich pochodnych poprzez opis',
                importance: 'core',
                interactive: {
                    type: 'prompt-graph',
                    question: 'Poniżej znajduje się interaktywny generator wykresów. Możesz opisać funkcję, której wykres chcesz zobaczyć. Spróbuj porównać różne funkcje i ich pochodne.',
                    graphPrompt: 'Draw a sine function with amplitude 2 and frequency 0.5 with range -10, 10 with title "Funkcja sinus i jej pochodna" x-label "x" y-label "f(x)"',
                    initialInputs: {
                        graphInput: 'Draw a sine function with amplitude 2 and frequency 0.5 with range -10, 10 with title "Funkcja sinus i jej pochodna" x-label "x" y-label "f(x)"'
                    },
                    options: [
                        { id: 'sine-function', text: 'Draw a sine function with amplitude 2 and frequency 0.5 with range -10, 10' },
                        { id: 'sine-derivative', text: 'Draw a sine derivative (cosine) with amplitude 2 and frequency 0.5 with range -10, 10' },
                        { id: 'quadratic', text: 'Draw a quadratic function y = x^2 with range -5, 5' },
                        { id: 'quadratic-derivative', text: 'Draw a linear function y = 2x with range -5, 5' }
                    ],
                    feedback: {
                        correct: 'Doskonale! Zwróć uwagę, jak pochodna funkcji reprezentuje nachylenie stycznej do wykresu funkcji w każdym punkcie.',
                        incorrect: 'Spróbuj innego opisu wykresu lub wybierz jedną z gotowych opcji.'
                    }
                },
                tags: ['pochodna', 'funkcje', 'wizualizacja', 'interaktywny wykres']
            },
            {
                id: 'sec-2-8',
                type: 'text',
                content: 'Macierz jest prostokątną tablicą liczb, ułożonych w wiersze i kolumny. Macierze są używane w wielu dziedzinach matematyki i jej zastosowań.',
                importance: 'core',
                tags: ['macierz', 'definicje']
            },
            {
                id: 'sec-2-9',
                type: 'table',
                content: {
                    headers: ['Operacja', 'Opis', 'Przykład'],
                    rows: [
                        ['Dodawanie macierzy', 'Dodawanie odpowiadających sobie elementów', 'A + B'],
                        ['Mnożenie macierzy', 'Iloczyn wierszy przez kolumny', 'A * B'],
                        ['Wyznacznik macierzy', 'Wartość skalarna obliczona z macierzy kwadratowej', 'det(A)']
                    ]
                },
                caption: 'Podstawowe operacje na macierzach',
                importance: 'supplementary',
                tags: ['macierz', 'operacje']
            },
            {
                id: 'sec-2-9b',
                type: 'interactive',
                content: 'Interaktywny wykres funkcji i pochodnych',
                caption: 'Eksploruj wykresy funkcji i ich pochodne',
                importance: 'core',
                interactive: {
                    type: 'multiple-choice',
                    question: 'Poniżej znajduje się interaktywny wykres funkcji f(x) = x². Która z poniższych funkcji reprezentuje pochodną tej funkcji?',
                    options: [
                        { id: 'g1', text: 'g(x) = 2x' },
                        { id: 'g2', text: 'g(x) = x' },
                        { id: 'g3', text: 'g(x) = 2x²' },
                        { id: 'g4', text: 'g(x) = x³' }
                    ],
                    answer: 'g1',
                    feedback: {
                        correct: 'Doskonale! Pochodna funkcji f(x) = x² to f\'(x) = 2x. Na wykresie widać, że nachylenie stycznej do wykresu funkcji w punkcie x jest równe 2x.',
                        incorrect: 'Spróbuj jeszcze raz. Pochodna funkcji f(x) = x² to f\'(x) = 2x. Zwróć uwagę na nachylenie stycznej do wykresu w różnych punktach.'
                    }
                },
                tags: ['matematyka', 'funkcje', 'pochodne', 'interaktywny wykres']
            },
            {
                id: 'sec-2-10',
                type: 'interactive',
                content: 'Interaktywna wizualizacja pochodnej funkcji',
                caption: 'Zbadaj samodzielnie, jak działa pochodna',
                importance: 'core',
                interactive: {
                    type: 'drag-drop',
                    question: 'Dopasuj punkty na wykresie funkcji, aby utworzyć styczną reprezentującą pochodną. Przeciągnij punkty A i B, aby zobaczyć, jak zmienia się nachylenie stycznej.',
                    options: [
                        { id: 'point-a', text: 'Punkt A (bazowy punkt na krzywej)' },
                        { id: 'point-b', text: 'Punkt B (drugi punkt do wyznaczenia stycznej)' },
                        { id: 'tangent-line', text: 'Linia styczna (reprezentuje pochodną w punkcie A)' },
                        { id: 'derivative-value', text: 'Wartość pochodnej (nachylenie stycznej)' }
                    ],
                    answer: ['point-a', 'tangent-line', 'derivative-value'],
                    feedback: {
                        correct: 'Doskonale! Teraz rozumiesz geometryczną interpretację pochodnej jako nachylenie stycznej do wykresu funkcji w danym punkcie.',
                        incorrect: 'Spróbuj jeszcze raz. Pamiętaj, że pochodna w punkcie to nachylenie stycznej do wykresu funkcji w tym punkcie.'
                    }
                },
                tags: ['pochodna', 'wizualizacja', 'interaktywne', 'matematyka']
            },
            {
                id: 'sec-2-11',
                type: 'interactive',
                content: 'Interaktywna analiza danych statystycznych',
                caption: 'Wizualizacja i interpretacja danych',
                importance: 'core',
                interactive: {
                    type: 'multiple-choice',
                    question: 'Poniżej znajduje się interaktywny wykres przedstawiający wyniki egzaminu z matematyki w dwóch różnych grupach studentów. Na podstawie wykresu określ, która z poniższych interpretacji jest prawidłowa:',
                    options: [
                        { id: 'stat1', text: 'Grupa A ma wyższą średnią wyników niż grupa B' },
                        { id: 'stat2', text: 'Grupa B ma mniejsze rozproszenie wyników (mniejszą wariancję) niż grupa A' },
                        { id: 'stat3', text: 'Mediana wyników w grupie A jest wyższa niż w grupie B' },
                        { id: 'stat4', text: 'Rozkład wyników w grupie B jest bardziej zbliżony do rozkładu normalnego' }
                    ],
                    answer: ['stat2', 'stat3'],
                    feedback: {
                        correct: 'Doskonale! Prawidłowo interpretujesz dane statystyczne. Grupa B rzeczywiście ma mniejsze rozproszenie wyników (mniejszą wariancję), co widać po węższym zakresie wyników. Jednocześnie mediana (wartość środkowa) w grupie A jest wyższa.',
                        incorrect: 'Przyjrzyj się jeszcze raz wykresowi. Zwróć uwagę na rozproszenie wyników (szerokość wykresu) oraz położenie wartości środkowej (mediany).'
                    }
                },
                tags: ['statystyka', 'analiza danych', 'interaktywny wykres', 'interpretacja']
            }
        ],

        activityType: 'flashcards',
        activityData: [
            {
                id: 'f1',
                front: 'Całka',
                back: 'Operacja odwrotna do różniczkowania, pozwalająca na obliczenie pola pod krzywą.'
            },
            {
                id: 'f2',
                front: 'Pochodna',
                back: 'Funkcja opisująca szybkość zmian funkcji pierwotnej.'
            },
            {
                id: 'f3',
                front: 'Macierz',
                back: 'Prostokątna tablica liczb lub symboli, uporządkowana w wiersze i kolumny.'
            },
            {
                id: 'f4',
                front: 'Granica funkcji',
                back: 'Wartość, do której funkcja dąży, gdy zmienna niezależna zbliża się do określonej wartości.'
            },
            {
                id: 'f5',
                front: 'Ciągłość funkcji',
                back: 'Właściwość funkcji, która nie ma skoków ani dziur w swoim wykresie.'
            }
        ],

        resources: [
            {
                title: 'Kurs analizy matematycznej online',
                type: 'website',
                url: 'https://example.com/calculus-course',
                description: 'Kompleksowy kurs analizy matematycznej z interaktywnymi przykładami.'
            },
            {
                title: 'Zbiór zadań z analizy matematycznej',
                type: 'book',
                url: 'https://example.com/calculus-problems',
                description: 'Zbiór zadań z rozwiązaniami dla lepszego utrwalenia materiału.'
            }
        ],

        prerequisites: [1], // Wymagana znajomość podstaw programowania
        nextLessons: [3],

        author: 'Anna Nowak',
        lastUpdated: '2025-08-01',
        tags: ['matematyka', 'analiza', 'całki', 'pochodne', 'macierze']
    },
    3: {
        id: 3,
        type: 'lesson',
        title: 'Podstawy fizyki',
        shortDescription: 'Ta lekcja poświęcona jest podstawom fizyki i prawom, które rządzą otaczającym nas światem.',
        estimatedDuration: 35, // 35 minutes
        difficulty: 'beginner',

        learningObjectives: [
            {
                id: 'lo-3-1',
                description: 'Zrozumieć i opisać trzy zasady dynamiki Newtona',
                difficulty: 'beginner'
            },
            {
                id: 'lo-3-2',
                description: 'Analizować ruch ciał z wykorzystaniem zasad dynamiki',
                difficulty: 'intermediate'
            },
            {
                id: 'lo-3-3',
                description: 'Stosować drugą zasadę dynamiki do rozwiązywania podstawowych zadań',
                difficulty: 'intermediate'
            }
        ],

        contentSections: [
            {
                id: 'sec-3-1',
                type: 'text',
                content: 'Fizyka to nauka przyrodnicza zajmująca się badaniem najbardziej fundamentalnych i uniwersalnych właściwości materii i energii oraz oddziaływań między nimi.',
                importance: 'core',
                tags: ['wprowadzenie', 'definicje']
            },
            {
                id: 'sec-3-2',
                type: 'text',
                content: 'Jednym z najważniejszych zestawów praw w fizyce są prawa dynamiki Newtona, które opisują związek między ruchem ciała a działającymi na nie siłami.',
                importance: 'core',
                tags: ['dynamika', 'Newton']
            },
            {
                id: 'sec-3-3',
                type: 'list',
                content: [
                    'Pierwsza zasada dynamiki Newtona (zasada bezwładności): Ciało pozostaje w spoczynku lub porusza się ruchem jednostajnym prostoliniowym, jeśli nie działa na nie żadna siła wypadkowa.',
                    'Druga zasada dynamiki Newtona: Siła działająca na ciało jest równa iloczynowi masy ciała i przyspieszenia, jakie nadaje mu ta siła (F = m·a).',
                    'Trzecia zasada dynamiki Newtona: Jeżeli ciało A działa na ciało B z pewną siłą, to ciało B działa na ciało A z siłą o tej samej wartości, ale o przeciwnym zwrocie.'
                ],
                caption: 'Zasady dynamiki Newtona',
                importance: 'core',
                tags: ['dynamika', 'Newton', 'prawa']
            },
            {
                id: 'sec-3-4',
                type: 'image',
                content: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Free_body.svg/1200px-Free_body.svg.png',
                caption: 'Diagram sił działających na ciało',
                importance: 'supplementary',
                media: {
                    source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Free_body.svg/1200px-Free_body.svg.png',
                    format: 'png',
                    alternativeText: 'Diagram pokazujący siły działające na ciało na równi pochyłej'
                },
                tags: ['siły', 'diagram']
            },
            {
                id: 'sec-3-5',
                type: 'text',
                content: 'Druga zasada dynamiki Newtona jest szczególnie ważna, ponieważ pozwala nam przewidzieć, jak ciało będzie się poruszać pod wpływem działających na nie sił.',
                importance: 'core',
                tags: ['dynamika', 'Newton', 'druga zasada']
            },
            {
                id: 'sec-3-6',
                type: 'interactive',
                content: 'Oblicz przyspieszenie ciała',
                importance: 'core',
                interactive: {
                    type: 'fill-blank',
                    question: 'Jeśli siła 10 N działa na ciało o masie 2 kg, jakie przyspieszenie uzyska to ciało? (wpisz tylko liczbę)',
                    answer: '5',
                    feedback: {
                        correct: 'Poprawnie! Używając wzoru a = F/m: a = 10 N / 2 kg = 5 m/s²',
                        incorrect: 'Spróbuj ponownie. Skorzystaj z drugiej zasady dynamiki: a = F/m = 10 N / 2 kg = 5 m/s²'
                    }
                },
                tags: ['dynamika', 'przykład', 'interaktywne']
            },
            {
                id: 'sec-3-7',
                type: 'quote',
                content: 'Dla każdej akcji istnieje reakcja równa co do wartości, lecz przeciwnie skierowana.',
                caption: 'Isaac Newton, trzecia zasada dynamiki',
                importance: 'supplementary',
                tags: ['cytat', 'trzecia zasada']
            },
            {
                id: 'sec-3-8',
                type: 'interactive',
                content: 'Interaktywny wykres ruchu pod wpływem siły',
                caption: 'Eksperymentuj z siłą, masą i przyspieszeniem',
                importance: 'core',
                interactive: {
                    type: 'drag-drop',
                    question: 'Zmień parametry na interaktywnym wykresie i obserwuj, jak zmieniają się charakterystyki ruchu. Przeciągnij suwak masy i siły, a następnie obserwuj wykres przyspieszenia i prędkości ciała w czasie.',
                    options: [
                        { id: 'force-slider', text: 'Suwak siły: 0N - 100N' },
                        { id: 'mass-slider', text: 'Suwak masy: 0.1kg - 10kg' },
                        { id: 'accel-graph', text: 'Wykres przyspieszenia w czasie' },
                        { id: 'vel-graph', text: 'Wykres prędkości w czasie' },
                        { id: 'pos-graph', text: 'Wykres pozycji w czasie' }
                    ],
                    answer: ['accel-graph', 'vel-graph', 'pos-graph'],
                    feedback: {
                        correct: 'Świetnie! Zauważyłeś/aś jak zmiana siły lub masy wpływa na przyspieszenie zgodnie z II zasadą dynamiki Newtona (F=ma). Przyspieszenie jest wprost proporcjonalne do siły i odwrotnie proporcjonalne do masy.',
                        incorrect: 'Przyjrzyj się uważniej wykresom. Zgodnie z II zasadą dynamiki Newtona (F=ma), przyspieszenie jest wprost proporcjonalne do siły i odwrotnie proporcjonalne do masy.'
                    }
                },
                tags: ['fizyka', 'interaktywny wykres', 'druga zasada', 'wizualizacja', 'ruch']
            },
            {
                id: 'sec-3-9',
                type: 'interactive',
                content: 'Wirtualne laboratorium fizyczne: Zasady dynamiki Newtona',
                caption: 'Eksperymentuj z zasadami Newtona w interaktywnym środowisku',
                importance: 'core',
                interactive: {
                    type: 'multiple-choice',
                    question: 'Przeprowadź wirtualny eksperyment: Wybierz siłę działającą na wózek o masie 2 kg na powierzchni bez tarcia. Jaki będzie efekt?',
                    options: [
                        { id: 'opt-1', text: 'Siła 10N: Wózek porusza się ze stałym przyspieszeniem 5 m/s²' },
                        { id: 'opt-2', text: 'Siła 20N: Wózek porusza się ze stałym przyspieszeniem 10 m/s²' },
                        { id: 'opt-3', text: 'Siła 5N: Wózek porusza się ze stałym przyspieszeniem 2.5 m/s²' },
                        { id: 'opt-4', text: 'Siła 10N: Wózek porusza się ze stałą prędkością 10 m/s' }
                    ],
                    answer: ['opt-1', 'opt-2', 'opt-3'],
                    feedback: {
                        correct: 'Doskonale! Zgodnie z drugą zasadą dynamiki Newtona (F=ma), przyspieszenie ciała jest wprost proporcjonalne do działającej na nie siły i odwrotnie proporcjonalne do jego masy. Dlatego dla masy 2kg: siła 10N daje a=5m/s², siła 20N daje a=10m/s², a siła 5N daje a=2.5m/s².',
                        incorrect: 'Zastanów się nad drugą zasadą dynamiki Newtona: F=ma. Dla masy 2kg, przyspieszenie a=F/m. Siła nie powoduje stałej prędkości (to byłby wynik zerowego przyspieszenia), lecz stałe przyspieszenie.'
                    }
                },
                tags: ['fizyka', 'interaktywne', 'eksperymenty', 'zasady Newtona']
            }
        ],

        activityType: 'quiz',
        activityData: {
            id: 'mock-exam-2',
            title: 'Podstawy fizyki - quiz',
            questions: [
                {
                    id: 'q1',
                    text: 'Które prawo opisuje zależność między siłą, masą i przyspieszeniem?',
                    options: [
                        { id: 'a', text: 'Prawo Ohma' },
                        { id: 'b', text: 'Druga zasada dynamiki Newtona' },
                        { id: 'c', text: 'Prawo Archimedesa' },
                        { id: 'd', text: 'Prawo zachowania energii' }
                    ],
                    correctOptionId: 'b'
                },
                {
                    id: 'q2',
                    text: 'Co stwierdza pierwsza zasada dynamiki Newtona?',
                    options: [
                        { id: 'a', text: 'Siła jest równa iloczynowi masy i przyspieszenia' },
                        { id: 'b', text: 'Dla każdej akcji istnieje równa i przeciwnie skierowana reakcja' },
                        { id: 'c', text: 'Ciało pozostaje w spoczynku lub ruchu jednostajnym prostoliniowym, jeśli nie działa na nie siła wypadkowa' },
                        { id: 'd', text: 'Energia nie może być ani stworzona, ani zniszczona, może jedynie zmieniać formę' }
                    ],
                    correctOptionId: 'c'
                },
                {
                    id: 'q3',
                    text: 'Jeśli siła 15 N działa na ciało o masie 3 kg, jakie przyspieszenie uzyska to ciało?',
                    options: [
                        { id: 'a', text: '3 m/s²' },
                        { id: 'b', text: '5 m/s²' },
                        { id: 'c', text: '15 m/s²' },
                        { id: 'd', text: '45 m/s²' }
                    ],
                    correctOptionId: 'b'
                }
            ]
        },

        resources: [
            {
                title: 'Symulacje praw Newtona',
                type: 'website',
                url: 'https://phet.colorado.edu/en/simulations/forces-and-motion-basics',
                description: 'Interaktywne symulacje pokazujące działanie zasad dynamiki Newtona.'
            },
            {
                title: 'Zbiór zadań z mechaniki',
                type: 'book',
                url: 'https://example.com/mechanics-problems',
                description: 'Zbiór zadań z rozwiązaniami dla lepszego utrwalenia materiału.'
            }
        ],

        prerequisites: [2], // Zalecana znajomość podstaw matematyki
        nextLessons: [4, 5],

        author: 'Prof. Piotr Kowalczyk',
        lastUpdated: '2025-07-20',
        tags: ['fizyka', 'dynamika', 'Newton', 'prawa ruchu', 'mechanika']
    }
};
