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

/** Clamps the requested count to what the pack has (0 if it is empty). */
export function roundSize(requested: number, available: number): number {
    return Math.max(0, Math.min(requested, available));
}

/**
 * A round: random questions of a pack, in random order, options shuffled.
 * `seen` holds the questions already asked, oldest first (a Set keeps its
 * insertion order): the round takes unseen ones first and, when they run
 * out, the ones asked longest ago.
 */
export function buildRound(
    pack: readonly QuickQuestion[],
    count: number,
    rng: Rng = Math.random,
    seen: ReadonlySet<string> = new Set(),
): QuickQuestion[] {
    const order = [...seen];
    const fresh = shuffle(
        pack.filter((q) => !seen.has(q.question)),
        rng,
    );
    const repeated = pack
        .filter((q) => seen.has(q.question))
        .sort((a, b) => order.indexOf(a.question) - order.indexOf(b.question));
    return shuffle(
        [...fresh, ...repeated].slice(0, roundSize(count, pack.length)),
        rng,
    ).map((question) => shuffleOptions(question, rng));
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
