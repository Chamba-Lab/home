import { describe, it, expect } from "vitest";
import {
    displayDomain,
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
