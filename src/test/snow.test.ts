import { describe, expect, it } from "vitest";
import {
    LAYERS,
    SNOW_TIMING,
    createFlake,
    restingFlakes,
    snowOpacity,
    stepFlake,
} from "../lib/snow";

describe("createFlake", () => {
    it("nace dentro del ancho y sobre el borde superior", () => {
        for (let i = 0; i < 200; i++) {
            const f = createFlake(300);
            expect(f.x).toBeGreaterThanOrEqual(0);
            expect(f.x).toBeLessThanOrEqual(300);
            expect(f.y).toBeLessThan(0);
            const l = LAYERS[f.layer];
            expect(f.r).toBeGreaterThanOrEqual(l.r[0]);
            expect(f.r).toBeLessThanOrEqual(l.r[1]);
        }
    });

    it("los copos cercanos son más grandes y rápidos que los lejanos", () => {
        expect(LAYERS[2].r[0]).toBeGreaterThan(LAYERS[0].r[1]);
        expect(LAYERS[2].vy[0]).toBeGreaterThan(LAYERS[0].vy[1]);
    });
});

describe("stepFlake", () => {
    it("cae según su velocidad", () => {
        const f = createFlake(300, () => 0.5, 0);
        stepFlake(f, 1, 0);
        expect(f.y).toBeCloseTo(f.vy, 5);
    });
});

describe("snowOpacity", () => {
    it("entra, se mantiene y se apaga antes de los 5 s", () => {
        expect(snowOpacity(0)).toBe(0);
        expect(snowOpacity(2)).toBe(1);
        expect(snowOpacity(SNOW_TIMING.end)).toBe(0);
        expect(SNOW_TIMING.end).toBeLessThanOrEqual(5);
    });
});

describe("restingFlakes", () => {
    it("son siempre los mismos y caben en la tarjeta", () => {
        const a = restingFlakes(300, 500);
        expect(a).toEqual(restingFlakes(300, 500));
        for (const f of a) {
            expect(f.y).toBeGreaterThanOrEqual(0);
            expect(f.y).toBeLessThanOrEqual(500);
        }
    });
});
