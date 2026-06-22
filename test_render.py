#!/usr/bin/env python3
"""
Test matplotlib animation rendering
"""

import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend

import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np
import sys
import os

print("Testing matplotlib animation rendering...")

# Set up figure and axis
fig, ax = plt.subplots(figsize=(10, 6))

# Animation parameters
FPS = 30
DURATION = 2  # Short test
TOTAL_FRAMES = FPS * DURATION

def animate(frame):
    """Simple sine wave animation"""
    ax.clear()
    
    t = frame / FPS
    x = np.linspace(0, 4 * np.pi, 100)
    y = np.sin(x + t * 2)
    
    ax.plot(x, y, 'b-', linewidth=2)
    ax.set_xlim(0, 4 * np.pi)
    ax.set_ylim(-1.5, 1.5)
    ax.set_title(f'Sine Wave Animation - Frame {frame}/{TOTAL_FRAMES}')
    ax.grid(True, alpha=0.3)

print(f"Creating animation with {TOTAL_FRAMES} frames at {FPS} fps...")
anim = animation.FuncAnimation(fig, animate, frames=TOTAL_FRAMES, 
                             interval=1000/FPS, blit=False, repeat=False)

print("Saving animation...")
try:
    # Try ffmpeg first
    Writer = animation.writers['ffmpeg']
    writer = Writer(fps=FPS, metadata=dict(artist='Test'), bitrate=1800)
    anim.save('test_animation.mp4', writer=writer)
    print("SUCCESS: Animation saved as test_animation.mp4")
except Exception as e:
    print(f"FFMPEG failed: {e}")
    # Fallback to GIF
    try:
        anim.save('test_animation.gif', writer='pillow', fps=FPS)
        print("SUCCESS: Animation saved as test_animation.gif")
    except Exception as e2:
        print(f"FAILED: {e2}")
        sys.exit(1)

plt.close()
print("Test complete!")
