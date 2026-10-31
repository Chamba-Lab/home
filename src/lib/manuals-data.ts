// Carga de los manuales para el build: datos validados, peso real del PDF y
// portada. Falla si falta un archivo, para no publicar un enlace roto. Usa el
// sistema de archivos: no importar desde el navegador.
import { statSync } from "node:fs";
import { join } from "node:path";
import { getCollection } from "astro:content";
import type { ImageMetadata } from "astro";
import { manualPdfPath, sortManuals } from "./manuals";

const covers = import.meta.glob<{ default: ImageMetadata }>(
    "../assets/manuals/*.png",
    { eager: true },
);

export async function loadManuals() {
    const entries = await getCollection("manuals");
    return sortManuals(entries.map((entry) => entry.data)).map((manual) => {
        const cover = covers[`../assets/manuals/${manual.id}.png`]?.default;
        if (!cover) throw new Error(`Manual sin portada: ${manual.id}`);
        const pdfPath = manualPdfPath(manual.id);
        return {
            ...manual,
            cover,
            pdfPath,
            bytes: statSync(join(process.cwd(), "public", pdfPath)).size,
        };
    });
}

export type Manual = Awaited<ReturnType<typeof loadManuals>>[number];
