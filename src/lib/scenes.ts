/**
 * Escenas del mundo de Rakim: cada lugar del sitio es una imagen por
 * temporada. Lógica pura para elegir la variante y para corregir en el
 * navegador la que trajo el build (el sitio se compila al fusionar y la
 * temporada puede cambiar después).
 *
 * El HTML trae la variante de la fecha del build; las demás van dentro de
 * `<template data-season="…">`, que el navegador no descarga hasta que
 * `applySeason` las pone en su sitio. Así solo se baja la temporada activa.
 */

import type { SeasonId } from "./seasons";

/** Una imagen por temporada; `default` rige fuera de las festividades. */
export type SeasonVariants<T> = Partial<Record<SeasonId, T>>;

/**
 * Variante de la temporada, o la de `default` si esa temporada no tiene una
 * propia. `undefined` si tampoco hay `default` (adornos que solo existen en
 * una festividad, como el arbolito de Navidad).
 */
export function variantFor<T>(
    variants: SeasonVariants<T>,
    season: SeasonId,
): T | undefined {
    return variants[season] ?? variants.default;
}

/**
 * Clave con la que se pinta cada temporada: la suya si tiene variante, la de
 * `default` si no, y `none` si no se pinta nada. Dos temporadas con la misma
 * clave comparten imagen y no hace falta cambiar nada al pasar de una a otra.
 */
export function variantKey(
    variants: SeasonVariants<unknown>,
    season: SeasonId,
): SeasonId | "none" {
    if (variants[season]) return season;
    return variants.default ? "default" : "none";
}

/**
 * Pone en cada `[data-season-slot]` la variante de `season`. Cada hueco trae
 * su variante actual en `data-season-current` y las demás en plantillas
 * `<template data-season="…">` (la vacía, `none`, deja el hueco sin imagen).
 */
export function applySeason(root: ParentNode, season: SeasonId) {
    root.querySelectorAll<HTMLElement>("[data-season-slot]").forEach((slot) => {
        const templates = slot.querySelectorAll<HTMLTemplateElement>(
            ":scope > template[data-season]",
        );
        const current = slot.dataset.seasonCurrent ?? "none";
        const has = (key: string) =>
            key === current ||
            [...templates].some((t) => t.dataset.season === key);
        // Misma regla que `variantKey`, con las variantes que trae el HTML.
        const want = has(season) ? season : has("default") ? "default" : "none";
        if (want === current) return;

        const next = [...templates].find((t) => t.dataset.season === want);
        if (!next) return;

        // La variante actual pasa a su plantilla para poder volver.
        const live = [...slot.childNodes].filter(
            (n) => !(n instanceof HTMLTemplateElement),
        );
        const saved = document.createElement("template");
        saved.dataset.season = current;
        live.forEach((n) => saved.content.appendChild(n));
        slot.appendChild(saved);

        slot.prepend(next.content.cloneNode(true));
        next.remove();
        slot.dataset.seasonCurrent = want;
    });
}
