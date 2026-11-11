import { describe, expect, it } from "vitest";
import { applySeason, variantFor, variantKey } from "../lib/scenes";

describe("variantFor", () => {
    it("usa la variante de la temporada si existe", () => {
        expect(
            variantFor(
                { default: "cuarto", christmas: "navidad" },
                "christmas",
            ),
        ).toBe("navidad");
    });

    it("cae en la de siempre si la temporada no tiene una propia", () => {
        expect(variantFor({ default: "cuarto" }, "halloween")).toBe("cuarto");
    });

    it("no pinta nada si es un adorno de otra temporada", () => {
        expect(
            variantFor({ christmas: "arbolito" }, "default"),
        ).toBeUndefined();
    });
});

describe("variantKey", () => {
    it("distingue la variante propia, la de siempre y ninguna", () => {
        const scene = { default: 1, christmas: 2 };
        expect(variantKey(scene, "christmas")).toBe("christmas");
        expect(variantKey(scene, "halloween")).toBe("default");
        expect(variantKey({ christmas: 1 }, "default")).toBe("none");
    });
});

// Un hueco como el que pinta SeasonalImage.astro.
function slot(current: string, templates: Record<string, string>) {
    const root = document.createElement("div");
    root.innerHTML = `<div data-season-slot data-season-current="${current}"><img alt="" src="${current}.avif">${Object.entries(
        templates,
    )
        .map(
            ([key, src]) =>
                `<template data-season="${key}">${src ? `<img alt="" src="${src}">` : ""}</template>`,
        )
        .join("")}</div>`;
    return root;
}

const shown = (root: HTMLElement) =>
    [...root.querySelectorAll("[data-season-slot] > img")].map((img) =>
        img.getAttribute("src"),
    );

describe("applySeason", () => {
    it("cambia a la variante de hoy si el build trajo otra", () => {
        const root = slot("default", { christmas: "navidad.avif" });
        applySeason(root, "christmas");
        expect(shown(root)).toEqual(["navidad.avif"]);
        expect(
            root.querySelector<HTMLElement>("[data-season-slot]")?.dataset
                .seasonCurrent,
        ).toBe("christmas");
    });

    it("no toca nada si ya es la de hoy", () => {
        const root = slot("christmas", { default: "cuarto.avif" });
        applySeason(root, "christmas");
        expect(shown(root)).toEqual(["christmas.avif"]);
    });

    it("una temporada sin variante propia usa la de siempre", () => {
        const root = slot("christmas", { default: "cuarto.avif" });
        applySeason(root, "halloween");
        expect(shown(root)).toEqual(["cuarto.avif"]);
    });

    it("quita el adorno fuera de su temporada y lo repone al volver", () => {
        const root = slot("christmas", { none: "" });
        applySeason(root, "default");
        expect(shown(root)).toEqual([]);
        applySeason(root, "christmas");
        expect(shown(root)).toEqual(["christmas.avif"]);
    });

    it("las variantes que no tocan quedan en plantillas (sin descargarse)", () => {
        const root = slot("default", { christmas: "navidad.avif" });
        expect(root.querySelectorAll("img")).toHaveLength(1);
        applySeason(root, "christmas");
        expect(root.querySelectorAll("img")).toHaveLength(1);
        expect(root.querySelectorAll("template")).toHaveLength(1);
    });
});
