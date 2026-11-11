/**
 * Velos de Figma convertidos en máscaras CSS para las escenas.
 *
 * En Figma, cada escena lleva encima rectángulos con un degradado del color
 * del fondo (el «velo»): oscurecen la zona del texto o funden un borde. En la
 * web, el mismo efecto se logra con una máscara sobre la escena: donde el velo
 * tapa con opacidad `a`, la escena se ve con opacidad `1 − a` sobre el fondo
 * de la página. Así no hace falta repetir el color del fondo y lo que va
 * debajo (el brillo de una categoría) se sigue viendo.
 */

/** Un velo de Figma: degradado en un eje, en px del marco de Figma. */
export interface Veil {
    axis: "x" | "y";
    /** Inicio del rectángulo del velo en ese eje. */
    start: number;
    /** Largo del rectángulo del velo en ese eje. */
    size: number;
    /** Paradas del degradado: [posición 0–1, opacidad 0–1]. */
    stops: readonly (readonly [number, number])[];
}

/** Opacidad del velo en la coordenada `at` (0 fuera de su rectángulo). */
export function veilAlpha(veil: Veil, at: number): number {
    if (at < veil.start || at > veil.start + veil.size) return 0;
    const t = veil.size === 0 ? 0 : (at - veil.start) / veil.size;
    const stops = veil.stops;
    if (t <= stops[0][0]) return stops[0][1];
    for (let i = 1; i < stops.length; i++) {
        const [p1, a1] = stops[i];
        if (t <= p1) {
            const [p0, a0] = stops[i - 1];
            return p1 === p0 ? a1 : a0 + ((a1 - a0) * (t - p0)) / (p1 - p0);
        }
    }
    return stops[stops.length - 1][1];
}

const round = (n: number, d = 2) => Number(n.toFixed(d));

/**
 * Máscara (`linear-gradient`) de una escena en un eje: la escena empieza en
 * `from` y mide `size` (en px del marco); se combinan todos los velos de ese
 * eje. Devuelve `none` si ningún velo la toca.
 */
export function veilMask(
    veils: readonly Veil[],
    axis: "x" | "y",
    from: number,
    size: number,
): string {
    const mine = veils.filter((v) => v.axis === axis);
    // Puntos donde cambia la pendiente: bordes de la escena y paradas.
    const points = new Set<number>([0, size]);
    for (const veil of mine) {
        for (const [p] of veil.stops) {
            const local = veil.start + p * veil.size - from;
            if (local > 0 && local < size) points.add(local);
        }
        for (const edge of [veil.start, veil.start + veil.size]) {
            const local = edge - from;
            if (local > 0 && local < size) points.add(local);
        }
    }
    const stops = [...points]
        .sort((a, b) => a - b)
        .map((local) => {
            const visible = mine.reduce(
                (acc, veil) => acc * (1 - veilAlpha(veil, from + local)),
                1,
            );
            return [round((local / size) * 100), round(visible, 3)] as const;
        });
    if (stops.every(([, v]) => v === 1)) return "none";
    const direction = axis === "x" ? "to right" : "to bottom";
    const parts = stops.map(([pos, v]) =>
        v === 1 ? `#000 ${pos}%` : `rgb(0 0 0 / ${v}) ${pos}%`,
    );
    return `linear-gradient(${direction}, ${parts.join(", ")})`;
}
