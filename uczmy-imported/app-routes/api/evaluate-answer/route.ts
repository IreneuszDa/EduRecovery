import { NextResponse } from 'next/server';
import { Question, QuestionType, IOpenEndedQuestion, IFillInTheBlankQuestion, IBaseQuestion } from '@/components/exams/question-types';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// ... (reszta kodu: EvaluateApiPayload, GEMINI_API_KEY, genAI, safetySettings bez zmian)
interface EvaluateApiPayload {
    question: Question;
    userAnswer: string;
}
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];


async function evaluateWithGemini(question: Question, userAnswer: string): Promise<boolean> {
    // --- ROZWIĄZANIE: Zawężenie typu (Type Guard) ---
    // Sprawdzamy, czy `content` istnieje w obiekcie pytania.
    // To informuje TypeScript, że wewnątrz tego bloku 'if',
    // `question` jest typu, który na pewno ma właściwość `content`.
    if (!('content' in question)) {
        console.error("Attempted to evaluate a question type that has no 'content' property.", question.questionType);
        // Zwracamy fałsz, ponieważ nie możemy ocenić pytania bez treści.
        return false;
    }
    // Od tego momentu TypeScript wie, że `question` ma właściwość `content`
    // i jest zgodne z interfejsem IBaseQuestion.

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite-preview-06-17', safetySettings });

    let groundTruth = '';
    if (question.questionType === QuestionType.FillInTheBlank) {
        groundTruth = `Poprawne odpowiedzi to: "${(question as IFillInTheBlankQuestion).correctAnswers.join('", "')}"`;
    } else if (question.questionType === QuestionType.OpenEnded && (question as IOpenEndedQuestion).finalAnswer) {
        groundTruth = `Sugerowana finalna odpowiedź to: "${(question as IOpenEndedQuestion).finalAnswer}"`;
    }

    const prompt = `
        Jesteś bezstronnym, precyzyjnym asystentem AI na platformie edukacyjnej. Twoim zadaniem jest ocena odpowiedzi ucznia na podstawie podanych kryteriów. Bądź ścisły.

        Kontekst Pytania:
        - Treść Pytania: "${question.content}" // <-- Teraz jest to bezpieczne!
        - ${groundTruth}

        Zadanie:
        Porównaj poniższą "Odpowiedź Ucznia" z podanymi kryteriami (poprawnymi odpowiedziami). Weź pod uwagę sens merytoryczny, a nie tylko dokładne dopasowanie słów. Drobne literówki lub synonimy mogą być akceptowane, jeśli nie zmieniają znaczenia odpowiedzi.

        Odpowiedź Ucznia:
        "${userAnswer}"

        ---
        INSTRUKCJA WYJŚCIOWA:
        Odpowiedz TYLKO I WYŁĄCZNIE jednym słowem. Bez żadnych dodatkowych wyjaśnień.
        - Jeśli odpowiedź ucznia jest poprawna merytorycznie, odpowiedz: POPRAWNA
        - Jeśli odpowiedź ucznia jest błędna, odpowiedz: BŁĘDNA
    `;

    try {
        console.log("Wysyłanie promptu do Gemini...");
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text().trim().toUpperCase();

        console.log("Odpowiedź od Gemini:", text);
        return text === 'POPRAWNA';

    } catch (error) {
        console.error("Błąd podczas komunikacji z Gemini API:", error);
        return false;
    }
}

export async function POST(request: Request) {
    // ... (reszta funkcji POST bez zmian)
    if (!GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY nie jest ustawiony w zmiennych środowiskowych.");
        return NextResponse.json({ error: 'Server configuration error: Missing API Key' }, { status: 500 });
    }

    try {
        const body = (await request.json()) as EvaluateApiPayload;
        const { question, userAnswer } = body;

        if (!question || !userAnswer) {
            return NextResponse.json({ error: 'Missing question or userAnswer in request body' }, { status: 400 });
        }

        const isCorrect = await evaluateWithGemini(question, userAnswer);
        return NextResponse.json({ isCorrect }, { status: 200 });

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
    }
}