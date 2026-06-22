import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectMongoDB } from '@/lib/mongodb';
import Animation from '@/models/animation';
import { generateMatplotlibScene } from '@/lib/animate';
import { renderAnimationLocally, checkPythonEnvironment } from '@/lib/animate/local-renderer';

/**
 * API route for generating and processing Manim animations
 * 
 * This endpoint handles:
 * 1. Receiving a prompt for animation
 * 2. Generating Manim Python code based on the prompt
 * 3. Rendering the animation video (or queuing it for rendering)
 * 4. Returning the animation ID or status
 */
export async function POST(req: NextRequest) {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`[ANIMATE_POST] ${requestId} - Starting animation request`);

    try {
        // Connect to the database
        console.log(`[ANIMATE_POST] ${requestId} - Connecting to MongoDB...`);
        await connectMongoDB();
        console.log(`[ANIMATE_POST] ${requestId} - MongoDB connection successful`);

        // Verify authentication
        console.log(`[ANIMATE_POST] ${requestId} - Verifying authentication...`);
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            console.log(`[ANIMATE_POST] ${requestId} - Authentication failed: No session or user`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.log(`[ANIMATE_POST] ${requestId} - Authentication successful for user: ${session.user.id}`);

        const userId = session.user.id as string;

        // Get the prompt from the request
        console.log(`[ANIMATE_POST] ${requestId} - Parsing request body...`);
        const { prompt } = await req.json();

        if (!prompt) {
            console.log(`[ANIMATE_POST] ${requestId} - Request validation failed: Missing prompt`);
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }
        console.log(`[ANIMATE_POST] ${requestId} - Request validation successful. Prompt length: ${prompt.length} characters`);
        console.log(`[ANIMATE_POST] ${requestId} - Prompt preview: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`);

        // Create a new animation record with pending status
        console.log(`[ANIMATE_POST] ${requestId} - Creating animation record in database...`);
        const animation = await Animation.create({
            userId,
            prompt,
            status: 'pending',
            videoUrl: ''
        });
        console.log(`[ANIMATE_POST] ${requestId} - Animation record created successfully with ID: ${animation._id}`);

        console.log(`[ANIMATE_POST] ${requestId} - Starting background animation processing for ID: ${animation._id}`);

        // Process the animation in the background
        setImmediate(async () => {
            const animationId = animation._id.toString();
            console.log(`[ANIMATE_PROCESS] ${animationId} - Background processing started`);

            try {
                // Update status to processing
                console.log(`[ANIMATE_PROCESS] ${animationId} - Updating status to 'processing'...`);
                animation.status = 'processing';
                await animation.save();
                console.log(`[ANIMATE_PROCESS] ${animationId} - Status updated to 'processing' successfully`);

                // Generate matplotlib code using Gemini
                let matplotlibCode = '';
                try {
                    console.log(`[ANIMATE_PROCESS] ${animationId} - Starting matplotlib code generation with Gemini...`);
                    const startTime = Date.now();
                    matplotlibCode = await generateMatplotlibScene(prompt);
                    const endTime = Date.now();
                    console.log(`[ANIMATE_PROCESS] ${animationId} - Matplotlib code generation successful in ${endTime - startTime}ms`);
                    console.log(`[ANIMATE_PROCESS] ${animationId} - Generated code length: ${matplotlibCode.length} characters`);
                } catch (error) {
                    console.error(`[ANIMATE_PROCESS] ${animationId} - Matplotlib code generation failed:`, error);
                    console.error(`[ANIMATE_PROCESS] ${animationId} - Error details:`, {
                        name: error instanceof Error ? error.name : 'Unknown',
                        message: error instanceof Error ? error.message : String(error),
                        stack: error instanceof Error ? error.stack : undefined
                    });
                    matplotlibCode = '# Error generating code with AI\nprint("Failed to generate animation code")';
                    console.log(`[ANIMATE_PROCESS] ${animationId} - Using fallback code due to generation failure`);
                }

                // Update the animation with the generated code
                console.log(`[ANIMATE_PROCESS] ${animationId} - Updating animation record with generated code...`);
                animation.manimCode = matplotlibCode;

                // Try to render the video locally
                console.log(`[ANIMATE_PROCESS] ${animationId} - Attempting to render video locally...`);

                try {
                    // Check if Python environment is available
                    const pythonAvailable = await checkPythonEnvironment();

                    if (pythonAvailable) {
                        console.log(`[ANIMATE_PROCESS] ${animationId} - Python environment available, starting video rendering...`);
                        const videoUrl = await renderAnimationLocally(animationId, matplotlibCode, prompt);

                        // Success: we have a video!
                        animation.status = 'completed';
                        animation.videoUrl = videoUrl;
                        animation.errorMessage = null; // Clear any error message

                        console.log(`[ANIMATE_PROCESS] ${animationId} - Video rendering successful! Video URL: ${videoUrl}`);
                    } else {
                        throw new Error('Python environment not available');
                    }
                } catch (renderError) {
                    console.error(`[ANIMATE_PROCESS] ${animationId} - Video rendering failed:`, renderError);
                    console.error(`[ANIMATE_PROCESS] ${animationId} - Error details:`, {
                        name: renderError instanceof Error ? renderError.name : 'Unknown',
                        message: renderError instanceof Error ? renderError.message : String(renderError),
                        stack: renderError instanceof Error ? renderError.stack : undefined
                    });

                    // Fallback: mark as completed but with explanation
                    animation.status = 'completed';
                    animation.videoUrl = '';
                    animation.errorMessage = `Renderowanie wideo nie powiodło się: ${renderError instanceof Error ? renderError.message : 'Nieznany błąd'}. Kod matplotlib został wygenerowany - sprawdź logi serwera.`;
                }

                console.log(`[ANIMATE_PROCESS] ${animationId} - About to save animation with:`, {
                    status: animation.status,
                    hasVideoUrl: !!animation.videoUrl,
                    errorMessage: animation.errorMessage,
                    hasCode: !!animation.manimCode
                });

                console.log(`[ANIMATE_PROCESS] ${animationId} - Saving final animation state...`);
                await animation.save();
                console.log(`[ANIMATE_PROCESS] ${animationId} - Animation processing completed successfully`);

                // Verify the save worked
                const savedAnimation = await Animation.findById(animationId);
                console.log(`[ANIMATE_PROCESS] ${animationId} - Verification after save:`, {
                    status: savedAnimation?.status,
                    hasVideoUrl: !!savedAnimation?.videoUrl,
                    errorMessage: savedAnimation?.errorMessage,
                    hasCode: !!savedAnimation?.manimCode
                });

            } catch (error) {
                console.error(`[ANIMATE_PROCESS] ${animationId} - Critical error during animation processing:`, error);
                console.error(`[ANIMATE_PROCESS] ${animationId} - Error details:`, {
                    name: error instanceof Error ? error.name : 'Unknown',
                    message: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined
                });

                try {
                    console.log(`[ANIMATE_PROCESS] ${animationId} - Attempting to save error state to database...`);
                    animation.status = 'failed';
                    animation.errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    await animation.save();
                    console.log(`[ANIMATE_PROCESS] ${animationId} - Error state saved successfully`);
                } catch (saveError) {
                    console.error(`[ANIMATE_PROCESS] ${animationId} - Failed to save error state to database:`, saveError);
                }
            }
        });

        // Return the animation record immediately
        console.log(`[ANIMATE_POST] ${requestId} - Returning response with animation ID: ${animation._id}`);
        return NextResponse.json({
            success: true,
            animationId: animation._id,
            status: animation.status
        });

    } catch (error) {
        console.error(`[ANIMATE_POST] ${requestId} - Critical error in main request handler:`, error);
        console.error(`[ANIMATE_POST] ${requestId} - Error details:`, {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
        return NextResponse.json({ error: 'Failed to process animation request' }, { status: 500 });
    }
}

// GET route to check status of an animation
export async function GET(req: NextRequest) {
    const requestId = `get_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`[ANIMATE_GET] ${requestId} - Starting animation status check`);

    try {
        // Connect to the database
        console.log(`[ANIMATE_GET] ${requestId} - Connecting to MongoDB...`);
        await connectMongoDB();
        console.log(`[ANIMATE_GET] ${requestId} - MongoDB connection successful`);

        // Verify authentication
        console.log(`[ANIMATE_GET] ${requestId} - Verifying authentication...`);
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            console.log(`[ANIMATE_GET] ${requestId} - Authentication failed: No session or user`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.log(`[ANIMATE_GET] ${requestId} - Authentication successful for user: ${session.user.id}`);

        // Get the animation ID from URL params
        const url = new URL(req.url);
        const animationId = url.searchParams.get('id');
        console.log(`[ANIMATE_GET] ${requestId} - Requested animation ID: ${animationId}`);

        if (!animationId) {
            console.log(`[ANIMATE_GET] ${requestId} - Request validation failed: Missing animation ID`);
            return NextResponse.json({ error: 'Animation ID is required' }, { status: 400 });
        }

        // Find the animation
        console.log(`[ANIMATE_GET] ${requestId} - Searching for animation in database...`);
        const animation = await Animation.findById(animationId);

        if (!animation) {
            console.log(`[ANIMATE_GET] ${requestId} - Animation not found in database`);
            return NextResponse.json({ error: 'Animation not found' }, { status: 404 });
        }
        console.log(`[ANIMATE_GET] ${requestId} - Animation found with status: ${animation.status}`);

        // Check if user has access to this animation
        if (animation.userId !== session.user.id) {
            console.log(`[ANIMATE_GET] ${requestId} - Authorization failed: User ${session.user.id} cannot access animation owned by ${animation.userId}`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        console.log(`[ANIMATE_GET] ${requestId} - Authorization successful`);

        // Return the animation details
        const responseData = {
            id: animation._id,
            status: animation.status,
            videoUrl: animation.videoUrl || null,
            errorMessage: animation.errorMessage || null,
            manimCode: animation.manimCode || null,
            createdAt: animation.createdAt
        };
        console.log(`[ANIMATE_GET] ${requestId} - Returning animation data:`, {
            id: responseData.id,
            status: responseData.status,
            hasVideoUrl: !!responseData.videoUrl,
            hasErrorMessage: !!responseData.errorMessage,
            hasCode: !!responseData.manimCode,
            createdAt: responseData.createdAt
        });

        return NextResponse.json(responseData);

    } catch (error) {
        console.error(`[ANIMATE_GET] ${requestId} - Critical error in status check:`, error);
        console.error(`[ANIMATE_GET] ${requestId} - Error details:`, {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
        return NextResponse.json({ error: 'Failed to get animation status' }, { status: 500 });
    }
}
