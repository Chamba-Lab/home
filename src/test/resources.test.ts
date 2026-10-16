import { describe, it, expect } from "vitest";
import resources from "../content/resources.json";

const CATEGORIES = [
    "cv",
    "empleo",
    "aprendizaje",
    "certificacion",
    "ia",
    "practica",
    "opensource",
];
const ACCESS = ["free", "freemium", "paid"];

describe("resources.json", () => {
    it("has unique ids and unique URLs", () => {
        const ids = resources.map((r) => r.id);
        const urls = resources.map((r) => r.url);
        expect(new Set(ids).size).toBe(ids.length);
        expect(new Set(urls).size).toBe(urls.length);
    });

    it("uses only https URLs", () => {
        for (const r of resources) {
            expect(r.url, r.id).toMatch(/^https:\/\//);
        }
    });

    it("has a valid category and access level", () => {
        for (const r of resources) {
            expect(CATEGORIES, r.id).toContain(r.category);
            if ("access" in r) expect(ACCESS, r.id).toContain(r.access);
        }
    });

    it("marks access on every course and certification", () => {
        for (const r of resources) {
            if (
                r.category === "aprendizaje" ||
                r.category === "certificacion"
            ) {
                expect("access" in r, r.id).toBe(true);
            }
        }
    });

    it("is bilingual: every resource has en and es descriptions", () => {
        for (const r of resources) {
            expect(r.description.en.length, r.id).toBeGreaterThan(20);
            expect(r.description.es?.length ?? 0, r.id).toBeGreaterThan(20);
        }
    });

    it("keeps every category populated", () => {
        for (const c of CATEGORIES) {
            expect(
                resources.some((r) => r.category === c),
                c,
            ).toBe(true);
        }
    });
});
