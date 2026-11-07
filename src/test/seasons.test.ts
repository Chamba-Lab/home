import { describe, expect, it } from "vitest";
import { SEASONS, currentSeason, inWindow, seasonFor } from "../lib/seasons";

describe("seasonFor", () => {
    it("da Halloween del 1 de octubre al 2 de noviembre", () => {
        expect(seasonFor("2026-09-30", null)).toBe("default");
        expect(seasonFor("2026-10-01", null)).toBe("halloween");
        expect(seasonFor("2026-10-31", null)).toBe("halloween");
        expect(seasonFor("2026-11-02", null)).toBe("halloween");
    });

    it("da Navidad del 3 de noviembre al 6 de enero, cruzando el año", () => {
        expect(seasonFor("2026-11-03", null)).toBe("christmas");
        expect(seasonFor("2026-12-31", null)).toBe("christmas");
        expect(seasonFor("2027-01-01", null)).toBe("christmas");
        expect(seasonFor("2027-01-06", null)).toBe("christmas");
        expect(seasonFor("2027-01-07", null)).toBe("default");
    });

    it("el forzado manual manda sobre la fecha", () => {
        expect(seasonFor("2026-06-15", "christmas")).toBe("christmas");
        expect(seasonFor("2026-10-15", "default")).toBe("default");
    });
});

describe("inWindow", () => {
    it("incluye ambos extremos", () => {
        const w = { id: "halloween", from: "10-01", to: "11-02" } as const;
        expect(inWindow("10-01", w)).toBe(true);
        expect(inWindow("11-02", w)).toBe(true);
        expect(inWindow("11-03", w)).toBe(false);
    });
});

describe("SEASONS", () => {
    it("no se solapan", () => {
        for (let m = 1; m <= 12; m++) {
            for (let d = 1; d <= 31; d++) {
                const md = `${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                const hits = SEASONS.filter((s) => inWindow(md, s));
                expect(hits.length, md).toBeLessThanOrEqual(1);
            }
        }
    });
});

describe("currentSeason", () => {
    it("usa el día de Lima, no el UTC", () => {
        // 2 nov 23:30 en Lima = 3 nov 04:30 UTC: sigue siendo Halloween.
        expect(currentSeason(new Date("2026-11-03T04:30:00Z"), null)).toBe(
            "halloween",
        );
    });
});
