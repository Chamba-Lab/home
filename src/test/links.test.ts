import { describe, expect, it } from "vitest";
import { isExternalUrl } from "../lib/links";

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
