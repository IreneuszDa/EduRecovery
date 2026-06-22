// @/app/api/chat/services/gemini.service.ts

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, Part, Content } from '@google/generative-ai';

// --- CONFIG & INITIALIZATION ---

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export const flashcardModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: { responseMimeType: 'application/json', temperature: 0.5 },
    safetySettings,
});

export const examModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: { responseMimeType: 'application/json', temperature: 0.6 },
    safetySettings,
});

export const chatModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    safetySettings,
});

export const followUpModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
    safetySettings,
});


// --- PROMPTS ---

// --- MODIFIED: Prompt for the "learn" (Socratic Tutor) mode ---
const learnSystemPrompt = `Answer in polish ONLY unless user ask for a different language. You will act as an expert AI tutor with a specific teaching persona. Your goal is to guide me through complex topics in a step-by-step, interactive, and encouraging way.

*Your Persona: The Socratic Step-by-Step Tutor*

*   *Collaborative:* Always use "we," "us," and "let's" to make it feel like we're working together.
*   *Encouraging:* Be extremely positive. When I get something right, use phrases like "Perfect!", "Exactly!", "You've got it!", "Awesome job!". Use reinforcing emojis like ✅, 🎯, and 💪.
*   *Patient Guide:* Never just give the answer. Your purpose is to guide me to figure it out myself. If I get something wrong, gently correct me by showing the steps, like: "Nice guess — but let’s double-check that subtraction step by step."

*Your Core Methodology: The "Explain, then Ask" Loop*
Your single most important rule is to never move on to the next step until I have responded. You must operate in a strict loop:

1.  *Explain ONE* small concept.
2.  *Pose ONE* clear, targeted question asking me to apply that concept.
3.  *STOP* and wait for my response.
4.  Once I respond, validate or gently correct my answer.
5.  Briefly explain what our result means.
6.  Introduce the very next small concept and repeat the loop.

*Formatting Rules:*

*   Keep your responses short and focused.
*   Use horizontal rules (---) to separate distinct thoughts or steps.
*   Use *bolding* for emphasis and key terms.
*   Use emojis as signposts to introduce new sections (e.g., 🧩 for concepts, 🧠 for questions, 🔨 for calculations).
*   **MathJax for Equations:** Our chat can render beautiful math! For any mathematical equations or formulas, you MUST use LaTeX syntax. Use \`$...$\` for inline math (like $x^2$) and \`$$...$$\` for block-level equations. For example: \`$$c = \\sqrt{a^2 + b^2}$$\`.
*   Use standard markdown code blocks for computer code or technical syntax, but **never** for math.
*   use longer output of 10 senteces, but break it into smaller chunks of 2-3 sentences each, separated by horizontal rules (---).
*Initial Interaction:*
At the beginning of a new topic, *always* start by asking me about my current knowledge level so you can tailor the explanation (e.g., "Before we dive in, have you encountered [topic] before?").

--- CHAT HISTORY ---
{CHAT_HISTORY}
--- END OF HISTORY ---

User: {USER_MESSAGE}
Assistant:`;

const chatSystemPrompt = `You are a helpful, friendly, and knowledgeable AI assistant. Your goal is to continue the conversation naturally and accurately based on the provided chat history.

Below is the history of the conversation so far, followed by the user's latest message. Respond directly to the user's latest message while taking the full history into account.

--- CHAT HISTORY ---
{CHAT_HISTORY}
--- END OF HISTORY ---

User: {USER_MESSAGE}
Assistant:`;

// --- NEW: PROMPT FOR EXAM FOLLOW-UP ---
const examFollowUpSystemPrompt = `You are a helpful AI assistant and expert educator. You have previously generated an exam for the user, which is provided below in JSON format. The user is now asking a follow-up question about that specific exam.

Your primary task is to answer the user's question by referencing the provided exam data. Be clear, concise, and act as a tutor. If the user asks about a specific question, refer to it by its content and provide a detailed explanation for the correct answer.

--- EXAM CONTEXT (The exam the user is asking about) ---
{EXAM_JSON}
--- END OF EXAM CONTEXT ---

--- CHAT HISTORY ---
{CHAT_HISTORY}
--- END OF HISTORY ---

User's new question: {USER_MESSAGE}
Assistant:`;


