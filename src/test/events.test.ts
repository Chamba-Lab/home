import { describe, expect, it } from "vitest";
import {
    eventCategory,
    formatLongDate,
    formatShortDate,
    formatWeekday,
    limaToday,
    upcomingFixedEvents,
} from "../lib/events";

describe("formatShortDate", () => {
    it("da día y mes abreviados en mayúsculas según el idioma", () => {
        expect(formatShortDate("2026-10-23", "es")).toBe("23 OCT");
        expect(formatShortDate("2026-10-23", "en")).toBe("OCT 23");
    });

    it("devuelve vacío sin fecha", () => {
        expect(formatShortDate(undefined, "es")).toBe("");
    });
});

describe("formatWeekday", () => {
    it("usa el día de Lima en ambos idiomas", () => {
        expect(formatWeekday("2026-10-23", "es")).toBe("viernes");
        expect(formatWeekday("2026-10-23", "en")).toBe("Friday");
    });

    it("devuelve vacío sin fecha", () => {
        expect(formatWeekday(undefined, "en")).toBe("");
    });
});

describe("eventCategory", () => {
    it("marca las sesiones recurrentes como coworking con su recurrencia", () => {
        expect(
            eventCategory({
                kind: "coworking",
                isRecurring: true,
                recurrenceLabel: {
                    en: "Every Friday",
                    es: "Todos los viernes",
                },
            }),
        ).toEqual({
            es: "Coworking · Todos los viernes",
            en: "Coworking · Every Friday",
        });
    });

    it("cae al inglés si la recurrencia no tiene español", () => {
        expect(
            eventCategory({
                isRecurring: true,
                recurrenceLabel: { en: "Every Friday" },
            }).es,
        ).toBe("Coworking · Every Friday");
    });

    it("nombra la apertura", () => {
        expect(eventCategory({ kind: "launch" })).toEqual({
            es: "Encuentro de apertura",
            en: "Community opening",
        });
    });

    it("usa la etiqueta de las actividades", () => {
        expect(
            eventCategory({
                kind: "activity",
                tag: { en: "AI exploration", es: "Exploración con IA" },
            }),
        ).toEqual({ es: "Exploración con IA", en: "AI exploration" });
    });

    it("usa la etiqueta en inglés si falta el español", () => {
        expect(
            eventCategory({ kind: "activity", tag: { en: "Workshop" } }).es,
        ).toBe("Workshop");
    });

    it("usa la categoría genérica sin tipo", () => {
        expect(eventCategory({})).toEqual({
            es: "Encuentro de la comunidad",
            en: "Community gathering",
        });
    });
});

describe("formatLongDate", () => {
    it("da el día de la semana y la fecha completa en cada idioma", () => {
        expect(formatLongDate("2026-10-23", "es")).toBe(
            "viernes 23 de octubre",
        );
        expect(formatLongDate("2026-10-23", "en")).toBe("Friday, October 23");
    });

    it("devuelve vacío sin fecha", () => {
        expect(formatLongDate(undefined, "es")).toBe("");
    });
});

describe("limaToday", () => {
    it("usa el día de Lima, no el de UTC", () => {
        // 02:00 UTC del día 24 sigue siendo 21:00 del día 23 en Lima.
        expect(limaToday(new Date("2026-10-24T02:00:00Z"))).toBe("2026-10-23");
        expect(limaToday(new Date("2026-10-24T05:00:00Z"))).toBe("2026-10-24");
    });
});

describe("upcomingFixedEvents", () => {
    const event = (id: string, type: string, date?: string) => ({
        id,
        data: { type, date },
    });
    const events = [
        event("blender", "fixed", "2026-10-16"),
        event("code-coffee", "recurring"),
        event("launch", "fixed", "2026-10-23"),
        event("later", "fixed", "2026-11-06"),
    ];

    it("descarta los pasados y los recurrentes, y ordena por fecha", () => {
        expect(
            upcomingFixedEvents(events, "2026-10-17").map((e) => e.id),
        ).toEqual(["launch", "later"]);
    });

    it("mantiene el evento del mismo día", () => {
        expect(
            upcomingFixedEvents(events, "2026-10-23").map((e) => e.id),
        ).toEqual(["launch", "later"]);
    });

    it("ordena aunque el archivo no lo esté", () => {
        const shuffled = [events[3], events[2]];
        expect(
            upcomingFixedEvents(shuffled, "2026-10-01").map((e) => e.id),
        ).toEqual(["launch", "later"]);
    });

    it("devuelve vacío cuando ya pasaron todos", () => {
        expect(upcomingFixedEvents(events, "2027-01-01")).toEqual([]);
    });
});
