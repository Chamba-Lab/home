/**
 * Temporadas del sitio (escenas y avatar del widget de Discord) según la
 * fecha de Lima. Lógica pura (sin imágenes) para poder probarla sin Astro; las
 * imágenes de cada temporada las asocian `scene/SeasonalImage.astro` y
 * `DiscordWidget.astro`.
 *
 * Añadir una festividad: su id en `SeasonId`, su ventana en `SEASONS`, su
 * avatar en `brand/discord/` y la variante de cada escena (ver DESIGN.md).
 */

import { limaToday } from "./events";

export type SeasonId = "default" | "halloween" | "christmas";

export interface SeasonWindow {
    id: Exclude<SeasonId, "default">;
    /** Primer día, "MM-DD" (incluido). */
    from: string;
    /** Último día, "MM-DD" (incluido). Si es menor que `from`, cruza el año. */
    to: string;
}

/** Ventanas de cada festividad; fuera de todas rige `default`. */
export const SEASONS: readonly SeasonWindow[] = [
    { id: "halloween", from: "10-01", to: "11-02" },
    { id: "christmas", from: "11-03", to: "01-06" },
];

/**
 * Fuerza un perfil sin importar la fecha (p. ej. "christmas" para revisarlo
 * fuera de temporada). `null` deja que decida la fecha.
 */
export const SEASON_OVERRIDE: SeasonId | null = null;

/** ¿El día "MM-DD" cae dentro de la ventana? Admite ventanas que cruzan el año. */
export function inWindow(monthDay: string, window: SeasonWindow): boolean {
    const { from, to } = window;
    return from <= to
        ? monthDay >= from && monthDay <= to
        : monthDay >= from || monthDay <= to;
}

/** Perfil para una fecha "YYYY-MM-DD"; el forzado manual manda si existe. */
export function seasonFor(
    dateIso: string,
    override: SeasonId | null = SEASON_OVERRIDE,
): SeasonId {
    if (override) return override;
    const monthDay = dateIso.slice(5, 10);
    return SEASONS.find((s) => inWindow(monthDay, s))?.id ?? "default";
}

/** Perfil de hoy según el calendario de Lima. */
export function currentSeason(
    now: Date = new Date(),
    override: SeasonId | null = SEASON_OVERRIDE,
): SeasonId {
    return seasonFor(limaToday(now), override);
}
