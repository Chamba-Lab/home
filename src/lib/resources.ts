// Lógica y catálogos de la biblioteca de recursos, sin depender de la vista:
// categorías, formatos, niveles de acceso, filtrado, agrupación y ayudas de
// YouTube. Las páginas y componentes solo pintan lo que sale de aquí.

export interface Label {
    es: string;
    en: string;
}

// Categorías, en el orden en que se muestran. El `id` es en inglés porque
// también es la ruta de la categoría (`/resources/jobs`). `iconPath` es el trazo SVG
// del icono (viewBox 24, estilo de DESIGN.md §6). Los colores de cada categoría
// viven en la paleta [data-category] de src/styles/global.css.
export const RESOURCE_CATEGORIES = [
    {
        id: "cv",
        label: { es: "CV y LinkedIn", en: "CV & LinkedIn" },
        description: {
            es: "Guías y plantillas para armar un CV y un perfil de LinkedIn que te ayuden a destacar en los procesos de selección.",
            en: "Guides and templates to build a CV and a LinkedIn profile that help you stand out in hiring processes.",
        },
        iconPath:
            "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5 M9 13h6 M9 17h4",
    },
    {
        id: "jobs",
        label: { es: "Portales de empleo", en: "Job boards" },
        description: {
            es: "Portales para buscar vacantes tech, locales y remotas, y postular con tu perfil.",
            en: "Job boards to find tech openings, local and remote, and apply with your profile.",
        },
        iconPath:
            "M4 8h16a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1z M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2 M3 13h18",
    },
    {
        id: "learning",
        label: { es: "Aprendizaje", en: "Learning" },
        description: {
            es: "Rutas, cursos y canales para aprender a programar y seguir creciendo, con opciones gratuitas y en español.",
            en: "Paths, courses and channels to learn to code and keep growing, with free options and in Spanish.",
        },
        iconPath:
            "M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2z M12 6.5v13",
    },
    {
        id: "certifications",
        label: { es: "Certificaciones", en: "Certifications" },
        description: {
            es: "Certificaciones reconocidas del sector, con indicación de si son gratis, freemium o de pago.",
            en: "Recognized industry certifications, marked as free, freemium or paid.",
        },
        iconPath:
            "M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12z M8.5 14 7 21l5-3 5 3-1.5-7",
    },
    {
        id: "scholarships",
        label: {
            es: "Oportunidades académicas",
            en: "Academic opportunities",
        },
        description: {
            es: "Becas, programas y convocatorias para estudiar o especializarte, en Perú y en el extranjero.",
            en: "Scholarships, programs and calls to study or specialize, in Peru and abroad.",
        },
        iconPath:
            "M2 9l10-5 10 5-10 5z M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5 M22 9v6",
    },
    {
        id: "ai",
        label: { es: "Herramientas de IA", en: "AI tools" },
        description: {
            es: "Herramientas de IA útiles para estudiar, programar y trabajar con más criterio.",
            en: "AI tools that help you study, code and work with better judgment.",
        },
        iconPath:
            "M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z",
    },
    {
        id: "practice",
        label: { es: "Práctica técnica", en: "Technical practice" },
        description: {
            es: "Plataformas para practicar algoritmos, retos de código y entrevistas técnicas.",
            en: "Platforms to practice algorithms, coding challenges and technical interviews.",
        },
        iconPath: "M8 8l-5 4 5 4 M16 8l5 4-5 4 M14 5l-4 14",
    },
    {
        id: "opensource",
        label: { es: "Open source y GitHub", en: "Open source & GitHub" },
        description: {
            es: "Guías y proyectos para empezar en open source y construir tu perfil en GitHub.",
            en: "Guides and projects to start in open source and build your GitHub profile.",
        },
        iconPath:
            "M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M18 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M6 3v12 M18 9c0 5-4 8-9 9",
    },
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number]["id"];

export const RESOURCE_CATEGORY_IDS = RESOURCE_CATEGORIES.map((c) => c.id) as [
    ResourceCategory,
    ...ResourceCategory[],
];

