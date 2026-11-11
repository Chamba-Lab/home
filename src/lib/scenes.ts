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
        // Misma regla que `variantKey`, con las variantes que trae el HTML.
        swapVariant(slot, "season", (has) =>
            has(season) ? season : has("default") ? "default" : "none",
        );
    });
}

/** Momento del día de una escena que cambia con la hora de Lima. */
export type Daypart = "day" | "night";

/** Hora de inicio y de fin de la noche en Lima (de 19:00 a 05:59). */
export const NIGHT_FROM_HOUR = 19;
export const NIGHT_TO_HOUR = 6;

/** Hora en Lima (0–23). */
export function limaHour(now: Date = new Date()): number {
    const hour = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Lima",
        hour: "numeric",
        hourCycle: "h23",
    }).format(now);
    return Number(hour);
}

/** De día o de noche según la hora de Lima. */
export function daypartFor(hour: number): Daypart {
    return hour >= NIGHT_FROM_HOUR || hour < NIGHT_TO_HOUR ? "night" : "day";
}

/**
 * Pone en cada `[data-daypart-slot]` la escena de `daypart` y luego su
 * temporada. A diferencia de la temporada, el build no puede adivinar la
 * hora de quien visita: el HTML trae las dos escenas en plantillas
 * (`<template data-daypart="day|night">`) y solo se descarga la que toca.
 */
export function applyDaypart(
    root: ParentNode,
    daypart: Daypart,
    season: SeasonId,
) {
    root.querySelectorAll<HTMLElement>("[data-daypart-slot]").forEach(
        (slot) => {
            swapVariant(slot, "daypart", (has) =>
                has(daypart)
                    ? daypart
                    : (slot.dataset.daypartCurrent ?? "none"),
            );
            applySeason(slot, season);
        },
    );
}

/**
 * Cambia el contenido de un hueco por el de la plantilla que elige `pick`.
 * El hueco guarda su variante actual en `data-<attr>-current` y las demás en
 * `<template data-<attr>="…">` hijas directas; la actual pasa a su plantilla
 * para poder volver.
 */
function swapVariant(
    slot: HTMLElement,
    attr: "season" | "daypart",
    pick: (has: (key: string) => boolean) => string,
) {
    const currentKey = `${attr}Current` as const;
    const templates = [
        ...slot.querySelectorAll<HTMLTemplateElement>(
            `:scope > template[data-${attr}]`,
        ),
    ];
    const current = slot.dataset[currentKey] ?? "none";
    const has = (key: string) =>
        key === current || templates.some((t) => t.dataset[attr] === key);
    const want = pick(has);
    if (want === current) return;

    const next = templates.find((t) => t.dataset[attr] === want);
    if (!next) return;

    const live = [...slot.childNodes].filter(
        (n) => !(n instanceof HTMLTemplateElement),
    );
    const saved = document.createElement("template");
    saved.dataset[attr] = current;
    live.forEach((n) => saved.content.appendChild(n));
    slot.appendChild(saved);

    slot.prepend(next.content.cloneNode(true));
    next.remove();
    slot.dataset[currentKey] = want;
}
