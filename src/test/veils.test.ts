import { describe, expect, it } from "vitest";
import { veilAlpha, veilMask, type Veil } from "../lib/veils";

const side: Veil = {
    axis: "x",
    start: 0,
    size: 1000,
    stops: [
        [0, 1],
        [0.5, 0],
    ],
};

describe("veilAlpha", () => {
    it("interpola entre paradas", () => {
        expect(veilAlpha(side, 0)).toBe(1);
        expect(veilAlpha(side, 250)).toBe(0.5);
        expect(veilAlpha(side, 800)).toBe(0);
    });

    it("fuera del rectángulo no tapa", () => {
        expect(veilAlpha(side, -10)).toBe(0);
        expect(veilAlpha(side, 1200)).toBe(0);
    });
});

describe("veilMask", () => {
    it("pasa el velo a coordenadas de la escena (1 − opacidad)", () => {
        // Escena de 500 px desde x 250: empieza a media opacidad del velo.
        expect(veilMask([side], "x", 250, 500)).toBe(
            "linear-gradient(to right, rgb(0 0 0 / 0.5) 0%, #000 50%, #000 100%)",
        );
    });

    it("combina velos del mismo eje multiplicando lo que dejan ver", () => {
        const top: Veil = {
            axis: "y",
            start: 0,
            size: 100,
            stops: [
                [0, 0.5],
                [1, 0.5],
            ],
        };
        const all: Veil = {
            ...top,
            stops: [
                [0, 0.5],
                [1, 0.5],
            ],
        };
        expect(veilMask([top, all], "y", 0, 100)).toBe(
            "linear-gradient(to bottom, rgb(0 0 0 / 0.25) 0%, rgb(0 0 0 / 0.25) 100%)",
        );
    });

    it("sin velos en ese eje no hay máscara", () => {
        expect(veilMask([side], "y", 0, 500)).toBe("none");
    });
});
