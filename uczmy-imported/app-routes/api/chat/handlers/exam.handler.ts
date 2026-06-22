import { NextResponse } from 'next/server';
import Exam from '@/models/exam';
import { QuestionType } from '@/models/exam';
import { generateExam } from '../services/gemini';
import { extractJsonFromString, sanitizeAndParseJson } from '../utils/json.utils';
import { Message, IExam } from '../chat.types';
import { Part } from '@google/generative-ai';
import { IChatSession } from '@/models/chatSession';

const typeStringToEnumMap: { [key: string]: QuestionType } = {
    'MultipleChoice': QuestionType.MultipleChoice,
    'TrueFalse': QuestionType.TrueFalse,
    'OpenEnded': QuestionType.OpenEnded,
    'FillInTheBlank': QuestionType.FillInTheBlank,
};

// --- MODIFICATION: Added 'maturaSubject' to the function signature ---
export async function handleGenerateExam(
    userId: string,
    userParts: Part[],
    chatSession: IChatSession,
    userMessage: Message,
    file: File | null,
    maturaSubject: string | null // <-- Receive the subject context
): Promise<NextResponse> {
    // 1. Format the existing chat history.
    const formattedHistory = chatSession.messages
        .map(m => (m.role === 'user' ? `User: ${m.content}` : `Assistant: ${m.content}`))
        .join('\n\n');

    // 2. Add user's current message to the session history.
    chatSession.messages.push(userMessage);

    // 3. Generate the exam from the AI, now with subject context.
    // --- MODIFICATION: Pass subject to the Gemini service ---
    const aiResponseText = await generateExam(userParts, formattedHistory, maturaSubject);

    if (!aiResponseText) {
        throw new Error("AI failed to generate a response for the exam.");
    }

    const jsonString = extractJsonFromString(aiResponseText);
    if (!jsonString) {
        console.error("Failed to extract JSON from exam response:", aiResponseText);
        throw new Error("AI response did not contain a valid JSON block for the exam.");
    }

    const parsedExam = sanitizeAndParseJson<Partial<IExam>>(jsonString);
    let responsePayload: any;

    if (!parsedExam.questions || !Array.isArray(parsedExam.questions) || parsedExam.questions.length === 0) {
        const failureMessage: Message = { role: 'assistant', content: "Przepraszam, nie udało mi się stworzyć pytań do egzaminu. Spróbuj sformułować prośbę inaczej." };
        chatSession.messages.push(failureMessage);
        responsePayload = { type: 'chat', message: failureMessage };
    } else {
        const transformedQuestions = parsedExam.questions
            .map((q: any) => ({ ...q, questionType: typeStringToEnumMap[q.questionType] }))
            .filter(q => q.questionType !== undefined);

        if (transformedQuestions.length === 0) {
            const failureMessage: Message = { role: 'assistant', content: "Przepraszam, stworzony egzamin nie zawierał żadnych poprawnych pytań. Spróbuj zmienić prośbę." };
            chatSession.messages.push(failureMessage);
            responsePayload = { type: 'chat', message: failureMessage };
        } else {
            // Create the Exam document in its own collection
            const newExam = await Exam.create({
                // --- MODIFICATION: Use subject for better default title and subject fields ---
                title: parsedExam.title || `Egzamin z ${maturaSubject || (file ? file.name : 'twoich materiałów')}`,
                subject: parsedExam.subject || maturaSubject || 'Stworzono z czatu',
                questions: transformedQuestions,
                isPublic: false,
                user: userId,
            });

            // Set the new exam's ID as the active context for this chat session.
            chatSession.activeExamContextId = newExam._id;

            // Create the confirmation message with the link information
            const confirmationMessage: Message = {
                role: 'assistant',
                content: `Świetnie! Stworzyłem dla Ciebie egzamin zatytułowany "${newExam.title}". Możesz od razu zacząć go rozwiązywać poniżej lub przejść do niego później.`,
                linkType: 1, // 1 signifies an exam
                linkId: newExam._id.toString()
            };
            chatSession.messages.push(confirmationMessage);

            // Prepare the payload to send to the client
            responsePayload = {
                type: 'exam',
                exam: JSON.parse(JSON.stringify(newExam)),
                message: confirmationMessage
            };
        }
    }

    // Return the response; the main route handler will save the modified session.
    return NextResponse.json(responsePayload);
}