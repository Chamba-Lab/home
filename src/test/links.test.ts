import { describe, expect, it } from "vitest";
import { isExternalUrl, linkKind } from "../lib/links";

const SITE = "https://chambalab.org";

describe("isExternalUrl", () => {
    it("reconoce los enlaces a otros sitios", () => {
        expect(isExternalUrl("https://github.com/Chamba-Lab", SITE)).toBe(true);
        expect(isExternalUrl("http://example.org/a", SITE)).toBe(true);
        expect(isExternalUrl("//example.org/a", SITE)).toBe(true);
    });

    it("deja fuera rutas, anclas y el propio sitio", () => {
        expect(isExternalUrl("/blog/", SITE)).toBe(false);
        expect(isExternalUrl("./imagen.webp", SITE)).toBe(false);
        expect(isExternalUrl("#aprendizajes", SITE)).toBe(false);
        expect(isExternalUrl("https://chambalab.org/events/", SITE)).toBe(
            false,
        );
        expect(isExternalUrl("mailto:hola@chambalab.org", SITE)).toBe(false);
    });

    it("no falla con valores que no son texto", () => {
        expect(isExternalUrl(undefined, SITE)).toBe(false);
        expect(isExternalUrl(42, SITE)).toBe(false);
    });
});

describe("linkKind", () => {
    it("reconoce perfiles de GitHub", () => {
        expect(linkKind("https://github.com/AntonioPow24")).toBe(
            "github-profile",
        );
        expect(linkKind("https://github.com/Chamba-Lab/")).toBe(
            "github-profile",
        );
    });

    it("reconoce repositorios de GitHub, también con subrutas", () => {
        expect(linkKind("https://github.com/Chamba-Lab/blender-pet")).toBe(
            "github-repo",
        );
        expect(
            linkKind(
                "https://github.com/Chamba-Lab/blender-pet/tree/main/skills",
            ),
        ).toBe("github-repo");
    });

    it("reconoce YouTube", () => {
        expect(linkKind("https://www.youtube.com/watch?v=abc")).toBe("youtube");
        expect(linkKind("https://youtu.be/abc")).toBe("youtube");
    });

    it("deja sin insignia el resto de enlaces", () => {
        expect(linkKind("https://github.com/")).toBeUndefined();
        expect(linkKind("https://gist.github.com/a/b")).toBeUndefined();
        expect(linkKind("https://example.org/github.com/a")).toBeUndefined();
        expect(linkKind("/blog/")).toBeUndefined();
        expect(linkKind(undefined)).toBeUndefined();
    });
});
