import { beforeEach, describe, expect, it } from "vitest";
import { removeBrokenImages } from "../lib/broken-images";

function img(attrs: Record<string, string>) {
    const el = document.createElement("img");
    for (const [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value);
    }
    document.body.appendChild(el);
    return el;
}

describe("removeBrokenImages", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("quita una imagen marcada cuando falla al cargar", () => {
        removeBrokenImages();
        const avatar = img({ src: "x.png", "data-remove-on-error": "" });
        avatar.dispatchEvent(new Event("error"));
        expect(avatar.isConnected).toBe(false);
    });

    it("no toca imágenes sin la marca", () => {
        removeBrokenImages();
        const logo = img({ src: "logo.png" });
        logo.dispatchEvent(new Event("error"));
        expect(logo.isConnected).toBe(true);
    });

    it("quita las que ya habían fallado antes de ejecutarse", () => {
        const broken = img({ src: "x.png", "data-remove-on-error": "" });
        Object.defineProperty(broken, "complete", { value: true });
        Object.defineProperty(broken, "naturalWidth", { value: 0 });
        const loaded = img({ src: "ok.png", "data-remove-on-error": "" });
        Object.defineProperty(loaded, "complete", { value: true });
        Object.defineProperty(loaded, "naturalWidth", { value: 64 });

        removeBrokenImages();

        expect(broken.isConnected).toBe(false);
        expect(loaded.isConnected).toBe(true);
    });
});
