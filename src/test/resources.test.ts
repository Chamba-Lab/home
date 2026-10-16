import { describe, it, expect } from "vitest";
import resources from "../content/resources.json";
import {
    ACCESS_IDS,
    RESOURCE_CATEGORY_IDS,
    youtubeVideoId,
} from "../lib/resources";

const CATEGORIES: string[] = RESOURCE_CATEGORY_IDS;
const ACCESS: string[] = ACCESS_IDS;

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

    it("marks access on every course and certification (web format)", () => {
        for (const r of resources) {
            const isWeb = !("type" in r) || r.type === "web";
            if (
                isWeb &&
                (r.category === "learning" || r.category === "certifications")
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

    it("keeps formats consistent with their fields", () => {
        for (const r of resources) {
            const type = ("type" in r ? r.type : "web") as string;
            expect(["web", "channel", "video"], r.id).toContain(type);
            if (type === "video") {
                expect(youtubeVideoId(r.url), r.id).toBeDefined();
                expect("channel" in r, r.id).toBe(true);
            }
            if (type === "channel") {
                expect(r.url, r.id).toMatch(/^https:\/\/www\.youtube\.com\/@/);
            }
        }
    });

    it("loads channel avatars only from the YouTube image host", () => {
        for (const r of resources) {
            if ("avatar" in r && r.avatar) {
                expect(r.avatar, r.id).toMatch(
                    /^https:\/\/yt3\.googleusercontent\.com\//,
                );
            }
        }
    });
});
