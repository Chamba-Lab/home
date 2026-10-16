// Lógica y catálogos de la biblioteca de recursos, sin depender de la vista:
// categorías, formatos, niveles de acceso, filtrado, agrupación y ayudas de
// YouTube. Las páginas y componentes solo pintan lo que sale de aquí.

export interface Label {
    es: string;
    en: string;
}

// Categorías, en el orden en que se muestran. `badgeClass` son las clases de
// la insignia de la tarjeta.
export const RESOURCE_CATEGORIES = [
    {
        id: "cv",
        label: { es: "CV y LinkedIn", en: "CV & LinkedIn" },
        badgeClass:
            "border-brand-yellow/30 bg-brand-yellow/10 text-brand-yellow",
    },
    {
        id: "empleo",
        label: { es: "Portales de empleo", en: "Job boards" },
        badgeClass: "border-sky-500/30 bg-sky-500/10 text-sky-400",
    },
    {
        id: "aprendizaje",
        label: { es: "Aprendizaje", en: "Learning" },
        badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    },
    {
        id: "certificacion",
        label: { es: "Certificaciones", en: "Certifications" },
        badgeClass: "border-orange-500/30 bg-orange-500/10 text-orange-400",
    },
    {
        id: "becas",
        label: {
            es: "Oportunidades académicas",
            en: "Academic opportunities",
        },
        badgeClass: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    },
    {
        id: "ia",
        label: { es: "Herramientas de IA", en: "AI tools" },
        badgeClass: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400",
    },
    {
        id: "practica",
        label: { es: "Práctica técnica", en: "Technical practice" },
        badgeClass:
            "border-brand-discord/30 bg-brand-discord/10 text-[#8a95ff]",
    },
    {
        id: "opensource",
        label: { es: "Open source y GitHub", en: "Open source & GitHub" },
        badgeClass: "border-slate-400/30 bg-slate-400/10 text-slate-300",
    },
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number]["id"];

export const RESOURCE_CATEGORY_IDS = RESOURCE_CATEGORIES.map((c) => c.id) as [
    ResourceCategory,
    ...ResourceCategory[],
];

// Formatos: "web" (por defecto), "channel" (canal de YouTube) y "video"
// (video de YouTube con reproductor diferido).
export const RESOURCE_FORMATS = [
    { id: "web" },
    {
        id: "channel",
        cardLabel: { es: "Canal de YouTube", en: "YouTube channel" },
    },
    {
        id: "video",
        cardLabel: { es: "Video de YouTube", en: "YouTube video" },
    },
] as const;

export type ResourceType = (typeof RESOURCE_FORMATS)[number]["id"];

export const RESOURCE_TYPE_IDS = RESOURCE_FORMATS.map((f) => f.id) as [
    ResourceType,
    ...ResourceType[],
];

// Acceso: solo se muestra en cursos y certificaciones.
export const ACCESS_LEVELS = {
    free: {
        label: { es: "Gratis", en: "Free" },
        badgeClass: "border-emerald-500/30 text-emerald-400",
    },
    freemium: {
        label: { es: "Gratis + de pago", en: "Free + paid" },
        badgeClass: "border-amber-500/30 text-amber-400",
    },
    paid: {
        label: { es: "De pago", en: "Paid" },
        badgeClass: "border-slate-500/40 text-slate-300",
    },
} as const;

export type ResourceAccess = keyof typeof ACCESS_LEVELS;

export const ACCESS_IDS = Object.keys(ACCESS_LEVELS) as [
    ResourceAccess,
    ...ResourceAccess[],
];

export function categoryById(id: string) {
    return RESOURCE_CATEGORIES.find((c) => c.id === id);
}

// Agrupa por categoría respetando el orden del catálogo; omite las vacías.
export function groupByCategory<T extends { category: string }>(items: T[]) {
    return RESOURCE_CATEGORIES.map((category) => ({
        category,
        items: items.filter((item) => item.category === category.id),
    })).filter((group) => group.items.length > 0);
}

// Minúsculas y sin acentos, para que la búsqueda no distinga "Habilidades" de
// "habilidades" ni "ingles" de "inglés".
export function normalizeText(text: string): string {
    return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export interface ResourceFilters {
    category: string; // "all" o un id de categoría
    query: string; // texto libre, sin normalizar
}

export interface FilterableResource {
    category: string;
    text: string; // todo el texto visible de la tarjeta
}

// Una tarjeta es visible si cumple categoría y búsqueda a la vez.
export function matchesFilters(
    resource: FilterableResource,
    filters: ResourceFilters,
): boolean {
    const query = normalizeText(filters.query.trim());
    return (
        (filters.category === "all" ||
            resource.category === filters.category) &&
        (query === "" || normalizeText(resource.text).includes(query))
    );
}

// "58 recursos" / "1 recurso" / "58 resources" / "1 resource".
export function resourceCountLabel(count: number, lang: "es" | "en"): string {
    if (lang === "en")
        return `${count} ${count === 1 ? "resource" : "resources"}`;
    return `${count} ${count === 1 ? "recurso" : "recursos"}`;
}

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

// Saca el ID de un enlace de YouTube (watch, youtu.be, embed o shorts).
// Devuelve undefined si no es un video reconocible.
export function youtubeVideoId(url: string): string | undefined {
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return undefined;
    }
    const host = parsed.hostname.replace(/^www\./, "");
    let id: string | undefined;
    if (host === "youtu.be") {
        id = parsed.pathname.split("/")[1];
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
        if (parsed.pathname === "/watch") {
            id = parsed.searchParams.get("v") ?? undefined;
        } else {
            const [, kind, value] = parsed.pathname.split("/");
            if (kind === "embed" || kind === "shorts") id = value;
        }
    }
    return id && YOUTUBE_ID.test(id) ? id : undefined;
}

// Miniatura estable de YouTube. `hqdefault` es 4:3 con barras; la tarjeta la
// recorta a 16:9 con object-cover.
export function youtubeThumbnail(id: string): string {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

// Reproductor sin cookies de seguimiento hasta que la persona pulsa play.
export function youtubeEmbedUrl(id: string): string {
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}

// Nombre del dominio para mostrar bajo el título de una web.
export function displayDomain(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}
