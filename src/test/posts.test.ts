import { describe, expect, it } from "vitest";
import {
    blogStateSearch,
    formatPostDate,
    isFiltering,
    matchesPost,
    parseBlogState,
    postCountLabel,
    postDateIso,
    postPath,
    postsByYear,
    publishedPosts,
    readingMinutes,
    tagCounts,
} from "../lib/posts";

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

describe("formatPostDate", () => {
    const date = new Date("2026-10-17");

    it("lleva el año y sin puntos", () => {
        expect(formatPostDate(date, "es")).toBe("17 oct 2026");
        expect(formatPostDate(date, "en")).toBe("Oct 17, 2026");
    });

    it("puede omitir el año", () => {
        expect(formatPostDate(date, "es", false)).toBe("17 oct");
        expect(formatPostDate(date, "en", false)).toBe("Oct 17");
    });

    it("no cambia de día por la zona horaria", () => {
        expect(formatPostDate(new Date("2026-01-01"), "es")).toBe("1 ene 2026");
    });
});

describe("readingMinutes", () => {
    it("cuenta 200 palabras por minuto", () => {
        expect(readingMinutes("palabra ".repeat(1000))).toBe(5);
    });

    it("no baja de un minuto", () => {
        expect(readingMinutes("")).toBe(1);
    });

    it("ignora los import y las etiquetas de componentes", () => {
        const body = `import antes from "./x/antes.webp";\n<BeforeAfter before={antes} />\n${"texto ".repeat(400)}`;
        expect(readingMinutes(body)).toBe(2);
    });
});

function tagged(date: string, tags: string[]) {
    return { data: { date: new Date(date), tags } };
}

describe("tagCounts", () => {
    it("ordena por uso y luego alfabéticamente", () => {
        const posts = [
            tagged("2026-10-01", ["IA", "Video"]),
            tagged("2026-10-02", ["IA", "3D"]),
            tagged("2026-10-03", ["Blender"]),
        ];
        expect(tagCounts(posts)).toEqual([
            ["IA", 2],
            ["3D", 1],
            ["Blender", 1],
            ["Video", 1],
        ]);
    });
});

describe("postsByYear", () => {
    it("agrupa por año manteniendo el orden", () => {
        const posts = [
            tagged("2026-10-01", []),
            tagged("2026-02-01", []),
            tagged("2025-12-01", []),
        ];
        expect(
            postsByYear(posts).map(([year, items]) => [year, items.length]),
        ).toEqual([
            [2026, 2],
            [2025, 1],
        ]);
    });
});

describe("parseBlogState y blogStateSearch", () => {
    it("lee etiquetas, búsqueda y vista", () => {
        expect(parseBlogState("?tag=IA&tag=3D&q=blender&view=log")).toEqual({
            tags: ["IA", "3D"],
            query: "blender",
            view: "log",
        });
    });

    it("ignora vistas desconocidas y etiquetas repetidas", () => {
        expect(parseBlogState("?tag=IA&tag=IA&view=grid")).toEqual({
            tags: ["IA"],
            query: "",
            view: undefined,
        });
    });

    it("vuelve a la misma URL", () => {
        const search = "?tag=IA&tag=Open+source&q=mcp&view=magazine";
        expect(blogStateSearch(parseBlogState(search))).toBe(search);
    });

    it("sin estado no deja query string", () => {
        expect(blogStateSearch({ tags: [], query: "  " })).toBe("");
    });
});

describe("matchesPost", () => {
    const entry = {
        tags: ["IA", "Blender"],
        text: "Modelar una mascota en 3D",
    };

    it("sin filtros coincide siempre", () => {
        expect(matchesPost(entry, { tags: [], query: "" })).toBe(true);
    });

    it("basta con una de las etiquetas elegidas", () => {
        expect(matchesPost(entry, { tags: ["Video", "IA"], query: "" })).toBe(
            true,
        );
        expect(matchesPost(entry, { tags: ["Video"], query: "" })).toBe(false);
    });

    it("busca sin importar tildes ni mayúsculas", () => {
        expect(matchesPost(entry, { tags: [], query: "MÁSCOTA" })).toBe(true);
    });

    it("combina etiquetas y búsqueda", () => {
        expect(matchesPost(entry, { tags: ["IA"], query: "video" })).toBe(
            false,
        );
    });

    it("isFiltering ignora una búsqueda en blanco", () => {
        expect(isFiltering({ tags: [], query: "   " })).toBe(false);
        expect(isFiltering({ tags: ["IA"], query: "" })).toBe(true);
    });
});

describe("postCountLabel", () => {
    it("muestra el total o «x de total» al filtrar", () => {
        expect(postCountLabel(14, 14, false, "es")).toBe("14 entradas");
        expect(postCountLabel(3, 14, true, "es")).toBe("3 de 14 entradas");
        expect(postCountLabel(3, 14, true, "en")).toBe("3 of 14 entries");
        expect(postCountLabel(1, 1, false, "en")).toBe("1 entry");
    });
});
