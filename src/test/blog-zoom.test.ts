import { beforeEach, describe, expect, it } from "vitest";
import { initBlogZoom, zoomLabel } from "../lib/blog-zoom";

describe("zoomLabel", () => {
    it("da el texto en cada idioma", () => {
        expect(zoomLabel("image", "es")).toBe("Ampliar imagen");
        expect(zoomLabel("video", "en")).toBe("Enlarge video");
        expect(zoomLabel("close", "es")).toBe("Cerrar");
    });
});

describe("initBlogZoom", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <article>
                <img class="post-cover" src="/portada.jpg" alt="Portada" />
                <div class="post-body">
                    <img src="/uno.jpg" alt="Uno" />
                    <a href="https://github.com/x"><img src="/logo.png" alt="" /></a>
                    <figure class="ba"><img src="/antes.jpg" alt="Antes" /></figure>
                    <figure class="yt"><img src="/mini.jpg" alt="Miniatura" /></figure>
                </div>
            </article>`;
        initBlogZoom();
    });

    it("envuelve solo las imágenes que se pueden ampliar", () => {
        const wraps = document.querySelectorAll(".zoom-wrap");
        expect(wraps).toHaveLength(2);
        expect(wraps[0].classList.contains("is-cover")).toBe(true);
        expect(document.querySelectorAll("a .zoom-wrap")).toHaveLength(0);
        expect(document.querySelectorAll(".ba .zoom-wrap")).toHaveLength(0);
        expect(document.querySelectorAll(".yt .zoom-wrap")).toHaveLength(0);
    });

    it("pone botones accesibles en los dos idiomas", () => {
        const btn = document.querySelector<HTMLButtonElement>(".zoom-btn")!;
        expect(btn.getAttribute("aria-label")).toBe("Ampliar imagen");
        expect(btn.dataset.i18nAriaLabelEn).toBe("Enlarge image");
    });

    it("abre el diálogo con la imagen al pulsar el botón", () => {
        const dialog = document.querySelector(
            "dialog.lightbox",
        ) as HTMLDialogElement;
        dialog.showModal = () => dialog.setAttribute("open", "");
        document.querySelectorAll<HTMLButtonElement>(".zoom-btn")[1].click();
        expect(dialog.hasAttribute("open")).toBe(true);
        expect(dialog.querySelector("img")?.src).toMatch(/\/uno\.jpg$/);
    });
});
