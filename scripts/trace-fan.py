"""Create an editable, layered SVG from the approved TESSEN fan artwork.

Run with `python3 scripts/trace-fan.py`. Requires Pillow. This is a design
source tool; the website build uses the generated SVG without Python.
"""

from collections import defaultdict, deque
from math import atan2, ceil, degrees, floor, hypot
from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Assets/Logo/icon_4.webp"
DESTINATION = ROOT / "Assets/Logo/fan.svg"


def components(mask, width, height):
    remaining = set(mask)
    result = []
    while remaining:
        start = remaining.pop()
        group = {start}
        queue = deque([start])
        while queue:
            x, y = queue.popleft()
            for neighbor in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if neighbor in remaining:
                    remaining.remove(neighbor)
                    group.add(neighbor)
                    queue.append(neighbor)
        if len(group) > 100:
            result.append(group)
    return sorted(result, key=len, reverse=True)


def outline(pixels):
    edges = defaultdict(list)
    for x, y in pixels:
        if (x, y - 1) not in pixels:
            edges[(x, y)].append((x + 1, y))
        if (x + 1, y) not in pixels:
            edges[(x + 1, y)].append((x + 1, y + 1))
        if (x, y + 1) not in pixels:
            edges[(x + 1, y + 1)].append((x, y + 1))
        if (x - 1, y) not in pixels:
            edges[(x, y + 1)].append((x, y))

    loops = []
    while edges:
        start = min(edges)
        current = start
        loop = [start]
        while True:
            next_point = edges[current].pop()
            if not edges[current]:
                del edges[current]
            if next_point == start:
                break
            loop.append(next_point)
            current = next_point
        loops.append(loop)
    return max(loops, key=lambda loop: abs(area(loop)))


def area(points):
    return sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(points, points[1:] + points[:1])) / 2


def simplify_open(points, tolerance=1.35):
    if len(points) < 3:
        return points
    x1, y1 = points[0]
    x2, y2 = points[-1]
    denominator = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
    distances = [
        abs((x2 - x1) * (y1 - y) - (x1 - x) * (y2 - y1)) / denominator
        if denominator else ((x - x1) ** 2 + (y - y1) ** 2) ** 0.5
        for x, y in points[1:-1]
    ]
    if not distances or max(distances) <= tolerance:
        return [points[0], points[-1]]
    split = distances.index(max(distances)) + 1
    return simplify_open(points[: split + 1], tolerance)[:-1] + simplify_open(points[split:], tolerance)


def path_data(pixels, pivot):
    points = outline(pixels)
    pivot_index = min(range(len(points)), key=lambda i: (points[i][0] - pivot[0]) ** 2 + (points[i][1] - pivot[1]) ** 2)
    points = points[pivot_index:] + points[:pivot_index]
    farthest = max(range(1, len(points)), key=lambda i: (points[i][0] - points[0][0]) ** 2 + (points[i][1] - points[0][1]) ** 2)
    reduced = simplify_open(points[: farthest + 1])[:-1] + simplify_open(points[farthest:] + points[:1])[:-1]
    path = "M" + " ".join(f"{x},{y}" for x, y in reduced) + "Z"
    length = ceil(sum(hypot(x2 - x1, y2 - y1) for (x1, y1), (x2, y2) in zip(reduced, reduced[1:] + reduced[:1])))
    return path, length


def center(pixels):
    return (sum(x for x, _ in pixels) / len(pixels), sum(y for _, y in pixels) / len(pixels))


def reveal_rect(pixels, pivot):
    """A wide radial window that travels from the diamond to a sector's tip."""
    cx, cy = center(pixels)
    dx, dy = cx - pivot[0], cy - pivot[1]
    distance = hypot(dx, dy)
    ux, uy = dx / distance, dy / distance
    vx, vy = -uy, ux
    along = [(x - pivot[0]) * ux + (y - pivot[1]) * uy for x, y in pixels]
    across = [(x - pivot[0]) * vx + (y - pivot[1]) * vy for x, y in pixels]
    x = floor(min(along) - 4)
    y = floor(min(across) - 4)
    width = ceil(max(along) + 4 - x)
    height = ceil(max(across) + 4 - y)
    angle = degrees(atan2(uy, ux))
    return x, y, width, height, angle


