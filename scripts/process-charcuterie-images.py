#!/usr/bin/env python3
"""Turn downloaded ingredient photos into board-ready cutouts.

A rectangular photo dropped on a wooden board reads as a sticker. What makes it
read as food is the silhouette, so this strips the background, trims to the
subject, and squares the result — then ZoneFill clips it to the motif shape
(rose, wedge, shingle) so the same almond photo becomes a scatter in one zone
and a fan in another.

Background removal is a flood fill inward from the border, which is the right
tool here because CC0 food photography overwhelmingly uses a plain sweep. Photos
with a busy background won't key cleanly; those are reported so they can be
swapped rather than silently shipped looking like a torn magazine clipping.

Usage: python3 scripts/process-charcuterie-images.py
"""
import json
import os

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = os.getcwd()
SRC = os.path.join(ROOT, "public/charcuterie/items")
DATA = os.path.join(ROOT, "data/charcuterie-images")
SIZE = 512
# How far a pixel can drift from the border colour and still count as background.
TOL = 34
# Below this fraction of pixels removed, the background wasn't plain enough to key.
MIN_REMOVED = 0.04
# Above this, we probably ate the subject too.
MAX_REMOVED = 0.93


# A colour no photograph contains, used to mark what the fill reached.
MAGIC = (1, 254, 3)


def key_background(img: Image.Image) -> tuple[Image.Image, float]:
    """Flood fill inward from the corners and midpoints of each edge.

    Seeding from eight points rather than one catches a background split by the
    subject — a wedge of cheese touching the top edge leaves left and right as
    separate regions that a single corner seed would never reach.
    """
    rgb = img.convert("RGB")
    w, h = rgb.size
    seeds = [
        (0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
        (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2),
    ]
    for xy in seeds:
        if rgb.getpixel(xy) == MAGIC:
            continue
        ImageDraw.floodfill(rgb, xy, MAGIC, thresh=TOL)

    # Build the alpha channel with whole-image ops rather than a per-pixel loop —
    # 152 photos at 640x640 is 60M iterations in Python and seconds in C.
    diff = ImageChops.difference(rgb, Image.new("RGB", (w, h), MAGIC)).convert("L")
    alpha = diff.point(lambda v: 0 if v < 8 else 255)
    removed = alpha.histogram()[0] / float(w * h)
    # Feather a touch so the cutout doesn't have a cookie-cutter edge.
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))

    out = img.convert("RGBA")
    out.putalpha(alpha)
    return out, removed


def square(img: Image.Image, size: int) -> Image.Image:
    """Trim to the subject, then letterbox square so every item scales alike."""
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    w, h = img.size
    scale = size / float(max(w, h))
    img = img.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(img, ((size - img.width) // 2, (size - img.height) // 2))
    return canvas


def main() -> None:
    manifest = json.load(open(os.path.join(DATA, "manifest.json")))
    by_id = {m["id"]: m for m in manifest}
    ok, flagged = [], []

    for name in sorted(os.listdir(SRC)):
        if not name.endswith(".raw"):
            continue
        item_id = name[:-4]
        path = os.path.join(SRC, name)
        try:
            img = Image.open(path)
            img.load()
        except Exception as e:
            flagged.append({"id": item_id, "reason": f"unreadable: {e}"})
            continue

        # Downscale before the flood fill — it's per-pixel and photos arrive large.
        img.thumbnail((640, 640), Image.LANCZOS)
        try:
            keyed, frac = key_background(img)
        except Exception as e:
            flagged.append({"id": item_id, "reason": f"keying failed: {e}"})
            continue

        rec = by_id.get(item_id, {})
        if frac < MIN_REMOVED:
            flagged.append({**rec, "id": item_id, "reason": f"busy background — only {frac:.0%} keyed"})
        elif frac > MAX_REMOVED:
            flagged.append({**rec, "id": item_id, "reason": f"over-keyed — {frac:.0%} removed, subject likely eaten"})
        else:
            ok.append(item_id)

        square(keyed, SIZE).save(os.path.join(SRC, f"{item_id}.png"), "PNG", optimize=True)
        os.remove(path)

    json.dump(sorted(ok), open(os.path.join(DATA, "processed.json"), "w"), indent=1)
    prev = []
    rp = os.path.join(DATA, "review.json")
    if os.path.exists(rp):
        prev = json.load(open(rp))
    json.dump(prev + flagged, open(rp, "w"), indent=1)
    print(f"cutouts: {len(ok)} clean, {len(flagged)} flagged for review")


if __name__ == "__main__":
    main()
