import { describe, it, expect } from "vitest";
import {
    RESOURCE_CATEGORIES,
    categoryById,
    categoryPageDescription,
    categoryPageTitle,
    categoryPath,
    displayDomain,
    groupByCategory,
    matchesQuery,
    normalizeText,
    resourceCountLabel,
    youtubeEmbedUrl,
    youtubeThumbnail,
    youtubeVideoId,
} from "../lib/resources";

describe("youtubeVideoId", () => {
    const id = "rfscVS0vtbw";
    it("reads watch, short, embed and shorts links", () => {
        expect(youtubeVideoId(`https://www.youtube.com/watch?v=${id}`)).toBe(
            id,
        );
        expect(youtubeVideoId(`https://youtu.be/${id}`)).toBe(id);
        expect(youtubeVideoId(`https://www.youtube.com/embed/${id}`)).toBe(id);
        expect(youtubeVideoId(`https://youtube.com/shorts/${id}`)).toBe(id);
    });
    it("rejects other hosts, channels and malformed ids", () => {
        expect(
            youtubeVideoId(`https://example.com/watch?v=${id}`),
        ).toBeUndefined();
        expect(
            youtubeVideoId("https://www.youtube.com/@freecodecamp"),
        ).toBeUndefined();
        expect(
            youtubeVideoId("https://www.youtube.com/watch?v=corto"),
        ).toBeUndefined();
        expect(youtubeVideoId("no es una url")).toBeUndefined();
    });
});

describe("youtube urls", () => {
    it("builds the thumbnail and the cookie-less embed", () => {
        expect(youtubeThumbnail("abcdefghijk")).toBe(
            "https://img.youtube.com/vi/abcdefghijk/hqdefault.jpg",
        );
        expect(youtubeEmbedUrl("abcdefghijk")).toContain(
            "https://www.youtube-nocookie.com/embed/abcdefghijk",
        );
    });
});

describe("displayDomain", () => {
    it("drops www and keeps the host", () => {
        expect(displayDomain("https://www.getonbrd.com/jobs")).toBe(
            "getonbrd.com",
        );
        expect(displayDomain("https://pe.computrabajo.com")).toBe(
            "pe.computrabajo.com",
        );
    });
});

describe("normalizeText", () => {
    it("lowercases and strips accents", () => {
        expect(normalizeText("Práctica TÉCNICA")).toBe("practica tecnica");
    });
});

describe("matchesQuery", () => {
    const text = "freeCodeCamp Cursos de programación";

    it("matches everything with an empty query", () => {
        expect(matchesQuery(text, "")).toBe(true);
        expect(matchesQuery(text, "   ")).toBe(true);
    });
    it("ignores accents, case and surrounding spaces", () => {
        expect(matchesQuery(text, "  PROGRAMACIÓN ")).toBe(true);
        expect(matchesQuery(text, "programacion")).toBe(true);
    });
    it("rejects text that is not there", () => {
        expect(matchesQuery(text, "python")).toBe(false);
    });
});

describe("resourceCountLabel", () => {
    it("pluralizes in both languages", () => {
        expect(resourceCountLabel(1, "es")).toBe("1 recurso");
        expect(resourceCountLabel(58, "es")).toBe("58 recursos");
        expect(resourceCountLabel(0, "en")).toBe("0 resources");
        expect(resourceCountLabel(1, "en")).toBe("1 resource");
    });
});

describe("categories", () => {
    it("keeps the catalog order and skips empty groups", () => {
        const groups = groupByCategory([
            { category: "ai", n: 1 },
            { category: "cv", n: 2 },
            { category: "ai", n: 3 },
        ]);
        expect(groups.map((g) => g.category.id)).toEqual(["cv", "ai"]);
        expect(groups[1].items.map((i) => i.n)).toEqual([1, 3]);
    });
    it("finds a category by id and has unique ids", () => {
        expect(categoryById("scholarships")?.label.es).toBe(
            "Oportunidades académicas",
        );
        expect(categoryById("nope")).toBeUndefined();
        const ids = RESOURCE_CATEGORIES.map((c) => c.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
    it("uses ids that are valid, English URL slugs", () => {
        for (const c of RESOURCE_CATEGORIES) {
            expect(c.id, c.id).toMatch(/^[a-z]+$/);
        }
        expect(categoryPath("jobs")).toBe("/resources/jobs/");
    });
    it("builds page metadata within SEO length", () => {
        for (const c of RESOURCE_CATEGORIES) {
            expect(categoryPageTitle(c).length, c.id).toBeLessThanOrEqual(65);
            const d = categoryPageDescription(c).length;
            expect(d, c.id).toBeGreaterThanOrEqual(100);
            expect(d, c.id).toBeLessThanOrEqual(175);
        }
    });
});