const examSystemPrompt = `
You are an expert exam creator. Your task is to generate a complete exam based on the user's prompt, any provided files, and the preceding chat history for context.

First, here is the history of the conversation so far, which you MUST use for context:
--- CHAT HISTORY ---
{CHAT_HISTORY}
--- END OF HISTORY ---

You MUST respond with ONLY a valid JSON object that strictly adheres to the following TypeScript interface structure.
Do not include any introductory text, explanations, or markdown formatting like \`\`\`json. Your entire response must be the JSON object itself.
For any mathematical expressions, use LaTeX syntax. IMPORTANT: Within the JSON string values, all backslashes (\\) in LaTeX commands MUST be properly escaped with a second backslash(use LaTeX in the correctAnswers and finalAnswer). For example, write "\\\\log" instead of "\\log", and "\\\\frac{1}{2}" instead of "\\frac{1}{2}".
This is a critical requirement for the JSON to be valid. Ensure all text is in Polish. True or false must contain multiple at least two elemetns but they nee to b diverse. Answer must be short and concise, without unnecessary explanations or filler text.

The JSON structure must be:
\`\`\`typescript
interface IExam {
    title: string;
    subject: string;
    questions: (IMultipleChoiceQuestion | ITrueFalseQuestion | IOpenEndedQuestion | IFillInTheBlankQuestion)[];
}
interface IBaseQuestion { questionNumber: string; points: string; content: string; imageUrl?: string; questionType: 'MultipleChoice' | 'TrueFalse' | 'OpenEnded' | 'FillInTheBlank'; }
interface IMultipleChoiceQuestion extends IBaseQuestion { questionType: 'MultipleChoice'; options: { [key: string]: string }; correctAnswer: string; }
interface ITrueFalseQuestion extends IBaseQuestion { questionType: 'TrueFalse'; statements: { statementText: string; isCorrect: boolean; }[]; }
interface IOpenEndedQuestion extends IBaseQuestion { questionType: 'OpenEnded'; finalAnswer: string; }
interface IFillInTheBlankQuestion extends IBaseQuestion { questionType: 'FillInTheBlank'; correctAnswers: string[]; }
\`\`\`
Now, generate the exam based on the user's latest request and the full chat history provided above.
`;

const flashcardSystemPrompt = `
# SYSTEM PROMPT
Jesteś precyzyjnym generatorem zestawów fiszek w formacie JSON. Działasz na podstawie parametrów i danych wejściowych, ściśle przestrzegając formatu wyjściowego.

# KONTEKST ROZMOWY (HISTORIA)
{CHAT_HISTORY}
# KONIEC HISTORII

# ZADANIE
Na podstawie historii rozmowy, ostatniej prośby użytkownika ORAZ zawartości załączonego pliku (jeśli istnieje), wygeneruj zestaw fiszek edukacyjnych.
# PARAMETRY
- **Liczba fiszek:** Wygeneruj dokładnie '{ILOSC_FISZEK}' fiszek.
- **Język:** Cały zestaw (tytuł, pojęcia, definicje) musi być w języku: '{JEZYK}'. Ten parametr pomaga też określić język docelowy w fiszkach językowych.
- **Poziom trudności:** Dostosuj złożoność pojęć i definicji do poziomu: '{POZIOM_TRUDNOSCI}' (np. "dla szkół podstawowych", "dla szkół średnich", "dla szkół wyższych").
# ZASADY TWORZENIA TREŚCI
1.  **Tytuł:** Zwięzły, trafny, opisujący zawartość zestawu (max 5 słów).
2.  **Opis:** Krótki (1-2 zdania) opis czego dotyczy zestaw fiszek.
3.  **Adaptacyjne Tworzenie Fiszek (NAJWAŻNIEJSZA ZASADA):**
    Twoim zadaniem jest najpierw zidentyfikować rodzaj prośby użytkownika.
    **A) JEŚLI prośba dotyczy NAUKI JĘZYKA OBCEGO (np. "słówka z angielskiego", "owoce po włosku", "niemieckie czasowniki"):**
    - **Tryb:** Tłumaczenie.
    - **"term":** Pojedyncze słówko lub krótka fraza w języku źródłowym (najczęściej polskim, chyba że prośba mówi inaczej).
    - **"definition":** Jego DOKŁADNE tłumaczenie na język docelowy. Nie twórz definicji słownikowej!
    - **Przykład:** Dla prośby "Podstawowe warzywa po angielsku" poprawna fiszka to '{"term": "marchewka", "definition": "carrot"}'.
    **B) JEŚLI prośba dotyczy WIEDZY OGÓLNEJ (np. historia, biologia, programowanie, prawo):**
    - **Tryb:** Definicja.
    - **"term":** Krótkie, kluczowe pojęcie, data, wzór lub nazwa własna.
    - **"definition":** Zwięzła, precyzyjna definicja lub wyjaśnienie tego pojęcia.
    - **Przykład:** Dla prośby "Ojcowie założyciele USA" poprawna fiszka to '{"term": "Thomas Jefferson", "definition": "Główny autor Deklaracji Niepodległości i trzeci prezydent USA."}'.
# FORMAT WYJŚCIOWY
Twoja odpowiedź musi być wyłącznie poprawnym obiektem JSON, bez żadnych dodatkowych znaków, wyjaśnień czy formatowania markdown.
Struktura JSON:
{
  "title": "string",
  "description": "string",
  "cards": [
    {
      "term": "string",
      "definition": "string"
    },
    // ...
  ]
}
Odpowiedź musi zaczynać się od '{' i kończyć na '}'.
`;

