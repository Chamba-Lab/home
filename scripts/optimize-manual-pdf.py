"""Optimiza el PDF de un manual para la web.

Los PDFs exportados desde Chrome ("Guardar como PDF") traen fuentes Type 3,
capas raster a página completa, degradados y máscaras alfa por diapositiva:
pesan decenas de MB y se traban al renderizarlos. Este script rasteriza cada
página a un JPEG, coloca encima el texto original como capa invisible (se sigue
pudiendo seleccionar y buscar), conserva los enlaces y linealiza el resultado
(Fast Web View) si `qpdf` está instalado.

Uso:
    pip install pymupdf
    python scripts/optimize-manual-pdf.py entrada.pdf salida.pdf [--scale 2] [--quality 80]

`--scale 2` rinde 1920 px de ancho en una página de 960 pt. Con 1.5 pesa menos
y pierde nitidez al hacer zoom.
"""

import argparse
import os
import shutil
import subprocess
import sys

import pymupdf


def squash(doc: pymupdf.Document) -> str:
    """Texto sin espacios: así la comparación no depende de cómo se divide en palabras."""
    return "".join("".join(page.get_text().split()) for page in doc)


def optimize(src: str, dst: str, scale: float, quality: int) -> None:
    font = pymupdf.Font("helv")
    source = pymupdf.open(src)
    out = pymupdf.open()
    matrix = pymupdf.Matrix(scale, scale)

    for page in source:
        rect = page.rect
        jpeg = page.get_pixmap(matrix=matrix, alpha=False).tobytes(
            "jpeg", jpg_quality=quality
        )
        new = out.new_page(width=rect.width, height=rect.height)
        new.insert_image(rect, stream=jpeg)

        # Texto invisible (modo 3) ajustado al ancho de cada palabra original.
        for x0, y0, x1, y1, word, *_ in page.get_text("words"):
            height = y1 - y0
            size = max(height * 0.8, 1)
            natural = font.text_length(word, fontsize=size)
            if natural <= 0 or x1 - x0 <= 0:
                continue
            origin = pymupdf.Point(x0, y1 - height * 0.2)
            writer = pymupdf.TextWriter(new.rect)
            writer.append(origin, word, font=font, fontsize=size)
            writer.write_text(
                new,
                render_mode=3,
                morph=(origin, pymupdf.Matrix((x1 - x0) / natural, 1)),
            )

        for link in page.get_links():
            if link.get("kind") == pymupdf.LINK_URI:
                new.insert_link({"kind": pymupdf.LINK_URI, "from": link["from"], "uri": link["uri"]})

    out.set_metadata({**source.metadata, "producer": "optimize-manual-pdf"})
    out.save(dst, garbage=4, deflate=True)

    expected, actual = (squash(pymupdf.open(path)) for path in (src, dst))
    if expected != actual:
        sys.exit(f"El texto no coincide: {len(expected)} caracteres en la entrada, {len(actual)} en la salida")


def linearize(path: str) -> bool:
    qpdf = shutil.which("qpdf")
    if not qpdf:
        return False
    tmp_path = path + ".tmp"
    # qpdf sale con 3 si solo hubo avisos; el archivo sigue siendo válido.
    result = subprocess.run([qpdf, "--linearize", path, tmp_path])
    if result.returncode in (0, 3):
        os.replace(tmp_path, path)
        return True
    os.remove(tmp_path)
    return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("input")
    parser.add_argument("output")
    parser.add_argument("--scale", type=float, default=2)
    parser.add_argument("--quality", type=int, default=80)
    args = parser.parse_args()

    optimize(args.input, args.output, args.scale, args.quality)
    linear = linearize(args.output)
    mb = os.path.getsize(args.output) / 1e6
    print(f"{args.output}: {mb:.1f} MB{'' if linear else ' (sin linealizar: qpdf no está instalado)'}")