def main():
    image = Image.open(SOURCE).convert("RGBA")
    width, height = image.size
    if (width, height) != (512, 512):
        raise ValueError("Expected the approved 512x512 fan artwork")
    white, pink = set(), set()
    for y in range(height):
        for x in range(width):
            r, g, b, alpha = image.getpixel((x, y))
            if alpha < 128:
                continue
            if min(r, g, b) > 170:
                white.add((x, y))
            elif r > 150 and g < 110 and b < 160:
                pink.add((x, y))

    white_parts = components(white, width, height)
    pink_parts = components(pink, width, height)
    if len(white_parts) != 10 or len(pink_parts) != 1:
        raise ValueError(f"Unexpected artwork segmentation: {len(white_parts)} white, {len(pink_parts)} pink")
    pink_pixels = pink_parts[0]
    left = min(x for x, _ in pink_pixels) - 0.5
    right = max(x for x, _ in pink_pixels) + 0.5
    top = min(y for _, y in pink_pixels) - 0.5
    bottom = max(y for _, y in pink_pixels) + 0.5
    middle_x = (left + right) / 2
    middle_y = (top + bottom) / 2
    pivot = (middle_x, middle_y)
    blades = sorted(white_parts[:8], key=lambda pixels: center(pixels)[0])
    details = sorted(white_parts[8:], key=lambda pixels: center(pixels)[0])
    names = ("left-lower", "left-outer", "left-middle", "left-inner", "right-inner", "right-middle", "right-outer", "right-lower")
    blade_paths = [(name, *path_data(pixels, pivot)) for name, pixels in zip(names, blades)]
    detail_paths = [(name, *path_data(pixels, pivot)) for name, pixels in zip(("left", "right"), details)]
    reveal_specs = {name: reveal_rect(pixels, pivot) for name, pixels in zip(names, blades)}
    reveal_specs.update({name: reveal_rect(pixels, pivot) for name, pixels in zip(("left", "right"), details)})
    # The raster edges are slightly irregular. Keep the original bounds while
    # restoring the intended four-point symmetry of the diamond.
    corner = 3
    diamond_path = (
        f"M{middle_x-corner:g},{top+corner:g} Q{middle_x:g},{top:g} {middle_x+corner:g},{top+corner:g} "
        f"L{right-corner:g},{middle_y-corner:g} Q{right:g},{middle_y:g} {right-corner:g},{middle_y+corner:g} "
        f"L{middle_x+corner:g},{bottom-corner:g} Q{middle_x:g},{bottom:g} {middle_x-corner:g},{bottom-corner:g} "
        f"L{left+corner:g},{middle_y+corner:g} Q{left:g},{middle_y:g} {left+corner:g},{middle_y-corner:g}Z"
    )
    parts = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="fan-title">',
        '  <title id="fan-title">Знак TESSEN — веер</title>',
        '  <defs>',
    ]
    for name, _, _ in blade_paths + detail_paths:
        tier = "detail" if name in ("left", "right") else name.split("-")[1]
        x, y, reveal_width, reveal_height, angle = reveal_specs[name]
        parts.append(f'    <clipPath id="fan-reveal-{name}" clipPathUnits="userSpaceOnUse"><rect class="fan-reveal fan-reveal-{tier}" x="{x}" y="{y}" width="{reveal_width}" height="{reveal_height}" transform="translate({middle_x:g} {middle_y:g}) rotate({angle:.3f})" style="--reveal-width:{reveal_width}px"/></clipPath>')
    parts.append(f'    <clipPath id="fan-reveal-diamond" clipPathUnits="userSpaceOnUse"><circle class="fan-diamond-reveal" cx="{middle_x:g}" cy="{middle_y:g}" r="330"/></clipPath>')
    parts.extend((
        '  </defs>',
        '  <g class="fan-outline" opacity="0" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">',
    ))
    for name, path, length in blade_paths:
        parts.append(f'    <path class="fan-trace fan-trace-{name}" style="--trace-length:{length}" d="{path}"/>')
    for name, path, length in detail_paths:
        parts.append(f'    <path class="fan-trace fan-trace-detail" style="--trace-length:{length}" d="{path}"/>')
    parts.extend((
        '  </g>',
        f'  <path class="fan-diamond-outline" opacity="0" fill="none" stroke="#ee1349" stroke-width="1.5" stroke-linejoin="round" d="{diamond_path}"/>',
        '  <g class="fan-fill" fill="#fff">',
    ))
    for name, path, _ in blade_paths:
        parts.append(f'    <path id="fan-{name}" clip-path="url(#fan-reveal-{name})" d="{path}"/>')
    for name, path, _ in detail_paths:
        parts.append(f'    <path id="fan-detail-{name}" clip-path="url(#fan-reveal-{name})" d="{path}"/>')
    parts.extend((
        '  </g>',
        f'  <path class="fan-diamond" fill="#ee1349" clip-path="url(#fan-reveal-diamond)" d="{diamond_path}"/>',
        '</svg>',
    ))
    DESTINATION.write_text("\n".join(parts) + "\n")
    print(f"Wrote {DESTINATION.relative_to(ROOT)}: 8 blades, 2 details, 1 diamond")


if __name__ == "__main__":
    main()
