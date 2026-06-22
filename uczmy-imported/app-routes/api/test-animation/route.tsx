import { NextRequest, NextResponse } from 'next/server';
import { generateMatplotlibScene } from '@/lib/animate';
import Animation from '@/models/animation';
import { connectMongoDB } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
    try {
        // Connect to the database
        await connectMongoDB();

        // Create a new test animation
        const newAnimation = new Animation({
            prompt: "Test animation for debugging purposes",
            userId: "test",
            status: "pending",
            createdAt: new Date(),
        });

        await newAnimation.save();

        // Generate matplotlib code instead of rendering
        const animationId = newAnimation._id.toString();
        console.log(`Generating matplotlib code for test animation with ID: ${animationId}`);

        try {
            // Generate matplotlib code using Gemini
            const matplotlibCode = await generateMatplotlibScene("Test animation");

            // Update the animation with the generated code
            const updatedAnimation = await Animation.findByIdAndUpdate(
                animationId,
                {
                    manimCode: matplotlibCode,
                    status: 'completed'
                },
                { new: true }
            );

            return NextResponse.json({
                success: true,
                message: "Matplotlib code generated successfully",
                animationId,
                status: updatedAnimation?.status,
                code: matplotlibCode
            });
        } catch (renderError) {
            console.error("Animation rendering failed:", renderError);
            return NextResponse.json({
                success: false,
                message: `Animation rendering failed: ${renderError instanceof Error ? renderError.message : "Unknown error"}`,
                animationId
            }, { status: 500 });
        }
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({
            success: false,
            message: `API error: ${error instanceof Error ? error.message : "Unknown error"}`
        }, { status: 500 });
    }
}
