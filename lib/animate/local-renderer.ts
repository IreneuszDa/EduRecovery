import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import util from 'util';

const execPromise = util.promisify(exec);

/**
 * Render an animation locally using Python matplotlib
 * This creates a simple video file from the generated matplotlib code
 */
export async function renderAnimationLocally(
    animationId: string,
    matplotlibCode: string,
    prompt: string
): Promise<string> {
    console.log(`[LOCAL_RENDERER] ${animationId} - Starting local video rendering...`);

    try {
        // Create temporary directory for this animation
        const tempId = uuidv4();
        const tempDir = path.join(process.cwd(), 'tmp', tempId);
        await fs.mkdir(tempDir, { recursive: true });
        console.log(`[LOCAL_RENDERER] ${animationId} - Created temp directory: ${tempDir}`);

        // Create a complete Python script that renders a video
        const pythonScript = createRenderingScript(matplotlibCode, prompt);
        const pythonFilePath = path.join(tempDir, 'render_animation.py');

        console.log(`[LOCAL_RENDERER] ${animationId} - Writing Python script to: ${pythonFilePath}`);
        await fs.writeFile(pythonFilePath, pythonScript);

        // Execute the Python script to create the video
        console.log(`[LOCAL_RENDERER] ${animationId} - Executing Python rendering script...`);
        const startTime = Date.now();

        const { stdout, stderr } = await execPromise(`python "${pythonFilePath}"`, {
            cwd: tempDir,
            timeout: 60000 // 60 second timeout
        });

        const endTime = Date.now();
        console.log(`[LOCAL_RENDERER] ${animationId} - Python execution completed in ${endTime - startTime}ms`);

        // Save stdout and stderr to files for debugging
        const stdoutPath = path.join(tempDir, 'stdout.txt');
        const stderrPath = path.join(tempDir, 'stderr.txt');
        await fs.writeFile(stdoutPath, stdout);
        await fs.writeFile(stderrPath, stderr);

        if (stderr && !stderr.includes('matplotlib')) {
            console.warn(`[LOCAL_RENDERER] ${animationId} - Python stderr:`, stderr);
        }

        console.log(`[LOCAL_RENDERER] ${animationId} - Python stdout:`, stdout);

        // Check if the video file was created and is valid
        const videoPath = path.join(tempDir, 'animation.mp4');
        try {
            const stats = await fs.stat(videoPath);
            if (stats.size > 1000) { // Video should be at least 1KB
                console.log(`[LOCAL_RENDERER] ${animationId} - Video file created successfully (${stats.size} bytes)`);

                // Return the relative path that can be served by the API
                const relativeVideoPath = `/api/animate/videos/${tempId}/animation.mp4`;
                console.log(`[LOCAL_RENDERER] ${animationId} - Video available at: ${relativeVideoPath}`);

                return relativeVideoPath;
            } else {
                throw new Error(`Video file too small (${stats.size} bytes) - likely corrupted`);
            }
        } catch (error) {
            // If video not found or invalid, log the debug output paths
            console.error(`[LOCAL_RENDERER] ${animationId} - Video file issue:`, error);
            console.error(`[LOCAL_RENDERER] ${animationId} - See stdout.txt and stderr.txt in: ${tempDir}`);
            console.error(`[LOCAL_RENDERER] ${animationId} - Python script saved as: ${pythonFilePath}`);
            throw new Error(`Video rendering issue: ${error instanceof Error ? error.message : 'Unknown error'}. Check debug output in temp directory.`);
        }

    } catch (error) {
        console.error(`[LOCAL_RENDERER] ${animationId} - Rendering failed:`, error);
        throw new Error(`Video rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Create a complete Python script for rendering animations
 */
function createRenderingScript(userCode: string, prompt: string): string {
    // Check if the user code is a complete standalone script
    const isStandaloneScript = userCode.includes('fig,') &&
        userCode.includes('plt.subplots') &&
        (userCode.includes('FuncAnimation') || userCode.includes('animation.save'));

    if (isStandaloneScript) {
        // For standalone scripts, modify them to save the animation instead of just showing it
        // Replace plt.show() with animation saving code
        let modifiedCode = userCode;

        // Remove plt.show() calls
        modifiedCode = modifiedCode.replace(/plt\.show\(\)\s*/g, '');

        // If the code creates a FuncAnimation but doesn't save it, add save code
        if (userCode.includes('FuncAnimation') && !userCode.includes('ani.save') && !userCode.includes('anim.save') && !userCode.includes('.save(')) {
            // Find the animation variable name (ani, anim, animation, etc.)
            const animationMatches = modifiedCode.match(/(\w+)\s*=\s*animation\.FuncAnimation/g);
            let animVarName = 'ani';

            if (animationMatches && animationMatches.length > 0) {
                // Get the last animation variable (in case there are multiple)
                const lastMatch = animationMatches[animationMatches.length - 1];
                const varMatch = lastMatch.match(/(\w+)\s*=/);
                if (varMatch) {
                    animVarName = varMatch[1];
                }
            }

            // Add saving code at the end
            modifiedCode += `

# Save the animation
try:
    print(f"Saving animation using variable: ${animVarName}")
    Writer = animation.writers['ffmpeg']
    writer = Writer(fps=30, metadata=dict(artist='Uczmy.pl'), bitrate=1800)
    ${animVarName}.save('animation.mp4', writer=writer)
    print("Animation saved as MP4")
except Exception as save_error:
    print(f"Error saving with ffmpeg: {save_error}")
    try:
        ${animVarName}.save('animation.gif', writer='pillow', fps=10)
        print("Animation saved as GIF instead")
    except Exception as gif_error:
        print(f"Error saving animation: {gif_error}")
        # Create a simple static fallback
        import matplotlib.pyplot as plt
        fig, ax = plt.subplots(figsize=(8, 6))
        ax.text(0.5, 0.5, 'Animation Export Failed\\nCode executed successfully', 
                ha='center', va='center', transform=ax.transAxes,
                fontsize=14, bbox=dict(boxstyle="round,pad=0.3", facecolor="lightblue"))
        plt.savefig('animation_fallback.png', dpi=100, bbox_inches='tight')
        plt.close()
        
        # Convert to simple video
        fig, ax = plt.subplots(figsize=(8, 6))
        img = plt.imread('animation_fallback.png')
        im = ax.imshow(img)
        ax.axis('off')
        
        def static_animate(frame):
            return [im]
        
        fallback_anim = animation.FuncAnimation(fig, static_animate, frames=30, interval=100, blit=True)
        fallback_anim.save('animation.mp4', writer='pillow', fps=10)
        print("Created fallback animation")

plt.close()`;
        }

        return `#!/usr/bin/env python3
"""
Matplotlib Animation Renderer
Generated for: ${prompt.replace(/"/g, '\\"')}
"""

import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend

try:
    # Execute the complete user-generated matplotlib script
${modifiedCode.split('\n').map(line => '    ' + line).join('\n')}
    
    print("Animation rendering completed successfully!")
    
except Exception as e:
    print(f"Error in animation script: {e}")
    import traceback
    traceback.print_exc()
    
    # Create a simple fallback animation
    import matplotlib.pyplot as plt
    import numpy as np
    
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.text(0.5, 0.5, f'Animation Error\\n{str(e)[:100]}...', 
            ha='center', va='center', transform=ax.transAxes,
            fontsize=12, bbox=dict(boxstyle="round,pad=0.3", facecolor="lightcoral"))
    ax.set_title('${prompt.replace(/"/g, '\\"')}')
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    
    # Save as static image converted to video
    plt.savefig('error_frame.png', dpi=100, bbox_inches='tight')
    plt.close()
    
    # Convert static image to short video using matplotlib
    import matplotlib.animation as animation
    
    fig, ax = plt.subplots(figsize=(10, 6))
    img = plt.imread('error_frame.png')
    im = ax.imshow(img)
    ax.axis('off')
    
    def animate_static(frame):
        return [im]
    
    anim = animation.FuncAnimation(fig, animate_static, frames=30, interval=100, blit=True)
    
    try:
        Writer = animation.writers['ffmpeg']
        writer = Writer(fps=10, metadata=dict(artist='Uczmy.pl'), bitrate=1800)
        anim.save('animation.mp4', writer=writer)
        print("Error animation saved as MP4")
    except:
        anim.save('animation.gif', writer='pillow', fps=10)
        print("Error animation saved as GIF")
    
    plt.close()
`;
    } else {
        // For code snippets, use the frame-by-frame wrapper
        return `#!/usr/bin/env python3
"""
Matplotlib Animation Renderer
Generated for: ${prompt.replace(/"/g, '\\"')}
"""

import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend

import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np
import sys
import os

# Set up figure and axis
plt.style.use('default')
fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#f8f9fa')

# Animation parameters
FPS = 30
DURATION = 5  # seconds
TOTAL_FRAMES = FPS * DURATION

def animate(frame):
    """Animation function called for each frame"""
    ax.clear()
    
    # Calculate time for smooth animations
    t = frame / FPS
    progress = frame / TOTAL_FRAMES
    
    try:
        # Set default styling
        ax.set_facecolor('#ffffff')
        ax.grid(True, alpha=0.3)
        
        # Execute user-generated code
        # Replace common variables that might be in the generated code
        i = frame
        time = t
        
        # Execute the user's matplotlib code
        exec('''
${userCode.replace(/'/g, "\\'")}
        ''', {
            'ax': ax,
            'plt': plt,
            'np': np,
            'i': i,
            'frame': frame,
            't': t,
            'time': time,
            'progress': progress,
            'TOTAL_FRAMES': TOTAL_FRAMES,
            'FPS': FPS
        })
        
    except Exception as e:
        # Fallback: show error message and basic animation
        ax.clear()
        ax.set_xlim(-1, 1)
        ax.set_ylim(-1, 1)
        ax.text(0, 0.5, 'Animation Code Error', ha='center', va='center', 
                fontsize=16, fontweight='bold', color='red')
        ax.text(0, 0, f'Error: {str(e)[:50]}...', ha='center', va='center', 
                fontsize=10, color='red')
        ax.text(0, -0.5, f'Frame {frame}/{TOTAL_FRAMES}', ha='center', va='center', 
                fontsize=8, alpha=0.7)
        ax.set_title('${prompt.replace(/"/g, '\\"')}', fontsize=12)
        print(f"Animation error at frame {frame}: {e}")
    
    # Add frame counter (optional)
    if hasattr(ax, 'text'):
        ax.text(0.02, 0.98, f'Frame {frame}/{TOTAL_FRAMES}', 
                transform=ax.transAxes, fontsize=8, alpha=0.5, 
                verticalalignment='top')

# Create animation
print(f"Creating animation with {TOTAL_FRAMES} frames at {FPS} fps...")
anim = animation.FuncAnimation(fig, animate, frames=TOTAL_FRAMES, 
                             interval=1000/FPS, blit=False, repeat=False)

# Save animation
print("Saving animation to animation.mp4...")
try:
    # Use ffmpeg writer for better compatibility
    Writer = animation.writers['ffmpeg']
    writer = Writer(fps=FPS, metadata=dict(artist='Uczmy.pl'), bitrate=1800)
    anim.save('animation.mp4', writer=writer)
    print("Animation saved successfully!")
except Exception as e:
    print(f"Error saving with ffmpeg: {e}")
    # Fallback to pillow
    try:
        anim.save('animation.gif', writer='pillow', fps=FPS)
        print("Animation saved as GIF instead!")
    except Exception as e2:
        print(f"Error saving animation: {e2}")
        sys.exit(1)

plt.close()
print("Rendering complete!")
`;
    }
}

/**
 * Check if Python and required packages are available
 */
export async function checkPythonEnvironment(): Promise<boolean> {
    try {
        // Check Python
        await execPromise('python --version');

        // Check required packages
        await execPromise('python -c "import matplotlib, numpy; print(\'OK\')"');

        return true;
    } catch (error) {
        console.error('Python environment check failed:', error);
        return false;
    }
}

/**
 * Install required Python packages
 */
export async function setupPythonEnvironment(): Promise<void> {
    console.log('[LOCAL_RENDERER] Setting up Python environment...');

    try {
        const packages = [
            'matplotlib>=3.5.0',
            'numpy>=1.21.0',
            'pillow>=8.0.0'
        ];

        for (const pkg of packages) {
            console.log(`[LOCAL_RENDERER] Installing ${pkg}...`);
            await execPromise(`python -m pip install "${pkg}"`);
        }

        console.log('[LOCAL_RENDERER] Python environment setup complete');
    } catch (error) {
        console.error('[LOCAL_RENDERER] Failed to setup Python environment:', error);
        throw new Error('Failed to setup Python environment for video rendering');
    }
}
