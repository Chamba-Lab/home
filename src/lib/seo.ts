/** Datos estructurados (JSON-LD) para buscadores. Lógica pura, sin Astro. */

import {
    DISCORD_PUBLIC_URL,
    DISCORD_URL,
    GITHUB_ORG_URL,
    LINKEDIN_URL,
} from "./constants";

type JsonLd = Record<string, unknown>;

export interface BreadcrumbItem {
    name: string;
    /** Ruta absoluta del sitio, por ejemplo "/activities/". */
    path: string;
}

export interface SeoEvent {
    name: string;
    description: string;
    /** YYYY-MM-DD */
    date: string;
    /** HH:mm */
    startTime?: string;
    endTime?: string;
    /** Formato "UTC-5"; por defecto UTC-5. */
    timezone?: string;
}

const SLOGAN = "Connect. Inspire. Grow.";

/** "UTC-5" -> "-05:00". Si no se reconoce, usa UTC-5 (el horario de la comunidad). */
export function utcOffset(timezone = "UTC-5"): string {
    const match = /^UTC([+-])(\d{1,2})(?::?(\d{2}))?$/.exec(timezone);
    if (!match) return "-05:00";
    const [, sign, hours, minutes = "00"] = match;
    return `${sign}${hours.padStart(2, "0")}:${minutes}`;
}

/** Serializa para incrustar en un <script>; evita cerrar la etiqueta por error. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
    const payload = Array.isArray(data)
        ? { "@context": "https://schema.org", "@graph": data }
        : { "@context": "https://schema.org", ...data };
    const escapedLt = `${String.fromCharCode(92)}u003c`;
    return JSON.stringify(payload).replace(/</g, escapedLt);
}

export function organizationJsonLd(siteUrl: string): JsonLd {
    return {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Chamba Lab",
        url: `${siteUrl}/`,
        logo: `${siteUrl}/icon-512.png`,
        slogan: SLOGAN,
        alternateName: ["ChambaLab", "Chamba Lab comunidad tech"],
        description:
            "Chamba Lab es una comunidad tech en Discord para conectar, inspirarte y crecer en tu carrera.",
        disambiguatingDescription:
            "Comunidad independiente y sin fines de lucro en Discord, con sitio propio en chambalab.org.",
        sameAs: [DISCORD_URL, GITHUB_ORG_URL, LINKEDIN_URL],
    };
}

export function aboutPageJsonLd(siteUrl: string): JsonLd {
    return {
        "@type": "AboutPage",
        "@id": `${siteUrl}/about/#webpage`,
        url: `${siteUrl}/about/`,
        name: "Quiénes somos",
        inLanguage: "es",
        about: { "@id": `${siteUrl}/#organization` },
        isPartOf: { "@id": `${siteUrl}/#website` },
    };
}

export function websiteJsonLd(siteUrl: string): JsonLd {
    return {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: "Chamba Lab",
        inLanguage: "es",
        publisher: { "@id": `${siteUrl}/#organization` },
    };
}

export function breadcrumbJsonLd(
    siteUrl: string,
    items: BreadcrumbItem[],
): JsonLd {
    return {
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${siteUrl}${item.path}`,
        })),
    };
}

/** Evento en línea que ocurre en Discord. */
export function eventJsonLd(
    siteUrl: string,
    event: SeoEvent,
    pagePath = "/events/",
): JsonLd {
    const offset = utcOffset(event.timezone);
    const at = (time?: string) =>
        time ? `${event.date}T${time}:00${offset}` : event.date;

    return {
        "@type": "Event",
        name: event.name,
        description: event.description,
        startDate: at(event.startTime),
        ...(event.endTime ? { endDate: at(event.endTime) } : {}),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        location: { "@type": "VirtualLocation", url: DISCORD_PUBLIC_URL },
        image: [`${siteUrl}/og-image.png`],
        url: `${siteUrl}${pagePath}`,
        organizer: { "@id": `${siteUrl}/#organization` },
    };
}
