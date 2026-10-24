import { describe, expect, it } from "vitest";
import type { QuickQuestion } from "../lib/quick-questions";
import {
    INITIAL_ROUND,
    roundReducer,
    type RoundAction,
    type RoundState,
} from "../lib/quick-questions-round";

const round: QuickQuestion[] = [
    { question: "Q0", options: ["a", "b"], answer: 0 },
    { question: "Q1", options: ["a", "b"], answer: 1 },
    { question: "Q2", options: ["a", "b"], answer: 0 },
];

const run = (actions: RoundAction[], from: RoundState = INITIAL_ROUND) =>
    actions.reduce(roundReducer, from);

describe("roundReducer", () => {
    it("starts a round on the first question and ignores an empty one", () => {
        const started = run([{ type: "start", round }]);
        expect(started).toMatchObject({ phase: "question", index: 0 });
        expect(run([{ type: "start", round: [] }])).toBe(INITIAL_ROUND);
    });

    it("counts right answers only when an option was chosen", () => {
        const state = run([
            { type: "start", round },
            { type: "reveal", choice: 0 }, // right
            { type: "advance" },
            { type: "reveal", choice: 0 }, // wrong
            { type: "advance" },
            { type: "reveal" }, // revealed without choosing
        ]);
        expect(state).toMatchObject({ answered: 2, correct: 1, picked: null });
    });

    it("does not count a question twice", () => {
        const state = run([
            { type: "start", round },
            { type: "reveal", choice: 0 },
            { type: "reveal", choice: 0 },
        ]);
        expect(state).toMatchObject({ answered: 1, correct: 1 });
    });

    it("marks a question revealed by time", () => {
        const state = run([
            { type: "start", round },
            { type: "reveal", byTime: true },
        ]);
        expect(state).toMatchObject({ phase: "revealed", timedOut: true });
        expect(run([{ type: "advance" }], state).timedOut).toBe(false);
    });

    it("finishes after the last question", () => {
        const state = run([
            { type: "start", round },
            ...round.flatMap((): RoundAction[] => [
                { type: "reveal" },
                { type: "advance" },
            ]),
        ]);
        expect(state.phase).toBe("done");
    });

    it("only advances after a reveal", () => {
        const started = run([{ type: "start", round }]);
        expect(roundReducer(started, { type: "advance" })).toBe(started);
    });

    it("pauses only while a question is open, and a reveal clears the pause", () => {
        const started = run([{ type: "start", round }]);
        const paused = roundReducer(started, { type: "togglePause" });
        expect(paused.paused).toBe(true);
        expect(roundReducer(paused, { type: "reveal" }).paused).toBe(false);
        const revealed = roundReducer(started, { type: "reveal" });
        expect(roundReducer(revealed, { type: "togglePause" })).toBe(revealed);
    });

    it("exits to the setup and changes `run` on every start", () => {
        const first = run([{ type: "start", round }]);
        expect(roundReducer(first, { type: "exit" }).phase).toBe("setup");
        const second = run([{ type: "exit" }, { type: "start", round }], first);
        expect(second.run).toBe(first.run + 1);
        expect(second).toMatchObject({ answered: 0, correct: 0 });
    });
});
