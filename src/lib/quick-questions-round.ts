// State of a Quick Questions round: a pure reducer, no DOM.
import { nextIndex, type QuickQuestion } from "./quick-questions";

export type Phase = "setup" | "question" | "revealed" | "done";

export interface RoundState {
    phase: Phase;
    round: QuickQuestion[];
    index: number;
    /** Option chosen by click (null: revealed with the button or by time). */
    picked: number | null;
    timedOut: boolean;
    paused: boolean;
    /** Options chosen by click so far, and how many were right. */
    answered: number;
    correct: number;
    /** Changes with every start, so a countdown restarts even at index 0. */
    run: number;
}

export type RoundAction =
    | { type: "start"; round: QuickQuestion[] }
    | { type: "reveal"; choice?: number | null; byTime?: boolean }
    | { type: "advance" }
    | { type: "togglePause" }
    | { type: "exit" };

export const INITIAL_ROUND: RoundState = {
    phase: "setup",
    round: [],
    index: 0,
    picked: null,
    timedOut: false,
    paused: false,
    answered: 0,
    correct: 0,
    run: 0,
};

export function roundReducer(
    state: RoundState,
    action: RoundAction,
): RoundState {
    switch (action.type) {
        case "start":
            if (action.round.length === 0) return state;
            return {
                ...INITIAL_ROUND,
                phase: "question",
                round: action.round,
                run: state.run + 1,
            };
        case "reveal": {
            if (state.phase !== "question") return state;
            const choice = action.choice ?? null;
            const current = state.round[state.index];
            const chosen = choice !== null && current !== undefined;
            return {
                ...state,
                phase: "revealed",
                picked: choice,
                timedOut: Boolean(action.byTime),
                paused: false,
                answered: state.answered + (chosen ? 1 : 0),
                correct:
                    state.correct +
                    (chosen && choice === current.answer ? 1 : 0),
            };
        }
        case "advance": {
            if (state.phase !== "revealed") return state;
            const next = nextIndex(state.index, state.round.length);
            if (next === null) return { ...state, phase: "done" };
            return {
                ...state,
                phase: "question",
                index: next,
                picked: null,
                timedOut: false,
                paused: false,
            };
        }
        case "togglePause":
            if (state.phase !== "question") return state;
            return { ...state, paused: !state.paused };
        case "exit":
            return { ...state, phase: "setup", paused: false };
    }
}
