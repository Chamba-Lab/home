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
