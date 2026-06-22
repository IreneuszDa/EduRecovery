#!/usr/bin/env python3
"""
Test script to verify animation rendering fix
"""

import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend

import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np

print("Testing animation rendering fix...")

fig, ax = plt.subplots()
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.set_aspect('equal', adjustable='box')
ax.axis('off')

# Simple animated circle
def update(frame):
    ax.clear()
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.set_aspect('equal', adjustable='box')
    ax.axis('off')
    
    # Animate a bouncing ball
    x = 5 + 3 * np.sin(frame * 0.2)
    y = 5 + 3 * np.cos(frame * 0.3)
    
    circle = plt.Circle((x, y), 0.5, color='red')
    ax.add_patch(circle)
    
    ax.text(5, 1, f'Frame {frame}/60', ha='center', fontsize=12)
    
    return []

# Create animation
ani = animation.FuncAnimation(fig, update, frames=60, blit=False, interval=100)

# Save the animation (this is the critical fix)
try:
    Writer = animation.writers['ffmpeg']
    writer = Writer(fps=15, metadata=dict(artist='Uczmy.pl'), bitrate=1800)
    ani.save('animation.mp4', writer=writer)
    print("Animation saved as MP4 successfully!")
except Exception as save_error:
    print(f"Error saving with ffmpeg: {save_error}")
    try:
        ani.save('animation.gif', writer='pillow', fps=10)
        print("Animation saved as GIF instead!")
    except Exception as gif_error:
        print(f"Error saving animation: {gif_error}")

plt.close()
print("Animation rendering test completed!")
