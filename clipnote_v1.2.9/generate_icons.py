#!/usr/bin/env python3
"""Generate ClipNote extension icons in multiple sizes."""

from PIL import Image, ImageDraw, ImageFont
import os

SIZES = [16, 32, 48, 128]
OUTPUT_DIR = "icons"

# Colors
BG = "#3b82f6"        # Primary blue
FG = "#ffffff"        # White paper
ACCENT = "#fbbf24"    # Yellow pin
SHADOW = "#1d4ed8"    # Darker blue for depth

os.makedirs(OUTPUT_DIR, exist_ok=True)


def draw_rounded_rect(draw, xy, radius, fill):
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill)


def create_icon(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Scale factors
    s = size / 128.0
    r = lambda v: int(v * s)

    # Background circle
    margin = r(4)
    draw.ellipse([margin, margin, size - margin, size - margin], fill=BG)

    # Paper/note shape
    paper_margin = r(28)
    paper_rect = [
        paper_margin,
        paper_margin + r(10),
        size - paper_margin,
        size - paper_margin + r(6)
    ]
    corner = r(10)
    draw.rounded_rectangle(paper_rect, radius=corner, fill=FG)

    # Folded corner
    fold_size = r(22)
    x1 = paper_rect[2]
    y1 = paper_rect[1]
    triangle = [
        (x1 - fold_size, y1),
        (x1, y1 + fold_size),
        (x1, y1)
    ]
    draw.polygon(triangle, fill="#e2e8f0")

    # Lines on paper
    line_color = "#94a3b8"
    line_y_start = paper_rect[1] + r(24)
    line_height = r(14)
    line_margin = r(12)
    for i in range(4):
        y = line_y_start + i * line_height
        x_start = paper_rect[0] + line_margin
        x_end = paper_rect[2] - line_margin
        # Last line shorter
        if i == 3:
            x_end -= r(20)
        draw.rounded_rectangle([x_start, y, x_end, y + r(5)], radius=r(3), fill=line_color)

    # Pin / clip
    pin_radius = r(10)
    pin_center = (paper_rect[0] + r(18), paper_rect[1] - r(4))
    draw.ellipse([
        pin_center[0] - pin_radius,
        pin_center[1] - pin_radius,
        pin_center[0] + pin_radius,
        pin_center[1] + pin_radius
    ], fill=ACCENT, outline="#d97706", width=r(2))

    return img


for sz in SIZES:
    icon = create_icon(sz)
    icon.save(os.path.join(OUTPUT_DIR, f"icon{sz}.png"), "PNG")
    print(f"Generated icon{sz}.png")

print("Done.")
