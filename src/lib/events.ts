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

/** Short month in the given language ("nov", "Nov"), for date blocks. */
export function formatMonthShort(dateIso: string | undefined, lang: Lang) {
    if (!dateIso) return "";
    return limaNoon(dateIso)
        .toLocaleDateString(lang === "es" ? "es-PE" : "en-US", {
            month: "short",
            timeZone: LIMA_TZ,
        })
        .replace(".", "");
}

/**
 * A weekly series: one session a week on `weekday` (0 = Sunday … 6 = Saturday)
 * from `startDate`, until `endDate` if it has one, minus the `skipDates`
 * (cancelled weeks). A new schedule is a new series, so past sessions keep
 * the day and time they actually had.
 */
export interface WeeklySeries {
    startDate: string;
    weekday: number;
    endDate?: string;
    skipDates?: string[];
}

/** `dateIso` moved `days` days (YYYY-MM-DD). */
export function addDays(dateIso: string, days: number): string {
    const date = new Date(`${dateIso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
}

/** Weekday of a YYYY-MM-DD date (0 = Sunday … 6 = Saturday). */
export function weekdayOf(dateIso: string): number {
    return new Date(`${dateIso}T00:00:00Z`).getUTCDay();
}

/** Dates of a weekly series between `from` and `to`, both included. */
export function weeklyDates(
    series: WeeklySeries,
    from: string,
    to: string,
): string[] {
    const last =
        series.endDate !== undefined && series.endDate < to
            ? series.endDate
            : to;
    const first = series.startDate > from ? series.startDate : from;
    const skipped = new Set(series.skipDates ?? []);
    const dates: string[] = [];
    let date = addDays(first, (series.weekday - weekdayOf(first) + 7) % 7);
    while (date <= last) {
        if (!skipped.has(date)) dates.push(date);
        date = addDays(date, 7);
    }
    return dates;
}

/**
 * Next date (YYYY-MM-DD, `fromIso` included) of a weekly series, or
 * undefined once the series has ended.
 */
export function nextWeeklyDate(
    series: WeeklySeries,
    fromIso: string,
): string | undefined {
    if (series.endDate !== undefined && series.endDate < fromIso) {
        return undefined;
    }
    // A year ahead covers any run of cancelled weeks.
    return weeklyDates(series, fromIso, addDays(fromIso, 366))[0];
}

/** Current date and time in Lima, "YYYY-MM-DDTHH:mm". */
export function limaNowStamp(now: Date = new Date()): string {
    return now
        .toLocaleString("sv-SE", { timeZone: LIMA_TZ, hour12: false })
        .slice(0, 16)
        .replace(" ", "T");
}

/**
 * When a session is over, "YYYY-MM-DDTHH:mm" in Lima: its end time, or the
 * end of the day if it has none (comparable with `limaNowStamp`).
 */
export function endStamp(dateIso: string, endTime?: string): string {
    return `${dateIso}T${endTime ?? "23:59"}`;
}

/** Whether a session already ended at `nowStamp` (see `limaNowStamp`). */
export function hasEnded(
    dateIso: string,
    endTime: string | undefined,
    nowStamp: string,
): boolean {
    return endStamp(dateIso, endTime) <= nowStamp;
}

/**
 * Next session of a weekly series that has not ended at `nowStamp`: today's
 * if it is still on, otherwise the following one.
 */
export function nextWeeklySession(
    series: WeeklySeries,
    endTime: string | undefined,
    nowStamp: string,
): string | undefined {
    const today = nowStamp.slice(0, 10);
    const next = nextWeeklyDate(series, today);
    if (next === undefined || !hasEnded(next, endTime, nowStamp)) return next;
    return nextWeeklyDate(series, addDays(today, 1));
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
    data: { type: string; date?: string; startTime?: string };
}

const startKey = (date: string, startTime?: string) =>
    `${date}T${startTime ?? "00:00"}`;

/**
 * One-time events that have not happened yet (today still counts), soonest
 * first and, on the same day, by start time. The home shows the first one as
 * the next session.
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
        .sort((a, b) =>
            startKey(a.data.date!, a.data.startTime) <
            startKey(b.data.date!, b.data.startTime)
                ? -1
                : 1,
        );
}

/**
 * The series in effect on `todayIso`: the one with the soonest next session.
 * If all have ended, the latest one (its schedule is the last one known).
 */
export function currentSeries<T extends WeeklySeries>(
    series: T[],
    todayIso: string,
): T | undefined {
    const withNext = series
        .map((s) => ({ s, next: nextWeeklyDate(s, todayIso) }))
        .filter((x): x is { s: T; next: string } => x.next !== undefined)
        .sort((a, b) => (a.next < b.next ? -1 : 1));
    if (withNext.length > 0) return withNext[0].s;
    return [...series].sort((a, b) => (a.startDate < b.startDate ? 1 : -1))[0];
}

interface CategoryInput {
    kind?: EventKind;
    isRecurring?: boolean;
    tag?: I18nText;
}

/** Small label above the event title, in both languages. */
export function eventCategory({
    kind,
    isRecurring,
    tag,
}: CategoryInput): Record<Lang, string> {
    // Weekly, without naming the day: the schedule can change from one
    // series to the next, and each row already shows its date.
    if (isRecurring) {
        return { es: "Coworking · Semanal", en: "Coworking · Weekly" };
    }
    if (kind === "coworking") {
        return { es: "Coworking", en: "Coworking" };
    }
    if (kind === "launch") {
        return { es: "Encuentro de apertura", en: "Community opening" };
    }
    if (kind === "activity" && tag) {
        return { es: tag.es ?? tag.en, en: tag.en };
    }
    return { es: "Encuentro de la comunidad", en: "Community gathering" };
}
