import os, math

base = r"c:\Users\mohds\.gemini\antigravity\scratch\friends-florist\images"

def flower(cx, cy, size, stagger=0):
    """Circular multi-ring peony/ranunculus flower viewed from above"""
    out = []
    # rings: (radius_from_center, num_petals, petal_rx, petal_ry, angle_offset)
    rings = [
        (size*0.88, 14, size*0.11, size*0.24, stagger),
        (size*0.70, 12, size*0.10, size*0.20, stagger+15),
        (size*0.53, 10, size*0.09, size*0.17, stagger+8),
        (size*0.38, 8,  size*0.08, size*0.14, stagger+22),
        (size*0.24, 6,  size*0.07, size*0.11, stagger+5),
        (size*0.12, 5,  size*0.05, size*0.08, stagger+18),
    ]
    for r, n, rx, ry, off in rings:
        for i in range(n):
            a = i * (360/n) + off
            # petal center before rotation
            px = round(cx, 1)
            py = round(cy - r, 1)
            out.append(
                f'<ellipse cx="{px}" cy="{py:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" '
                f'transform="rotate({a:.1f},{cx},{cy})" stroke-width="0.9"/>'
            )
    # center
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{size*0.09:.1f}" stroke-width="0.9"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{size*0.04:.1f}" stroke-width="0.7"/>')
    return '\n'.join(out)

def leaf_sprig(cx, cy, angle):
    return (
        f'<g transform="translate({cx},{cy}) rotate({angle})">'
        '<path d="M0,0 Q0,-22 0,-44" stroke-width="0.8"/>'
        '<path d="M0,-44 C-14,-46 -19,-34 -14,-24 C-9,-14 0,-18 0,-44 Z" stroke-width="0.8"/>'
        '<path d="M0,-44 C12,-46 17,-34 12,-24 C7,-14 0,-18 0,-44 Z" stroke-width="0.8"/>'
        '<path d="M0,-22 C-10,-18 -14,-8 -9,-2 C-4,4 0,-6 0,-22 Z" stroke-width="0.75"/>'
        '<path d="M0,-22 C10,-18 14,-8 9,-2 C4,4 0,-6 0,-22 Z" stroke-width="0.75"/>'
        '</g>'
    )

def make_svg(stroke, opacity, path):
    W, H = 400, 400
    lines = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
        f'<g fill="none" stroke="{stroke}" stroke-linecap="round" stroke-linejoin="round" opacity="{opacity}">',
    ]

    # Main flowers placed so they tile seamlessly
    # Centre flower
    lines.append(flower(200, 200, 78, stagger=0))
    # Corner flowers (partially visible — tile edges)
    lines.append(flower(0,   0,   78, stagger=10))
    lines.append(flower(400, 0,   78, stagger=10))
    lines.append(flower(0,   400, 78, stagger=10))
    lines.append(flower(400, 400, 78, stagger=10))
    # Mid-edge flowers
    lines.append(flower(200, 0,   52, stagger=5))
    lines.append(flower(200, 400, 52, stagger=5))
    lines.append(flower(0,   200, 52, stagger=5))
    lines.append(flower(400, 200, 52, stagger=5))

    # Leaf sprigs between flowers
    for (x, y, a) in [(110,110,-20),(290,110,20),(110,290,200),(290,290,160),
                       (200,105,0),(200,295,180),(105,200,-90),(295,200,90)]:
        lines.append(leaf_sprig(x, y, a))

    lines.append('</g></svg>')
    svg = '\n'.join(lines)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f"Written: {path}")

# Pink section  — warm rose-pink strokes on #f8e6ea
make_svg("#c98fa0", "0.38", os.path.join(base, "floral-pattern-pink.svg"))
# White section — sage-green strokes on #fafafa
make_svg("#8aac8a", "0.32", os.path.join(base, "floral-pattern.svg"))
print("Done!")
