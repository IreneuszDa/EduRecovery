// @/app/api/homework/generate/route.ts
// AI Homework Generation API endpoint

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectMongoDB } from '@/lib/mongodb';
import { withRoles, UserRoles } from '@/lib/rbac';
import { getSchoolContext, incrementSchoolApiUsage } from '@/lib/multiTenancy';
import Homework from '@/models/homework';
import Class from '@/models/class';

// System prompt for AI - NEVER exposed to students
const HOMEWORK_SYSTEM_PROMPT = `Jesteś ekspertem od tworzenia materiałów edukacyjnych dla polskich szkół.
Tworzysz interaktywne pytania do pracy domowej zgodnie z polską podstawą programową.

ZASADY:
1. Pytania muszą być zróżnicowane: otwarte, wielokrotnego wyboru, uzupełnij lukę, prawda/fałsz
2. Każde pytanie ma zawierać "aiHint" - wskazówkę metodą sokratejską (naprowadzanie pytaniami, NIE podawanie odpowiedzi)
3. Język: polski
4. Punktacja: 1-5 punktów w zależności od trudności
5. Dla pytań wielokrotnego wyboru: podaj 4 opcje (A, B, C, D)

Zwróć JSON array z pytaniami w formacie:
{
  "questions": [
    {
      "content": "treść pytania",
      "type": "open" | "multiple_choice" | "fill_blank" | "true_false",
      "options": {"A": "...", "B": "...", "C": "...", "D": "..."}, // tylko dla multiple_choice
      "correctAnswer": "poprawna odpowiedź",
      "points": 1-5,
      "aiHint": "wskazówka sokratejska"
    }
  ]
}`;

export async function POST(request: NextRequest) {
    try {
        // Authentication check
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Nie jesteś zalogowany.' },
                { status: 401 }
            );
        }

        // Role check - only teachers
        if (session.user.profileType !== UserRoles.TEACHER) {
            return NextResponse.json(
                { error: 'Ta funkcja jest dostępna tylko dla nauczycieli.' },
                { status: 403 }
            );
        }

        // Get school context
        const schoolId = await getSchoolContext(session.user.id);
        if (!schoolId) {
            return NextResponse.json(
                { error: 'Nie należysz do żadnej szkoły.' },
                { status: 403 }
            );
        }

        // Check API usage limit
        const canUseApi = await incrementSchoolApiUsage(schoolId);
        if (!canUseApi) {
            return NextResponse.json(
                { error: 'Przekroczono miesięczny limit zapytań AI. Skontaktuj się z administratorem.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { topic, questionCount = 10, classId } = body;

        if (!topic || !topic.trim()) {
            return NextResponse.json(
                { error: 'Temat pracy domowej jest wymagany.' },
                { status: 400 }
            );
        }

        // Verify class belongs to this school and teacher
        await connectMongoDB();
        const classDoc = await Class.findOne({
            _id: classId,
            school: schoolId,
            teacher: session.user.id,
        });

        if (!classDoc) {
            return NextResponse.json(
                { error: 'Nie znaleziono klasy lub brak uprawnień.' },
                { status: 404 }
            );
        }

        // Call AI API (OpenAI/Anthropic) to generate questions
        // For now, return mock data - in production, use actual AI API
        const mockQuestions = generateMockQuestions(topic, questionCount);

        return NextResponse.json({
            success: true,
            questions: mockQuestions,
            topic,
            generatedAt: new Date().toISOString(),
        });

    } catch (error) {
        console.error('[HOMEWORK_GENERATE] Error:', error);
        return NextResponse.json(
            { error: 'Wystąpił błąd podczas generowania pytań.' },
            { status: 500 }
        );
    }
}

// Mock question generator (replace with actual AI call in production)
function generateMockQuestions(topic: string, count: number) {
    const questionTypes = ['open', 'multiple_choice', 'fill_blank', 'true_false'];
    const questions = [];

    for (let i = 0; i < count; i++) {
        const type = questionTypes[i % questionTypes.length];

        const baseQuestion = {
            content: `Pytanie ${i + 1} dotyczące tematu: ${topic}`,
            type,
            points: Math.floor(Math.random() * 3) + 1,
            aiHint: `Pomyśl o kluczowych konceptach związanych z ${topic}. Co już wiesz na ten temat?`,
        };

        if (type === 'multiple_choice') {
            Object.assign(baseQuestion, {
                options: {
                    A: 'Odpowiedź A',
                    B: 'Odpowiedź B',
                    C: 'Odpowiedź C',
                    D: 'Odpowiedź D',
                },
                correctAnswer: 'A',
            });
        } else if (type === 'fill_blank') {
            Object.assign(baseQuestion, {
                content: `Uzupełnij zdanie: "${topic} to ___."`,
                correctAnswer: 'przykładowa odpowiedź',
            });
        } else if (type === 'true_false') {
            Object.assign(baseQuestion, {
                content: `Prawda czy fałsz: Stwierdzenie dotyczące ${topic}.`,
                correctAnswer: 'true',
            });
        }

        questions.push(baseQuestion);
    }

    return questions;
}
