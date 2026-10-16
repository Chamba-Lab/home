/**
 * Quita las imágenes externas que no cargan (avatares de GitHub, canales de
 * YouTube…) para que se vea la inicial que hay debajo. Sustituye a
 * `onerror="this.remove()"`, que la CSP bloquea por ser código inline.
 */
export const BROKEN_IMG_SELECTOR = "img[data-remove-on-error]";

export function removeBrokenImages(root: Document = document) {
    // Las que ya fallaron antes de que corriera este script.
    root.querySelectorAll<HTMLImageElement>(BROKEN_IMG_SELECTOR).forEach(
        (img) => {
            if (img.complete && img.naturalWidth === 0) img.remove();
        },
    );
    // Las que fallen después (p. ej. con loading="lazy"). El evento `error` de
    // una imagen no burbujea, por eso se escucha en fase de captura.
    root.addEventListener(
        "error",
        (event) => {
            const target = event.target;
            if (
                target instanceof HTMLImageElement &&
                target.matches(BROKEN_IMG_SELECTOR)
            ) {
                target.remove();
            }
        },
        true,
    );
}
