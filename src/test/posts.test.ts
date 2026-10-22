import { describe, expect, it } from "vitest";
import { postDateIso, postPath, publishedPosts } from "../lib/posts";

function post(id: string, date: string, draft = false) {
    return { id, data: { date: new Date(date), draft } };
}

describe("publishedPosts", () => {
    it("deja fuera los borradores", () => {
        const posts = [post("a", "2026-10-16"), post("b", "2026-10-20", true)];
        expect(publishedPosts(posts).map((p) => p.id)).toEqual(["a"]);
    });

    it("ordena de la más reciente a la más antigua", () => {
        const posts = [
            post("vieja", "2026-10-16"),
            post("nueva", "2026-11-02"),
            post("media", "2026-10-25"),
        ];
        expect(publishedPosts(posts).map((p) => p.id)).toEqual([
            "nueva",
            "media",
            "vieja",
        ]);
    });

    it("no modifica el arreglo original", () => {
        const posts = [post("a", "2026-10-16"), post("b", "2026-11-02")];
        publishedPosts(posts);
        expect(posts.map((p) => p.id)).toEqual(["a", "b"]);
    });

    it("devuelve vacío si todas son borradores", () => {
        expect(publishedPosts([post("a", "2026-10-16", true)])).toEqual([]);
    });
});

describe("postPath", () => {
    it("lleva barra final", () => {
        expect(postPath("blender-mcp")).toBe("/blog/blender-mcp/");
    });

    it("respeta una base, con o sin barra", () => {
        expect(postPath("x", "/sub/")).toBe("/sub/blog/x/");
        expect(postPath("x", "/sub")).toBe("/sub/blog/x/");
    });
});

describe("postDateIso", () => {
    it("da el día calendario de una fecha en UTC", () => {
        expect(postDateIso(new Date("2026-10-16"))).toBe("2026-10-16");
    });
});
