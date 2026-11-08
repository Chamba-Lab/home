/**
 * Nevada del perfil de Navidad del widget de Discord: copos en tres capas de
 * profundidad (lejos, medio, cerca) con viento y vaivén. Lógica pura para
 * poder probarla; el dibujo en canvas vive en `SeasonDecor.astro`.
 */

export interface Flake {
    x: number;
    y: number;
    /** Radio en px CSS. */
    r: number;
    /** Velocidad de caída en px/s. */
    vy: number;
    /** Opacidad máxima de la capa. */
    alpha: number;
    /** Fase y amplitud del vaivén horizontal. */
    phase: number;
    sway: number;
    /** 0 = lejos, 1 = medio, 2 = cerca (los cercanos sienten más el viento). */
    layer: 0 | 1 | 2;
}

interface Layer {
    r: [number, number];
    vy: [number, number];
    alpha: number;
    sway: [number, number];
    /** Peso relativo de la capa al generar copos. */
    weight: number;
}

export const LAYERS: readonly Layer[] = [
    { r: [0.7, 1.2], vy: [22, 32], alpha: 0.35, sway: [4, 8], weight: 5 },
    { r: [1.3, 2], vy: [40, 55], alpha: 0.6, sway: [8, 14], weight: 3 },
    { r: [2.2, 3.2], vy: [65, 85], alpha: 0.6, sway: [12, 20], weight: 1.5 },
];

/** Tiempos del momento de nevada, en segundos (WCAG 2.2.2: no más de 5 s). */
export const SNOW_TIMING = { emit: 3.2, fadeFrom: 4, end: 5 } as const;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function pickLayer(rand: () => number): 0 | 1 | 2 {
    const total = LAYERS.reduce((s, l) => s + l.weight, 0);
    let roll = rand() * total;
    for (let i = 0; i < LAYERS.length; i++) {
        roll -= LAYERS[i].weight;
        if (roll <= 0) return i as 0 | 1 | 2;
    }
    return 0;
}

/** Copo nuevo; `y` por defecto justo encima del borde superior. */
export function createFlake(
    width: number,
    rand: () => number = Math.random,
    y?: number,
): Flake {
    const layer = pickLayer(rand);
    const l = LAYERS[layer];
    const r = lerp(l.r[0], l.r[1], rand());
    return {
        x: rand() * width,
        y: y ?? -r * 2 - rand() * 20,
        r,
        vy: lerp(l.vy[0], l.vy[1], rand()),
        alpha: l.alpha,
        phase: rand() * Math.PI * 2,
        sway: lerp(l.sway[0], l.sway[1], rand()),
        layer,
    };
}

/** Viento global (px/s): una brisa que va y viene. */
export function wind(t: number): number {
    return 10 + Math.sin(t * 0.7) * 9 + Math.sin(t * 1.9) * 3;
}

/** Avanza un copo `dt` segundos en el instante `t`. */
export function stepFlake(f: Flake, dt: number, t: number): void {
    const depth = 0.4 + f.layer * 0.3;
    f.y += f.vy * dt;
    f.x += (wind(t) * depth + Math.cos(t * 1.3 + f.phase) * f.sway) * dt;
}

/** Opacidad global de la nevada: entra rápido y se desvanece al final. */
export function snowOpacity(t: number): number {
    if (t < 0.4) return t / 0.4;
    if (t <= SNOW_TIMING.fadeFrom) return 1;
    return Math.max(
        0,
        1 -
            (t - SNOW_TIMING.fadeFrom) /
                (SNOW_TIMING.end - SNOW_TIMING.fadeFrom),
    );
}

/** Copos quietos del reposo: pocos, lejanos y repartidos (posiciones fijas). */
export function restingFlakes(width: number, height: number): Flake[] {
    let seed = 7;
    const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    return Array.from({ length: 14 }, () => {
        const f = createFlake(width, rand, rand() * height);
        return { ...f, alpha: f.alpha * 0.45 };
    });
}

/** Borde superior del botón donde se posan copos (px dentro de la tarjeta). */
export interface Ledge {
    top: number;
    left: number;
    right: number;
}

/** Copo posado sobre el botón: se derrite y desaparece. */
export interface Settled {
    x: number;
    y: number;
    r: number;
    alpha: number;
    /** Instante (s) en que se posó. */
    born: number;
}

/** Segundos que tarda en derretirse un copo posado. */
export const MELT_S = 2.2;

/**
 * ¿El copo cruzó el borde del botón en este paso? Solo los copos de las capas
 * media y cercana, que están "a la altura" del botón; los lejanos pasan detrás.
 */
export function landsOn(f: Flake, prevY: number, ledge: Ledge): boolean {
    return (
        f.layer > 0 &&
        prevY + f.r <= ledge.top &&
        f.y + f.r >= ledge.top &&
        f.x >= ledge.left + 6 &&
        f.x <= ledge.right - 6
    );
}

/** Posa un copo justo encima del borde del botón. */
export function settle(f: Flake, ledge: Ledge, t: number): Settled {
    return {
        x: f.x,
        y: ledge.top - f.r * 0.9,
        r: f.r,
        // Posado se ve más que en el aire: ya no lo atenúa la profundidad.
        alpha: Math.max(f.alpha, 0.85),
        born: t,
    };
}

/** Opacidad de un copo posado: se queda un instante y luego se derrite. */
export function meltAlpha(s: Settled, t: number): number {
    const age = t - s.born;
    if (age < 0.25) return s.alpha;
    return Math.max(0, s.alpha * (1 - (age - 0.25) / MELT_S));
}
