/**
 * Presentation helpers for the events page (poster kind, category label,
 * date formatting). Pure functions so they can be tested without Astro.
 */

export type EventKind = "launch" | "coworking" | "activity";

// "en" is the baseline; "es" falls back to it (same shape as the content schema).
export interface I18nText {
    en: string;
    es?: string;
}

export type Lang = "es" | "en";

const LIMA_TZ = "America/Lima";

// Noon in Lima: stays on the same calendar day for any UTC-5 reader.
function limaNoon(dateIso: string): Date {
    return new Date(`${dateIso}T12:00:00-05:00`);
}

/** Short uppercase date for posters and badges: "23 OCT" (es), "OCT 23" (en). */
export function formatShortDate(dateIso: string | undefined, lang: Lang) {
    if (!dateIso) return "";
    return limaNoon(dateIso)
        .toLocaleDateString(lang === "es" ? "es-PE" : "en-US", {
            day: "numeric",
            month: "short",
            timeZone: LIMA_TZ,
        })
        .replace(".", "")
        .toUpperCase();
}

/** Full weekday name in the given language ("viernes", "Friday"). */
export function formatWeekday(dateIso: string | undefined, lang: Lang) {
    if (!dateIso) return "";
    return limaNoon(dateIso).toLocaleDateString(
        lang === "es" ? "es-PE" : "en-US",
        { weekday: "long", timeZone: LIMA_TZ },
    );
}

/** Today's date in Lima as YYYY-MM-DD (the community's calendar day). */
export function limaToday(now: Date = new Date()): string {
    return now.toLocaleDateString("en-CA", { timeZone: LIMA_TZ });
}

/** Long date with weekday: "viernes 23 de octubre" (es), "Friday, October 23" (en). */
export function formatLongDate(dateIso: string | undefined, lang: Lang) {
    if (!dateIso) return "";
    const text = limaNoon(dateIso).toLocaleDateString(
        lang === "es" ? "es-PE" : "en-US",
        { weekday: "long", day: "numeric", month: "long", timeZone: LIMA_TZ },
    );
    return lang === "es" ? text.replace(",", "") : text;
}

interface DatedEvent {
    data: { type: string; date?: string };
}

/**
 * One-time events that have not happened yet (today still counts), soonest
 * first. The home shows the first one as the next session.
 */
export function upcomingFixedEvents<T extends DatedEvent>(
    events: T[],
    todayIso: string,
): T[] {
    return events
        .filter(
            (event) =>
                event.data.type === "fixed" &&
                event.data.date !== undefined &&
                event.data.date >= todayIso,
        )
        .sort((a, b) => (a.data.date! < b.data.date! ? -1 : 1));
}

interface CategoryInput {
    kind?: EventKind;
    isRecurring?: boolean;
    recurrenceLabel?: I18nText;
    tag?: I18nText;
}

/** Small label above the event title, in both languages. */
export function eventCategory({
    kind,
    isRecurring,
    recurrenceLabel,
    tag,
}: CategoryInput): Record<Lang, string> {
    if (isRecurring) {
        return {
            es: `Coworking · ${recurrenceLabel?.es ?? recurrenceLabel?.en ?? ""}`,
            en: `Coworking · ${recurrenceLabel?.en ?? ""}`,
        };
    }
    if (kind === "launch") {
        return { es: "Encuentro de lanzamiento", en: "Community launch" };
    }
    if (kind === "activity" && tag) {
        return { es: tag.es ?? tag.en, en: tag.en };
    }
    return { es: "Encuentro de la comunidad", en: "Community gathering" };
}
