// @/app/api/exams/generate/route.ts

import { NextResponse } from 'next/server';
// REMOVED: import OpenAI from 'openai'; // No longer needed
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'; // Keep Gemini SDK
import pdf from 'pdf-parse';
import { IExam, QuestionType } from '@/models/exam';

// REMOVED: OpenAI client initialization

// Initialize the Gemini client
// Ensure GEMINI_API_KEY is set in your .env.local file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// The system prompt defines the required output format. It's crucial for reliable JSON.
// This prompt will now ONLY be used for Gemini (as part of user content).
const systemPrompt = `
You are an expert exam creator. Your task is to generate a complete exam based on the user's prompt, any provided files, and the preceding chat history for context.

A critical piece of context is the subject matter. The user has specified that this exam must be relevant to the following subject: '{SUBJECT}'. This is a mandatory context.

First, here is the history of the conversation so far, which you MUST use for additional context:
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
    subject: string; // This should reflect the '{SUBJECT}' provided above.
    questions: (IMultipleChoiceQuestion | ITrueFalseQuestion | IOpenEndedQuestion | IFillInTheBlankQuestion)[];
}
interface IBaseQuestion { questionNumber: string; points: string; content: string; imageUrl?: string; questionType: 'MultipleChoice' | 'TrueFalse' | 'OpenEnded' | 'FillInTheBlank'; }
interface IMultipleChoiceQuestion extends IBaseQuestion { questionType: 'MultipleChoice'; options: { [key: string]: string }; correctAnswer: string; }
interface ITrueFalseQuestion extends IBaseQuestion { questionType: 'TrueFalse'; statements: { statementText: string; isCorrect: boolean; }[]; }
interface IOpenEndedQuestion extends IBaseQuestion { questionType: 'OpenEnded'; finalAnswer: string; }
interface IFillInTheBlankQuestion extends IBaseQuestion { questionType: 'FillInTheBlank'; correctAnswers: string[]; }
\`\`\`
Now, generate the exam based on the user's latest request, the provided subject, and the full chat history provided above.
`;

const typeStringToEnumMap: { [key: string]: QuestionType } = {
    'MultipleChoice': QuestionType.MultipleChoice,
    'TrueFalse': QuestionType.TrueFalse,
    'OpenEnded': QuestionType.OpenEnded,
    'FillInTheBlank': QuestionType.FillInTheBlank,
};


/**
 * @route   POST /api/exams/generate
 * @desc    Generates exam questions using AI from a text prompt, an uploaded file, or both.
 * @access  Protected
 */
