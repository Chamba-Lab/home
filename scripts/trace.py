"""Vectoriza la mascota por capas de color (silueta, crema, destello) con potrace.

Uso: python3 -I scripts/trace.py <entrada.png> <salida.svg>
"""
import sys

import numpy as np
import potrace
from PIL import Image, ImageFilter

SRC, OUT = sys.argv[1], sys.argv[2]
UP = 2  # sobremuestreo para que el umbral caiga entre píxeles y el borde salga suave

# Colores finales (tokens de marca)
BODY = "#080D1A"   # --color-bg
CREAM = "#FCF6E8"  # crema medido en el PNG
SHEEN = "#94A3B8"  # --color-muted, con opacidad, sobre el cuerpo
SHEEN_OPACITY = "0.35"

im = Image.open(SRC).convert("RGBA")
big = im.resize((im.width * UP, im.height * UP), Image.LANCZOS)
a = np.array(big).astype(np.float32)
rgb, alpha = a[..., :3], a[..., 3]

# 1) silueta: alfa > 50%
sil = alpha > 127

# 2) crema: luminancia alta dentro de la silueta
lum = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
cream = sil & (lum > 128)

# 3) destello: cerca del azul grisáceo, y solo si es una mancha (no un borde de antialias)
slate_rgb = np.array([56, 68, 90], dtype=np.float32)
dist = np.sqrt(((rgb - slate_rgb) ** 2).sum(axis=-1))
sheen_raw = sil & (dist < 42)
m = Image.fromarray((sheen_raw * 255).astype(np.uint8))
m = m.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.MaxFilter(7))  # apertura: quita líneas finas
sheen = np.array(m) > 127


def to_path(mask, turd=60, alphamax=1.0, opttol=0.6):
    # potracer interpreta True como "fondo" con arrays booleanos: se invierte para trazar la forma
    bm = potrace.Bitmap(~mask)
    pl = bm.trace(
        turdsize=turd,
        turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
        alphamax=alphamax,
        opticurve=True,
        opttolerance=opttol,
    )
    s = 1.0 / UP
    parts = []
    for curve in pl:
        p = curve.start_point
        parts.append(f"M{p.x * s:.2f},{p.y * s:.2f}")
        for seg in curve.segments:
            if seg.is_corner:
                c, e = seg.c, seg.end_point
                parts.append(f"L{c.x * s:.2f},{c.y * s:.2f}L{e.x * s:.2f},{e.y * s:.2f}")
            else:
                c1, c2, e = seg.c1, seg.c2, seg.end_point
                parts.append(
                    f"C{c1.x * s:.2f},{c1.y * s:.2f} {c2.x * s:.2f},{c2.y * s:.2f} {e.x * s:.2f},{e.y * s:.2f}"
                )
        parts.append("z")
    return "".join(parts)


ys, xs = np.where(sil)
x0, x1 = xs.min() / UP, xs.max() / UP
y0, y1 = ys.min() / UP, ys.max() / UP
print(f"bbox silueta: x {x0:.0f}-{x1:.0f}  y {y0:.0f}-{y1:.0f}  ({x1 - x0:.0f} x {y1 - y0:.0f})")

d_body, d_cream, d_sheen = to_path(sil), to_path(cream), to_path(sheen, turd=30)
print(f"largo d: cuerpo={len(d_body)}  crema={len(d_cream)}  destello={len(d_sheen)}")

svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {im.width} {im.height}">
<path id="body" fill="{BODY}" fill-rule="evenodd" d="{d_body}"/>
<path id="face" fill="{CREAM}" fill-rule="evenodd" d="{d_cream}"/>
<path id="sheen" fill="{SHEEN}" fill-opacity="{SHEEN_OPACITY}" fill-rule="evenodd" d="{d_sheen}"/>
</svg>
"""
open(OUT, "w").write(svg)
print("escrito", OUT, f"{len(svg) / 1024:.0f} KB")
