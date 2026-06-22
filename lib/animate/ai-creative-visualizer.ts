import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Minimal Gemini Matplotlib generator for a single 5-second scene
export async function generateMatplotlibScene(prompt: string): Promise<string> {
    if (!genAI) return '';
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const systemPrompt = `You are Gemini. Generate pure Python matplotlib code from scratch for a single, simple 5-second video scene. No script, no explanation, no markdown. Just the code.`;
    const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n${prompt}` }] }]
    });
    let code = result.response.text().trim();
    code = code.replace(/```python/g, '').replace(/```/g, '').trim();
    return code;
}
