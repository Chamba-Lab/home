import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import activities from "../content/activities.json";

describe("activities.json", () => {
    it("has unique ids", () => {
        const ids = activities.map((a) => a.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("is bilingual in every visible text", () => {
        for (const a of activities) {
            for (const field of [a.name, a.description, a.format, a.prep]) {
                expect(field.es.length, a.id).toBeGreaterThan(0);
                expect(field.en.length, a.id).toBeGreaterThan(0);
            }
            expect(a.icon.length, a.id).toBeGreaterThan(0);
            expect(a.duration.length, a.id).toBeGreaterThan(0);
        }
    });

    it("has a page for every available dynamic", () => {
        for (const a of activities.filter((x) => x.status === "available")) {
            expect(
                existsSync(
                    resolve(
                        process.cwd(),
                        `src/pages/activities/${a.id}.astro`,
                    ),
                ),
                a.id,
            ).toBe(true);
        }
    });
});
