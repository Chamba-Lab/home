// Logic of Quick Questions (Preguntas Rápidas): pure functions, no DOM.

export interface QuickQuestion {
    question: string;
    options: string[];
    // Index in `options` of the correct answer.
    answer: number;
    explanation?: string;
}

export const COUNT_CHOICES = [5, 10] as const;
export const TIMER_CHOICES = [0, 10, 20, 30] as const;
export const DEFAULT_TIMER_SECONDS = 20;

type Rng = () => number;

/** Fisher-Yates shuffle; returns a copy. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

/** Shuffles the options of a question and remaps the correct answer. */
export function shuffleOptions(
    question: QuickQuestion,
    rng: Rng = Math.random,
): QuickQuestion {
    const order = shuffle(
        question.options.map((_, index) => index),
        rng,
    );
    return {
        ...question,
        options: order.map((index) => question.options[index]),
        answer: order.indexOf(question.answer),
    };
}

/** Clamps the requested count to what the pack has (at least 1 if any). */
export function roundSize(requested: number, available: number): number {
    return Math.max(0, Math.min(requested, available));
}

/** A round: random questions of a pack, in random order, options shuffled. */
export function buildRound(
    pack: readonly QuickQuestion[],
    count: number,
    rng: Rng = Math.random,
): QuickQuestion[] {
    return shuffle(pack, rng)
        .slice(0, roundSize(count, pack.length))
        .map((question) => shuffleOptions(question, rng));
}

/** Index of the next question, or null when the round is over. */
export function nextIndex(current: number, total: number): number | null {
    return current + 1 < total ? current + 1 : null;
}

/** Formats seconds as m:ss for the timer. */
export function formatSeconds(seconds: number): string {
    const safe = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(safe / 60);
    return `${minutes}:${String(safe % 60).padStart(2, "0")}`;
}
