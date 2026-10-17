import { describe, expect, it } from "vitest";
import { eventCategory, formatShortDate, formatWeekday } from "../lib/events";

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

    it("nombra el lanzamiento", () => {
        expect(eventCategory({ kind: "launch" })).toEqual({
            es: "Encuentro de lanzamiento",
            en: "Community launch",
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
