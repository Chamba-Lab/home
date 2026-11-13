import { describe, expect, it } from "vitest";
import {
    buildGoogleCalendarUrl,
    generateIcsData,
    weeklyRrule,
} from "../lib/calendar";

const codeCoffee = {
    id: "code-coffee",
    title: "Code & Coffee",
    description: "Coworking",
    date: "2026-11-06",
    startTime: "20:00",
    endTime: "22:00",
    recurring: true,
};

describe("weeklyRrule", () => {
    it("repite cada semana sin fin si la serie no tiene endDate", () => {
        expect(weeklyRrule()).toBe("RRULE:FREQ=WEEKLY");
    });

    it("termina al final del último día en UTC-5", () => {
        // 23:59 del 27 nov en Lima son las 04:59 UTC del 28.
        expect(weeklyRrule("2026-11-27")).toBe(
            "RRULE:FREQ=WEEKLY;UNTIL=20261128T045900Z",
        );
    });
});

describe("generateIcsData", () => {
    it("excluye las semanas canceladas a la hora de la sesión", () => {
        const ics = generateIcsData({
            ...codeCoffee,
            until: "2026-11-27",
            exdates: ["2026-11-13"],
        });
        expect(ics).toContain("RRULE:FREQ=WEEKLY;UNTIL=20261128T045900Z");
        // 20:00 en Lima son las 01:00 UTC del día siguiente.
        expect(ics).toContain("EXDATE:20261114T010000Z");
    });

    it("un evento único no lleva regla de repetición", () => {
        const ics = generateIcsData({ ...codeCoffee, recurring: false });
        expect(ics).not.toContain("RRULE");
    });
});

describe("buildGoogleCalendarUrl", () => {
    it("pasa el fin de la serie a Google Calendar", () => {
        const url = new URL(
            buildGoogleCalendarUrl({ ...codeCoffee, until: "2026-11-27" }),
        );
        expect(url.searchParams.get("recur")).toBe(
            "RRULE:FREQ=WEEKLY;UNTIL=20261128T045900Z",
        );
    });
});
