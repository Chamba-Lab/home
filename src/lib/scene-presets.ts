/**
 * Velos que se repiten en las escenas de Figma («03 · Diseño final»), en px
 * del marco de 1440 (escritorio) o de la franja (móvil).
 */
import type { Veil } from "./veils";

/** Cabecera con la escena a la derecha: velo del lado del texto y fundido
 *  inferior (equipo, dinámicas, ruleta; mismo que las categorías). */
export function headerVeils(height = 1020): Veil[] {
    return [
        {
            axis: "x",
            start: 0,
            size: 1440,
            stops: [
                [0, 0.97],
                [0.42, 0.9],
                [0.62, 0.35],
                [0.74, 0],
                [1, 0],
            ],
        },
        {
            axis: "y",
            start: 0,
            size: height,
            stops: [
                [0, 0],
                [0.48, 0],
                [0.6, 1],
                [1, 1],
            ],
        },
    ];
}

/** Franja móvil dentro del margen de la página (equipo, dinámicas, ruleta). */
export const STRIP_FADE = [
    [0, 0.6],
    [0.2, 0],
    [0.75, 0],
    [1, 1],
] as const;

/** Franja móvil de borde a borde entre secciones (inicio). */
export const SECTION_STRIP_FADE = [
    [0, 1],
    [0.18, 0],
    [0.7, 0],
    [1, 1],
] as const;