export async function POST(request: Request) {
    try {
        // 1. RECEIVE FORM DATA (PROMPT, FILE, EXISTING QUESTIONS, MODEL SELECTION)
        const formData = await request.formData();
        const prompt = formData.get('prompt') as string | null;
        const file = formData.get('file') as File | null;
        const existingQuestionsRaw = formData.get('existingQuestions') as string | null;
        // The client no longer sends modelProvider, so we default to Gemini model.
        const modelName = (formData.get('modelName') as string | null); // This can still specify a Gemini model.

        const existingQuestions = existingQuestionsRaw ? JSON.parse(existingQuestionsRaw) : [];

        if (!prompt && !file) {
            return NextResponse.json({ message: "A prompt or a file is required to generate questions." }, { status: 400 });
        }

        // Only check for Gemini API key now
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ message: "Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables." }, { status: 500 });
        }

        // 2. CONSTRUCT THE USER MESSAGE FOR THE AI
        let textContent = '';
        // This array will hold structured parts for Gemini.
        const userMessagePartsBuilder: Array<
            { type: 'text'; text: string; } |
            { type: 'image_data_placeholder'; image_data: { url: string; mimeType: string; base64: string; }; }
        > = [];

        // Add context about existing questions to avoid duplicates
        if (existingQuestions && Array.isArray(existingQuestions) && existingQuestions.length > 0) {
            const lastQuestionNumberStr = existingQuestions[existingQuestions.length - 1]?.questionNumber;
            const lastQuestionNumber = parseInt(lastQuestionNumberStr, 10);
            const nextQuestionNumber = isNaN(lastQuestionNumber) ? existingQuestions.length + 1 : lastQuestionNumber + 1;

            textContent += `IMPORTANT CONTEXT: You are adding questions to an existing exam that already has ${existingQuestions.length} questions. You MUST start numbering the new questions from ${nextQuestionNumber}.\n`;
            textContent += `To avoid creating duplicates, here is a summary of existing questions:\n`;
            const questionsSummary = existingQuestions.map((q: any) => ({ questionNumber: q.questionNumber, content: q.content, type: q.questionType }));
            textContent += `${JSON.stringify(questionsSummary, null, 2)}\n\n`;
        } else {
            textContent += `This is a new exam. Please generate questions starting from number 1.\n\n`;
        }

        // Add the user's text prompt if it exists
        if (prompt) {
            textContent += `User's instructions: "${prompt}"\n\n`;
        } else {
            textContent += `User's instructions: "Please generate a set of diverse exam questions based on the content of the provided file."\n\n`;
        }

        // Process file and add its content to the message
        if (file) {
            const fileType = file.type;
            const buffer = Buffer.from(await file.arrayBuffer());

            if (fileType.startsWith('image/')) {
                const base64Image = buffer.toString('base64');
                userMessagePartsBuilder.push({
                    type: 'image_data_placeholder', // Custom placeholder to hold image data
                    image_data: { url: `data:${fileType};base64,${base64Image}`, mimeType: fileType, base64: base64Image },
                });
                textContent += `Base your questions on my instructions and the content of the provided image.`;
            } else if (fileType === 'application/pdf') {
                const pdfData = await pdf(buffer);
                const pdfText = pdfData.text.substring(0, 20000); // Truncate to manage token limits
                textContent += `Base your questions on my instructions and the following text extracted from the provided PDF document:\n---\n${pdfText}\n---`;
            } else {
                return NextResponse.json({ message: 'Unsupported file type. Please upload a PDF or an image (PNG, JPG).' }, { status: 400 });
            }
        }

        // Add the combined text content as the first part of the user message
        userMessagePartsBuilder.unshift({ type: 'text', text: textContent });

        // 3. CALL GEMINI API (only Gemini now)
        let content: string | null | undefined;

        const geminiUserMessageParts: Array<any> = [];

        // For Gemini, prepend the system prompt directly to the text content
        // as it doesn't have a separate system role in generateContent.
        geminiUserMessageParts.push({ text: systemPrompt + "\n\n" + textContent });

        userMessagePartsBuilder.forEach(part => {
            if (part.type === 'image_data_placeholder') {
                // Convert placeholder to Gemini's inlineData format
                geminiUserMessageParts.push({
                    inlineData: {
                        mimeType: part.image_data.mimeType,
                        data: part.image_data.base64,
                    },
                });
            }
            // The main text content from userMessagePartsBuilder is already handled above
            // by combining it with the systemPrompt. So, no need to re-add text parts here.
        });

        // Select Gemini model (gemini-1.5-flash is generally a good balance of speed/cost)
        const model = genAI.getGenerativeModel({ model: modelName || "gemini-2.5-flash-lite-preview-06-17" });

        // Add safety settings to reduce blocking of content that might be considered harmful
        // but is necessary for educational/exam generation purposes. Adjust as needed.
        const result = await model.generateContent({
            contents: [{ role: "user", parts: geminiUserMessageParts }],
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ],
        });

        const response = await result.response;
        content = response.text(); // Gemini provides the text directly
        console.log("Gemini raw response content:", content); // For debugging purposes


        if (!content) {
            throw new Error("AI failed to generate a response or returned empty content.");
        }

        // 4. PARSE AND TRANSFORM RESPONSE
        let generatedExamFromString: Partial<IExam>;
        try {
            // Robust parsing: Attempt to extract JSON even if wrapped in markdown code blocks (common with Gemini)
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
            const pureJsonString = jsonMatch ? jsonMatch[1] : content; // Use extracted JSON or full content if no match
            generatedExamFromString = JSON.parse(pureJsonString) as Partial<IExam>;
        } catch (parseError) {
            console.error("Failed to parse AI response as JSON:", parseError);
            console.error("Raw AI content that failed to parse:", content);
            throw new Error("AI returned a malformed JSON response. Please try again or refine your prompt. Raw AI content logged for debugging.");
        }


        if (!generatedExamFromString.questions || !Array.isArray(generatedExamFromString.questions)) {
            throw new Error("AI returned an invalid or incomplete exam structure (missing 'questions' array).");
        }

        const transformedQuestions = generatedExamFromString.questions.map((q: any) => {
            const numericType = typeStringToEnumMap[q.questionType];
            if (numericType === undefined) {
                console.warn(`AI returned an unknown question type: "${q.questionType}". Skipping this question.`);
                return null;
            }
            return { ...q, questionType: numericType };
        }).filter(Boolean); // Filter out any nulls resulting from unknown question types

        const finalExamData = {
            ...generatedExamFromString,
            questions: transformedQuestions,
        };

        return NextResponse.json(finalExamData, { status: 200 });

    } catch (error) {
        console.error("Error generating exam with AI:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return NextResponse.json(
            { message: "Failed to generate exam.", error: errorMessage },
            { status: 500 }
        );
    }
}