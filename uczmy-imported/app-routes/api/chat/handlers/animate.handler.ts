import { NextResponse } from 'next/server';
import type { IChatSession } from '@/models/chatSession';
import type { Message } from '../chat.types';
import type { Part } from '@google/generative-ai';
import { connectMongoDB } from '@/lib/mongodb';
import Animation from '@/models/animation';
import { generateMatplotlibScene } from '@/lib/animate';
import { renderAnimationLocally, checkPythonEnvironment } from '@/lib/animate/local-renderer';

/**
 * Handler for the "animate" action - generates Manim code and renders an animation
 * 
 * @param userId - The ID of the current user
 * @param parts - The message parts from Gemini (includes text and files)
 * @param chatSession - The current chat session
 * @param userMessage - The user's message
 * @param prompt - The original prompt text from the user
 */
export async function handleAnimateAction(
    userId: string,
    parts: Part[],
    chatSession: IChatSession,
    userMessage: Message,
    prompt: string
): Promise<NextResponse> {
    try {
        // Add user message to chat history
        chatSession.messages.push(userMessage);

        // Create animation entry directly
        // Connect to the database
        await connectMongoDB();

        // Generate matplotlib code using Gemini
        const matplotlibCode = await generateMatplotlibScene(prompt);

        // Create the animation record with pending status
        const animation = await Animation.create({
            userId,
            prompt,
            manimCode: matplotlibCode,
            status: 'pending',
            videoUrl: ''
        });

        const animationId = animation._id.toString();
        console.log(`[CHAT_ANIMATE] ${animationId} - Animation created, starting rendering...`);

        // Try to render the video locally
        try {
            // Check if Python environment is available
            const pythonAvailable = await checkPythonEnvironment();

            if (pythonAvailable) {
                console.log(`[CHAT_ANIMATE] ${animationId} - Python environment available, starting video rendering...`);
                const videoUrl = await renderAnimationLocally(animationId, matplotlibCode, prompt);

                // Success: we have a video!
                animation.status = 'completed';
                animation.videoUrl = videoUrl;
                animation.errorMessage = null;

                console.log(`[CHAT_ANIMATE] ${animationId} - Video rendering successful! Video URL: ${videoUrl}`);
            } else {
                throw new Error('Python environment not available');
            }
        } catch (renderError) {
            console.error(`[CHAT_ANIMATE] ${animationId} - Video rendering failed:`, renderError);

            // Fallback: mark as completed but with explanation
            animation.status = 'completed';
            animation.videoUrl = '';
            animation.errorMessage = `Renderowanie wideo nie powiodło się: ${renderError instanceof Error ? renderError.message : 'Nieznany błąd'}. Kod matplotlib został wygenerowany.`;
        }

        // Save the final animation state
        await animation.save();
        console.log(`[CHAT_ANIMATE] ${animationId} - Animation processing completed`);

        if (!animationId) {
            throw new Error('Failed to create animation');
        }

        // Generate a message based on whether we have a video
        let messageContent;
        if (animation.videoUrl) {
            messageContent = `✅ Animacja została wygenerowana pomyślnie dla: "${prompt}"\n\nWideo jest gotowe do obejrzenia!`;
        } else if (animation.errorMessage) {
            messageContent = `⚠️ Kod animacji został wygenerowany dla: "${prompt}"\n\n${animation.errorMessage}`;
        } else {
            messageContent = `Wygenerowałem kod matplotlib dla: "${prompt}"\n\nKod został utworzony i zapisany.`;
        }

        const assistantMessage: Message = {
            role: 'assistant',
            content: messageContent
        };

        // Add assistant response to chat history
        chatSession.messages.push(assistantMessage);

        // Save the updated chat session
        await chatSession.save();

        // Return the response with animation data
        return NextResponse.json({
            type: 'animate',
            message: {
                ...assistantMessage,
                linkType: 2, // Mark as animation type
                linkId: animationId,
                animationPrompt: prompt // Include the original prompt for display
            },
            animationId,
            newSession: chatSession.messages.length === 2 ? {
                _id: chatSession._id,
                title: `Animacja: ${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}`,
            } : undefined,
        });

    } catch (error) {
        console.error('[HANDLE_ANIMATION_ERROR]', error);

        // Create error message
        const errorMessage: Message = {
            role: 'assistant',
            content: 'Przepraszam, wystąpił błąd podczas generowania animacji. Proszę spróbować ponownie.'
        };

        // Add error message to chat history
        chatSession.messages.push(errorMessage);
        await chatSession.save();

        // Return error response
        return NextResponse.json({
            type: 'chat',
            message: errorMessage
        });
    }
}
