// Lógica de los manuales propios (sección «De Chamba Lab» de /resources), sin
// depender de la vista ni del sistema de archivos. Cada manual es
// public/manuals/<id>.pdf con su portada en src/assets/manuals/<id>.png.

export const CHAMBA_LAB_PATH = "/resources/chamba-lab/";

// Portadas apiladas en la entrada de /resources.
export const ENTRY_COVERS_MAX = 2;

// El más reciente (el número más alto) primero.
export function sortManuals<T extends { number: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => b.number - a.number);
}

export function manualPdfPath(id: string): string {
    return `/manuals/${id}.pdf`;
}

// "MANUAL 02"
export function manualNumberLabel(number: number): string {
    return `MANUAL ${String(number).padStart(2, "0")}`;
}

// "2 manuales" / "1 manual" / "2 manuals" / "1 manual".
export function manualCountLabel(count: number, lang: "es" | "en"): string {
    if (count === 1) return "1 manual";
    return `${count} ${lang === "en" ? "manuals" : "manuales"}`;
}

// "PDF · 4,4 MB" / "PDF in Spanish · 4.4 MB". Los manuales están en español:
// en inglés se avisa antes de abrirlos.
export function manualFormatLabel(bytes: number, lang: "es" | "en"): string {
    const size = (bytes / (1024 * 1024)).toFixed(1);
    return lang === "en"
        ? `PDF in Spanish · ${size} MB`
        : `PDF · ${size.replace(".", ",")} MB`;
}
