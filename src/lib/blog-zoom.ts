import { getStoredLang } from "../i18n/lang";
import type { Lang } from "../i18n/translations";

export type ZoomKind = "image" | "video";

const LABELS: Record<ZoomKind | "close", Record<Lang, string>> = {
    image: { es: "Ampliar imagen", en: "Enlarge image" },
    video: { es: "Ampliar video", en: "Enlarge video" },
    close: { es: "Cerrar", en: "Close" },
};

/** Texto accesible de los botones de ampliar y cerrar. */
export function zoomLabel(kind: ZoomKind | "close", lang: Lang): string {
    return LABELS[kind][lang];
}

// Medios de la entrada que se pueden ampliar. Quedan fuera los que ya tienen
// su propia interacción (comparador, reproductor de YouTube), los que son
// enlaces o botones (como los logos de las insignias) y los ya preparados.
const SKIP = "a, button, .ba, .yt, .zoom-wrap";

const EXPAND_ICON =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';

/** Aplica el texto accesible del idioma activo y deja los dos idiomas para el cambio. */
function setLabelAttrs(el: HTMLElement, kind: ZoomKind | "close", lang: Lang) {
    el.setAttribute("aria-label", zoomLabel(kind, lang));
    el.setAttribute("data-i18n-aria-label-es", zoomLabel(kind, "es"));
    el.setAttribute("data-i18n-aria-label-en", zoomLabel(kind, "en"));
}

function makeButton(kind: ZoomKind, lang: Lang): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "zoom-btn";
    btn.dataset.zoomBtn = kind;
    btn.innerHTML = EXPAND_ICON;
    setLabelAttrs(btn, kind, lang);
    return btn;
}

/**
 * Envuelve las imágenes de la entrada con un botón de ampliar (los clips ya
 * traen el suyo desde `Clip.astro`) y abre el medio en un diálogo a pantalla
 * completa. Sin JavaScript la entrada se ve igual, solo sin ampliar.
 */
export function initBlogZoom(root: Document | HTMLElement = document) {
    const lang = getStoredLang();

    root.querySelectorAll<HTMLImageElement>(
        "img.post-cover, .post-body img",
    ).forEach((img) => {
        if (img.closest(SKIP) || !img.parentElement) return;
        const wrap = document.createElement("span");
        wrap.className = "zoom-wrap";
        if (img.classList.contains("post-cover")) {
            wrap.classList.add("is-cover");
        }
        img.before(wrap);
        wrap.append(img, makeButton("image", lang));
    });

    const dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    const stage = document.createElement("div");
    stage.className = "lightbox-stage";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "lightbox-close";
    close.textContent = "×";
    setLabelAttrs(close, "close", lang);
    dialog.append(stage, close);
    document.body.append(dialog);

    let resume: HTMLVideoElement | undefined;

    function open(source: HTMLImageElement | HTMLVideoElement) {
        stage.replaceChildren();
        if (source instanceof HTMLVideoElement) {
            const video = document.createElement("video");
            video.src = source.currentSrc || source.src;
            video.controls = true;
            video.loop = true;
            video.autoplay = true;
            video.playsInline = true;
            video.setAttribute(
                "aria-label",
                source.getAttribute("aria-label") ?? "",
            );
            if (!source.paused) resume = source;
            source.pause();
            stage.append(video);
        } else {
            const img = document.createElement("img");
            img.src = source.currentSrc || source.src;
            img.alt = source.alt;
            stage.append(img);
        }
        dialog.showModal();
    }

    function shut() {
        stage.replaceChildren();
        resume?.play().catch(() => {});
        resume = undefined;
    }

    root.addEventListener("click", (event) => {
        const btn = (event.target as Element | null)?.closest<HTMLElement>(
            "[data-zoom-btn]",
        );
        const media = btn?.parentElement?.querySelector<
            HTMLImageElement | HTMLVideoElement
        >("img, video");
        if (media) open(media);
    });
    close.addEventListener("click", () => dialog.close());
    // Un clic fuera del medio (en el fondo del diálogo) también cierra.
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog || event.target === stage) dialog.close();
    });
    dialog.addEventListener("close", shut);
}
