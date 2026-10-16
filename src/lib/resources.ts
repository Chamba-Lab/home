// Formatos de recurso: "web" (por defecto), "channel" (canal de YouTube) y
// "video" (video de YouTube con reproductor diferido).

export const RESOURCE_TYPES = ["web", "channel", "video"] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

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