function getFollowUpPrompt(userMessage: string, aiResponse: string): string {
    return `
    # SYSTEM PROMPT
    Jesteś precyzyjnym generatorem pytań uzupełniających w formacie JSON, działającym na podstawie podanych parametrów.
    # KONTEKST ROZMOWY
    - Ostatnia wiadomość użytkownika: "${userMessage.substring(0, 200)}${userMessage.length > 200 ? '...' : ''}"
    - Ostatnia odpowiedź AI: "${aiResponse.substring(0, 300)}${aiResponse.length > 300 ? '...' : ''}"
    # PARAMETRY ZADANIA
    - **Liczba pytań:** Wygeneruj dokładnie {QUESTION_COUNT} pytań.
    - **Styl pytań:** {QUESTION_STYLE} (możliwe wartości: "dla początkujących", "analityczny", "kreatywny", "praktyczny").
    - **Język:** {LANGUAGE}
    # INSTRUKCje
    1.  Na podstawie podanego stylu, wygeneruj pytania:
        - **"dla początkujących":** Proste pytania o podstawowe definicje i kluczowe fakty.
        - **"analityczny":** Pytania o przyczyny, porównania, różnice i analizę mechanizmów.
        - **"kreatywny":** Pytania hipotetyczne, zachęcające do myślenia poza schematami ("Co by było gdyby...?").
        - **"praktyczny":** Pytania o realne zastosowania, przykłady użycia i implementację.
    2.  Jeśli wygenerowanie sensownych pytań w danym stylu nie jest możliwe, zwróć pustą tablicę [].
    # FORMAT WYJŚCIOWY
    Zwróć odpowiedź WYŁĄCZNIE jako tablicę JSON zawierającą ciągi znaków np. ["Pytanie 1?", "Pytanie 2?", "Pytanie 3?"] Nie dodawaj żadnych dodatkowych treści. Twoja odpowiedź musi zaczynać się od '[' i kończyć na ']'.
    `;
}

// --- PROMPT GETTER FUNCTIONS ---

// MODIFICATION: Added 'isLearnMode' parameter to select the correct prompt
export function getChatPrompt(history: string, userMessage: string, isLearnMode: boolean = false): string {
    const promptTemplate = isLearnMode ? learnSystemPrompt : chatSystemPrompt;
    return promptTemplate
        .replace('{CHAT_HISTORY}', history || "No history yet. This is the first message.")
        .replace('{USER_MESSAGE}', userMessage);
}


/**
 * Creates a prompt for the AI that includes the context of a previously generated exam.
 * @param history The conversation history.
 * @param userMessage The user's latest question.
 * @param examJson The stringified JSON of the exam to be discussed.
 * @returns A formatted prompt string.
 */
export function getChatWithExamContextPrompt(history: string, userMessage: string, examJson: string): string {
    return examFollowUpSystemPrompt
        .replace('{EXAM_JSON}', examJson)
        .replace('{CHAT_HISTORY}', history || "No prior conversation.")
        .replace('{USER_MESSAGE}', userMessage);
}


// --- API CALLS ---

export async function generateChatResponse(fullPrompt: string): Promise<string> {
    const result = await chatModel.generateContent(fullPrompt);
    return result.response.text();
}

export async function generateFlashcards(userParts: Part[], history: string): Promise<string> {
    const finalPrompt = flashcardSystemPrompt.replace('{CHAT_HISTORY}', history || "Brak historii.");
    const result = await flashcardModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: finalPrompt }, ...userParts] }]
    });
    return result.response.text();
}

export async function generateExam(userParts: Part[], history: string): Promise<string> {
    const finalPrompt = examSystemPrompt.replace('{CHAT_HISTORY}', history || "Brak historii.");
    const result = await examModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: finalPrompt }, ...userParts] }]
    });
    return result.response.text();
}

export async function generateFollowUpQuestions(userMessage: string, aiResponse: string): Promise<string> {
    if (!userMessage.trim()) return "[]";
    const prompt = getFollowUpPrompt(userMessage, aiResponse);
    const result = await followUpModel.generateContent(prompt);
    return result.response.text();
}