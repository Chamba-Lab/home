import { describe, expect, it } from "vitest";
import {
    currentSeries,
    endStamp,
    eventCategory,
    formatLongDate,
    formatMonthShort,
    formatShortDate,
    formatWeekday,
    hasEnded,
    limaNowStamp,
    limaToday,
    nextWeeklyDate,
    nextWeeklySession,
    upcomingFixedEvents,
    weeklyDates,
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
    it("marca las series como coworking semanal, sin nombrar el día", () => {
        expect(eventCategory({ kind: "coworking", isRecurring: true })).toEqual(
            { es: "Coworking · Semanal", en: "Coworking · Weekly" },
        );
    });

    it("marca un Code & Coffee suelto como coworking", () => {
        expect(eventCategory({ kind: "coworking" })).toEqual({
            es: "Coworking",
            en: "Coworking",
        });
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

    it("el mismo día, ordena por hora", () => {
        const at = (id: string, startTime: string) => ({
            id,
            data: { type: "fixed", date: "2026-11-13", startTime },
        });
        expect(
            upcomingFixedEvents(
                [at("night", "20:00"), at("noon", "12:00")],
                "2026-11-13",
            ).map((e) => e.id),
        ).toEqual(["noon", "night"]);
    });

    it("devuelve vacío cuando ya pasaron todos", () => {
        expect(upcomingFixedEvents(events, "2027-01-01")).toEqual([]);
    });
});

// Code & Coffee: los viernes (5) desde el 6 de noviembre de 2026.
const fridays = { startDate: "2026-11-06", weekday: 5 };

describe("weeklyDates", () => {
    it("da las fechas de la serie dentro del rango", () => {
        expect(weeklyDates(fridays, "2026-11-01", "2026-11-30")).toEqual([
            "2026-11-06",
            "2026-11-13",
            "2026-11-20",
            "2026-11-27",
        ]);
    });

    it("no da fechas antes de empezar la serie", () => {
        expect(weeklyDates(fridays, "2026-10-01", "2026-10-31")).toEqual([]);
    });

    it("termina en su endDate, que se incluye", () => {
        expect(
            weeklyDates(
                { ...fridays, endDate: "2026-11-20" },
                "2026-11-01",
                "2026-11-30",
            ),
        ).toEqual(["2026-11-06", "2026-11-13", "2026-11-20"]);
    });

    it("salta las semanas canceladas", () => {
        expect(
            weeklyDates(
                { ...fridays, skipDates: ["2026-11-13"] },
                "2026-11-01",
                "2026-11-20",
            ),
        ).toEqual(["2026-11-06", "2026-11-20"]);
    });

    it("una serie nueva sigue a la anterior sin cambiar sus fechas", () => {
        const before = { ...fridays, endDate: "2026-11-27" };
        const after = { startDate: "2026-11-28", weekday: 0 };
        expect([
            ...weeklyDates(before, "2026-11-01", "2026-12-15"),
            ...weeklyDates(after, "2026-11-01", "2026-12-15"),
        ]).toEqual([
            "2026-11-06",
            "2026-11-13",
            "2026-11-20",
            "2026-11-27",
            "2026-11-29",
            "2026-12-06",
            "2026-12-13",
        ]);
    });
});

describe("nextWeeklyDate", () => {
    it("da el próximo viernes desde hoy", () => {
        expect(nextWeeklyDate(fridays, "2026-11-11")).toBe("2026-11-13");
    });

    it("el mismo día cuenta como próxima vez", () => {
        expect(nextWeeklyDate(fridays, "2026-11-13")).toBe("2026-11-13");
    });

    it("antes de empezar, la primera fecha", () => {
        expect(nextWeeklyDate(fridays, "2026-10-01")).toBe("2026-11-06");
    });

    it("cruza el mes y el año", () => {
        expect(nextWeeklyDate(fridays, "2026-12-30")).toBe("2027-01-01");
    });

    it("salta una semana cancelada", () => {
        const skipping = { ...fridays, skipDates: ["2026-11-13"] };
        expect(nextWeeklyDate(skipping, "2026-11-11")).toBe("2026-11-20");
    });

    it("no da nada si la serie ya terminó", () => {
        const ended = { ...fridays, endDate: "2026-11-13" };
        expect(nextWeeklyDate(ended, "2026-11-14")).toBeUndefined();
    });
});

describe("nextWeeklySession", () => {
    it("mantiene la sesión de hoy mientras no termine", () => {
        expect(nextWeeklySession(fridays, "22:00", "2026-11-13T21:30")).toBe(
            "2026-11-13",
        );
    });

    it("pasa a la semana siguiente cuando la de hoy terminó", () => {
        expect(nextWeeklySession(fridays, "22:00", "2026-11-13T22:00")).toBe(
            "2026-11-20",
        );
    });

    it("no da nada si hoy era la última sesión y ya terminó", () => {
        const ended = { ...fridays, endDate: "2026-11-13" };
        expect(
            nextWeeklySession(ended, "22:00", "2026-11-13T23:00"),
        ).toBeUndefined();
    });
});

describe("currentSeries", () => {
    const old = { id: "old", ...fridays, endDate: "2026-11-27" };
    const sundays = { id: "new", startDate: "2026-11-28", weekday: 0 };

    it("elige la serie con la próxima sesión más cercana", () => {
        expect(currentSeries([old, sundays], "2026-11-20")?.id).toBe("old");
        expect(currentSeries([old, sundays], "2026-11-28")?.id).toBe("new");
    });

    it("si todas terminaron, la más reciente", () => {
        const ended = { ...sundays, endDate: "2026-12-06" };
        expect(currentSeries([old, ended], "2027-01-01")?.id).toBe("new");
    });
});

describe("hasEnded", () => {
    it("un evento termina a su hora de fin en Lima, no al cambiar de día", () => {
        expect(hasEnded("2026-11-13", "13:00", "2026-11-13T12:59")).toBe(false);
        expect(hasEnded("2026-11-13", "13:00", "2026-11-13T13:00")).toBe(true);
    });

    it("sin hora de fin, dura todo el día", () => {
        expect(endStamp("2026-11-13")).toBe("2026-11-13T23:59");
        expect(hasEnded("2026-11-13", undefined, "2026-11-13T20:00")).toBe(
            false,
        );
    });
});

describe("limaNowStamp", () => {
    it("da la fecha y la hora de Lima", () => {
        // 02:30 UTC del día 14 son las 21:30 del día 13 en Lima.
        expect(limaNowStamp(new Date("2026-11-14T02:30:00Z"))).toBe(
            "2026-11-13T21:30",
        );
    });
});

describe("formatMonthShort", () => {
    it("da el mes abreviado según el idioma", () => {
        expect(formatMonthShort("2026-11-13", "es")).toBe("Nov");
        expect(formatMonthShort("2026-11-13", "en")).toBe("Nov");
    });
});
