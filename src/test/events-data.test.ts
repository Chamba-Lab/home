import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import events from "../content/events.json";

// Vitest runs from the repository root.
const POSTS_DIR = resolve(process.cwd(), "src/content/posts");

// `post` is optional and only some events carry it.
const linked = (events as { id: string; type: string; post?: string }[]).filter(
    (event) => event.post,
);

describe("events.json", () => {
    it("has unique ids (they are the UID of the .ics files)", () => {
        const ids = events.map((event) => event.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("links blog entries only from one-time events", () => {
        for (const event of linked) {
            expect(event.type, event.id).toBe("fixed");
        }
    });

    it("links entries that exist in src/content/posts", () => {
        for (const event of linked) {
            expect(
                existsSync(resolve(POSTS_DIR, `${event.post}.mdx`)),
                `${event.id} -> ${event.post}`,
            ).toBe(true);
        }
    });

    it("links each entry from at most one event", () => {
        const posts = linked.map((event) => event.post);
        expect(new Set(posts).size).toBe(posts.length);
    });
});
