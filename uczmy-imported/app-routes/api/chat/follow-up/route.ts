import { NextResponse } from 'next/server';
import { generateFollowUpQuestions } from '../services/gemini';
import { extractJsonFromString } from '../utils/json.utils';
import { sanitizeAndParseJson } from '../utils/json.utils';


export async function POST(req: Request) {
    try {
        // --- MODIFICATION: Destructure 'maturaSubject' from the request body ---
        const { userMessage, aiResponse, maturaSubject } = await req.json();

        if (!userMessage || !aiResponse) {
            return new NextResponse('Missing userMessage or aiResponse from request body', { status: 400 });
        }

        // --- MODIFICATION: Pass 'maturaSubject' to the service function ---
        const followUpResponseText = await generateFollowUpQuestions(userMessage, aiResponse, maturaSubject || null);
        let proposedQuestions: string[] = [];

        try {
            const extractedJson = extractJsonFromString(followUpResponseText);
            if (extractedJson) {
                // Using the safer sanitizeAndParseJson utility
                const parsed = sanitizeAndParseJson<string[]>(extractedJson);
                if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                    proposedQuestions = parsed.slice(0, 3);
                }
            }
        } catch (e) {
            console.warn("[FOLLOW_UP_API_WARN] Failed to parse follow-up questions JSON:", followUpResponseText, "Error:", e);
        }

        return NextResponse.json({ proposedQuestions });

    } catch (error) {
        console.error('[FOLLOW_UP_API_ERROR]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}