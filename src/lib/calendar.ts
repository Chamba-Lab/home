/**
 * Calendar utilities for Chamba Lab events (Google Calendar & iCal / .ics)
 * Default timezone: UTC-5 (America/Lima / Bogota / Quito)
 */

export interface CalendarEventOptions {
    id?: string;
    title: string;
    description: string;
    date?: string; // YYYY-MM-DD
    startTime?: string; // HH:mm (24h) in UTC-5
    endTime?: string; // HH:mm (24h) in UTC-5
    timezone?: string; // default "UTC-5"
    recurring?: boolean;
    weekday?: number; // 0=Sun..6=Sat
    location?: string;
}

const DEFAULT_LOCATION = "Discord - https://discord.gg/TCuZSnfKTE";
const DEFAULT_TIMEZONE_IANA = "America/Lima";

/**
 * Converts a YYYY-MM-DD and HH:mm in UTC-5 to a UTC Date object
 */
export function parseUtcMinus5Date(dateStr: string, timeStr = "00:00"): Date {
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hours, minutes] = timeStr.split(":").map(Number);
    // UTC-5 means when it is HH:mm in UTC-5, in UTC it is (HH + 5)
    return new Date(Date.UTC(year, month - 1, day, hours + 5, minutes, 0));
}

/**
 * Format date to YYYYMMDDTHHmmssZ
 */
function toUtcIso(date: Date): string {
    return date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
}

/**
 * Generates an event URL for Google Calendar
 */
export function buildGoogleCalendarUrl(options: CalendarEventOptions): string {
    const {
        title,
        description,
        date,
        startTime,
        endTime,
        recurring,
        location = DEFAULT_LOCATION,
    } = options;

    const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const params = new URLSearchParams();
    params.set("text", title);
    params.set("details", description);
    params.set("location", location);

    if (date) {
        const cleanDate = date.replace(/-/g, "");

        if (startTime) {
            const startClean = startTime.replace(":", "") + "00";
            const endClean = endTime
                ? endTime.replace(":", "") + "00"
                : (Number(startTime.slice(0, 2)) + 1)
                      .toString()
                      .padStart(2, "0") +
                  startTime.slice(3) +
                  "00";

            params.set(
                "dates",
                `${cleanDate}T${startClean}/${cleanDate}T${endClean}`,
            );
            params.set("ctz", DEFAULT_TIMEZONE_IANA);
        } else {
            // All-day event: start date to next day date
            const [y, m, d] = date.split("-").map(Number);
            const nextDay = new Date(Date.UTC(y, m - 1, d + 1));
            const nextDayStr = nextDay
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "");
            params.set("dates", `${cleanDate}/${nextDayStr}`);
        }
    }

    if (recurring) {
        params.set("recur", "RRULE:FREQ=WEEKLY");
    }

    return `${base}&${params.toString()}`;
}

/**
 * Generates RFC 5545 iCalendar content (.ics)
 */
export function generateIcsData(options: CalendarEventOptions): string {
    const {
        id = "event-" + Math.random().toString(36).substring(2, 9),
        title,
        description,
        date,
        startTime,
        endTime,
        recurring,
        location = DEFAULT_LOCATION,
    } = options;

    const nowUtc = toUtcIso(new Date());
    const lines: string[] = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Chamba Lab//Community Events//ES",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${id}@chambalab.org`,
        `DTSTAMP:${nowUtc}`,
        `SUMMARY:${escapeIcsText(title)}`,
        `DESCRIPTION:${escapeIcsText(description)}`,
        `LOCATION:${escapeIcsText(location)}`,
        "STATUS:CONFIRMED",
    ];

    if (date) {
        if (startTime) {
            const startDateUtc = parseUtcMinus5Date(date, startTime);
            const effectiveEndTime =
                endTime ||
                `${(Number(startTime.slice(0, 2)) + 1).toString().padStart(2, "0")}:${startTime.slice(3)}`;
            const endDateUtc = parseUtcMinus5Date(date, effectiveEndTime);

            lines.push(`DTSTART:${toUtcIso(startDateUtc)}`);
            lines.push(`DTEND:${toUtcIso(endDateUtc)}`);
        } else {
            const cleanDate = date.replace(/-/g, "");
            const [y, m, d] = date.split("-").map(Number);
            const nextDay = new Date(Date.UTC(y, m - 1, d + 1));
            const nextDayStr = nextDay
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "");
            lines.push(`DTSTART;VALUE=DATE:${cleanDate}`);
            lines.push(`DTEND;VALUE=DATE:${nextDayStr}`);
        }
    }

    if (recurring) {
        lines.push("RRULE:FREQ=WEEKLY");
    }

    lines.push("END:VEVENT");
    lines.push("END:VCALENDAR");

    return lines.join("\r\n");
}

/**
 * Helper to escape text according to RFC 5545
 */
function escapeIcsText(str: string): string {
    return str
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");
}

/**
 * Returns a data: URL for downloading an .ics file directly in the browser
 */
export function buildIcsDataUri(options: CalendarEventOptions): string {
    const icsContent = generateIcsData(options);
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
}

/**
 * Formats time display string with UTC-5 indication
 */
export function formatTimeDisplay(
    startTime?: string,
    endTime?: string,
    timezone = "UTC-5",
    lang: "es" | "en" = "es",
): string {
    if (!startTime) {
        return lang === "es" ? "Hora por confirmar" : "Time TBA";
    }
    if (endTime) {
        return `${startTime} - ${endTime} (${timezone})`;
    }
    return `${startTime} (${timezone})`;
}
