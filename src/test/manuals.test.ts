import { existsSync } from "node:fs";
import { describe, it, expect } from "vitest";
import manuals from "../content/manuals.json";
import {
    manualCountLabel,
    manualFormatLabel,
    manualNumberLabel,
    manualPdfPath,
    sortManuals,
} from "../lib/manuals";

describe("manuals.json", () => {
    it("has unique ids and numbers", () => {
        expect(new Set(manuals.map((m) => m.id)).size).toBe(manuals.length);
        expect(new Set(manuals.map((m) => m.number)).size).toBe(manuals.length);
    });

    it("has a PDF and a cover for every manual", () => {
        for (const { id } of manuals) {
            expect(existsSync(`public${manualPdfPath(id)}`), id).toBe(true);
            expect(existsSync(`src/assets/manuals/${id}.png`), id).toBe(true);
        }
    });
});

describe("manual labels", () => {
    it("sorts the newest first without changing the input", () => {
        const input = [{ number: 1 }, { number: 3 }, { number: 2 }];
        expect(sortManuals(input).map((m) => m.number)).toEqual([3, 2, 1]);
        expect(input[0].number).toBe(1);
    });

    it("pads the number", () => {
        expect(manualNumberLabel(2)).toBe("MANUAL 02");
        expect(manualNumberLabel(12)).toBe("MANUAL 12");
    });

    it("pluralizes the count in both languages", () => {
        expect(manualCountLabel(1, "es")).toBe("1 manual");
        expect(manualCountLabel(2, "es")).toBe("2 manuales");
        expect(manualCountLabel(1, "en")).toBe("1 manual");
        expect(manualCountLabel(2, "en")).toBe("2 manuals");
    });

    it("shows the size and warns in English that the PDF is in Spanish", () => {
        expect(manualFormatLabel(4612788, "es")).toBe("PDF · 4,4 MB");
        expect(manualFormatLabel(2551719, "en")).toBe(
            "PDF in Spanish · 2.4 MB",
        );
    });
});