// Formatos: "web" (por defecto), "channel" (canal de YouTube), "video" (video
// de YouTube con reproductor diferido) y "repo" (repositorio de GitHub).
export const RESOURCE_FORMATS = [
    { id: "web", cardLabel: undefined },
    {
        id: "repo",
        cardLabel: { es: "Repositorio de GitHub", en: "GitHub repository" },
    },
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

// Ruta de la categoría, con barra final como el resto del sitio.
export function categoryPath(id: string): string {
    return `/resources/${id}/`;
}

// Metadatos de la página de una categoría (en español, como el resto).
export function categoryPageTitle(category: { label: Label }): string {
    return `${category.label.es}: recursos curados | Chamba Lab`;
}

// Google recorta las meta descriptions a unos 160 caracteres.
const DESCRIPTION_MAX = 160;

export function categoryPageDescription(category: {
    description: Label;
}): string {
    const full = `${category.description.es} Selección curada por la comunidad de Chamba Lab.`;
    return full.length <= DESCRIPTION_MAX
        ? full
        : `${category.description.es} Selección curada por Chamba Lab.`;
}

// Agrupa por categoría respetando el orden del catálogo; omite las vacías.
// Recursos destacados del home: los marcados con `featured`, en el orden del
// catálogo y hasta HOME_FEATURED_MAX (el resto se ignora).
export const HOME_FEATURED_MAX = 6;

export function featuredResources<T extends { featured?: boolean }>(
    items: T[],
    max = HOME_FEATURED_MAX,
): T[] {
    return items.filter((item) => item.featured).slice(0, max);
}

export function groupByCategory<T extends { category: string }>(items: T[]) {
    return RESOURCE_CATEGORIES.map((category) => ({
        category,
        items: items.filter((item) => item.category === category.id),
    })).filter((group) => group.items.length > 0);
}

// Secciones de la página de una categoría, en este orden. Separar formatos
// evita que una tarjeta de video estire la fila de una web.
export const RESOURCE_SECTIONS = [
    { format: "video", label: { es: "Videos", en: "Videos" } },
    {
        format: "channel",
        label: { es: "Canales de YouTube", en: "YouTube channels" },
    },
    { format: "web", label: { es: "Sitios web", en: "Websites" } },
    {
        format: "repo",
        label: { es: "Repositorios de GitHub", en: "GitHub repositories" },
    },
] as const satisfies readonly { format: ResourceType; label: Label }[];

// Con esta cantidad de videos o más, la sección se muestra como carrusel.
export const VIDEO_CAROUSEL_MIN = 4;

// Agrupa por formato en el orden de RESOURCE_SECTIONS; omite las vacías. Un
// recurso sin `type` es una web.
export function groupByFormat<
    T extends { type?: ResourceType; recommended?: boolean },
>(items: T[]) {
    return RESOURCE_SECTIONS.map((section) => ({
        ...section,
        // Los recomendados van primero dentro de su sección; el resto
        // conserva el orden del catálogo (el orden es estable).
        items: items
            .filter((item) => (item.type ?? "web") === section.format)
            .sort((a, b) => Number(!!b.recommended) - Number(!!a.recommended)),
    })).filter((group) => group.items.length > 0);
}

// Minúsculas y sin acentos, para que la búsqueda no distinga "Habilidades" de
// "habilidades" ni "ingles" de "inglés".
export function normalizeText(text: string): string {
    return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Una tarjeta coincide si su texto visible contiene la búsqueda; con la
// búsqueda vacía coincide siempre.
export function matchesQuery(text: string, query: string): boolean {
    const q = normalizeText(query.trim());
    return q === "" || normalizeText(text).includes(q);
}

// Texto con el que se busca una tarjeta: solo sus campos `data-search-field`
// (título, descripción, canal y dominio), no los textos fijos como «Explorar
// recurso» o «Ver canal», que harían coincidir cualquier tarjeta.
export function resourceSearchText(card: ParentNode): string {
    return Array.from(
        card.querySelectorAll("[data-search-field]"),
        (field) => field.textContent ?? "",
    ).join(" ");
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

// "propietario/repositorio" de un enlace a un repositorio de GitHub, para
// mostrarlo bajo el título. Devuelve undefined si no es de esa forma.
export function githubRepoName(url: string): string | undefined {
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return undefined;
    }
    if (parsed.hostname.replace(/^www\./, "") !== "github.com")
        return undefined;
    const [owner, repo, ...rest] = parsed.pathname.split("/").filter(Boolean);
    return owner && repo && rest.length === 0 ? `${owner}/${repo}` : undefined;
}

// Nombre del dominio para mostrar bajo el título de una web.
export function displayDomain(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}
