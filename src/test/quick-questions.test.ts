import { describe, expect, it } from "vitest";
import data from "../content/quick-questions.json";
import {
    buildRound,
    formatSeconds,
    nextIndex,
    roundSize,
    shuffle,
    shuffleOptions,
    type QuickQuestion,
} from "../lib/quick-questions";

// Deterministic generator so the shuffles are repeatable.
function seeded(seed: number) {
    let state = seed;
    return () => {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
}

const sample: QuickQuestion[] = Array.from({ length: 8 }, (_, i) => ({
    question: `Q${i}`,
    options: ["a", "b", "c", "d"],
    answer: i % 4,
}));

describe("quick-questions lib", () => {
    it("shuffle keeps every item and does not mutate the input", () => {
        const input = [1, 2, 3, 4, 5, 6];
        const out = shuffle(input, seeded(1));
        expect([...out].sort()).toEqual(input);
        expect(input).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("shuffleOptions keeps pointing at the correct option", () => {
        const q: QuickQuestion = {
            question: "?",
            options: ["w", "x", "y", "z"],
            answer: 2,
        };
        for (let seed = 1; seed <= 20; seed++) {
            const out = shuffleOptions(q, seeded(seed));
            expect(out.options[out.answer]).toBe("y");
            expect([...out.options].sort()).toEqual(["w", "x", "y", "z"]);
        }
    });

    it("roundSize never exceeds what the pack has", () => {
        expect(roundSize(10, 12)).toBe(10);
        expect(roundSize(10, 4)).toBe(4);
        expect(roundSize(5, 0)).toBe(0);
    });

    it("buildRound returns distinct questions up to the requested count", () => {
        const round = buildRound(sample, 5, seeded(3));
        expect(round).toHaveLength(5);
        expect(new Set(round.map((q) => q.question)).size).toBe(5);
        expect(buildRound(sample, 20, seeded(3))).toHaveLength(8);
    });

    it("buildRound avoids questions already seen until it runs out of new ones", () => {
        const seen = new Set(["Q0", "Q1", "Q2", "Q3", "Q4"]);
        const fresh = buildRound(sample, 3, seeded(5), seen).map(
            (q) => q.question,
        );
        expect(fresh.sort()).toEqual(["Q5", "Q6", "Q7"]);
    });

    it("buildRound repeats the questions asked longest ago first", () => {
        // All seen, Q0 first and Q7 last: the oldest come back first.
        const seen = new Set(sample.map((q) => q.question));
        const round = buildRound(sample, 3, seeded(9), seen).map(
            (q) => q.question,
        );
        expect(round.sort()).toEqual(["Q0", "Q1", "Q2"]);
        // Five new ones needed but only three unseen: the two oldest fill in.
        const some = new Set(["Q0", "Q1", "Q2", "Q3", "Q4"]);
        const mixed = buildRound(sample, 5, seeded(9), some).map(
            (q) => q.question,
        );
        expect(mixed.sort()).toEqual(["Q0", "Q1", "Q5", "Q6", "Q7"]);
    });

    it("nextIndex advances and ends the round", () => {
        expect(nextIndex(0, 3)).toBe(1);
        expect(nextIndex(2, 3)).toBeNull();
    });

    it("formatSeconds renders m:ss and never goes negative", () => {
        expect(formatSeconds(20)).toBe("0:20");
        expect(formatSeconds(65)).toBe("1:05");
        expect(formatSeconds(-3)).toBe("0:00");
    });
});

describe("quick-questions.json", () => {
    const { packs } = data[0];

    it("has unique pack ids with a bilingual name", () => {
        const ids = packs.map((p) => p.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const p of packs) {
            expect(p.name.es.length, p.id).toBeGreaterThan(0);
            expect(p.name.en.length, p.id).toBeGreaterThan(0);
        }
    });

    it("has enough questions per pack for a round of 10", () => {
        for (const p of packs) {
            expect(p.questions.length, p.id).toBeGreaterThanOrEqual(10);
        }
    });

    it("points every answer at an existing option, with no repeated options", () => {
        for (const p of packs) {
            for (const q of p.questions) {
                const label = `${p.id}: ${q.question}`;
                expect(q.options.length, label).toBeGreaterThanOrEqual(2);
                expect(q.answer, label).toBeLessThan(q.options.length);
                expect(new Set(q.options).size, label).toBe(q.options.length);
            }
        }
    });

    it("does not give the answer away by its length", () => {
        // The correct option should not be systematically the longest one.
        for (const p of packs) {
            const longest = p.questions.filter((q) => {
                const lengths = q.options.map((o) => o.length);
                const max = Math.max(...lengths);
                return (
                    lengths[q.answer] === max &&
                    lengths.filter((n) => n === max).length === 1
                );
            }).length;
            expect(longest / p.questions.length, p.id).toBeLessThanOrEqual(
                1 / 3,
            );
        }
    });

    it("has no repeated question within a pack", () => {
        for (const p of packs) {
            const texts = p.questions.map((q) => q.question);
            expect(new Set(texts).size, p.id).toBe(texts.length);
        }
    });
});
