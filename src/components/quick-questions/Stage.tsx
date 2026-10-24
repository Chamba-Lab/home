import { useEffect, useRef, type Dispatch } from "react";
import type { QUICK_QUESTIONS_I18N } from "../../i18n/quick-questions";
import { formatSeconds, nextIndex } from "../../lib/quick-questions";
import type { RoundAction, RoundState } from "../../lib/quick-questions-round";
import type { Lang } from "../../lib/use-lang";
import ActivityStage from "../ActivityStage";
import { ghostButton, primaryButton } from "./styles";

const LETTERS = ["A", "B", "C", "D", "E"];

interface StageProps {
    t: (typeof QUICK_QUESTIONS_I18N)[Lang];
    label: string;
    state: RoundState;
    dispatch: Dispatch<RoundAction>;
    /** 0 means no timer. */
    seconds: number;
    timeLeft: number;
    onPlayAgain: () => void;
}

// The round fills the whole viewport: no page title, no instructions, no box
// inside a box. It is made to be screen-shared.
export default function Stage({
    t,
    label,
    state,
    dispatch,
    seconds,
    timeLeft,
    onPlayAgain,
}: StageProps) {
    const { phase, round, index, picked, timedOut, paused, answered, correct } =
        state;
    const current = round[index];
    const revealed = phase === "revealed";
    const isLast = nextIndex(index, round.length) === null;
    const headingRef = useRef<HTMLHeadingElement>(null);

    // Keep focus on the question (or the closing title) so keyboard and
    // screen reader users follow the flow.
    useEffect(() => {
        if (phase === "question" || phase === "done") {
            headingRef.current?.focus();
        }
    }, [phase, index, state.run]);

    // Keyboard: A-D or 1-4 pick an option, Space / Enter reveal or continue,
    // P pauses (Esc is handled by the stage).
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (phase === "question" && !e.ctrlKey && !e.metaKey && !e.altKey) {
                const byLetter = "abcde".indexOf(e.key.toLowerCase());
                const choice = byLetter >= 0 ? byLetter : Number(e.key) - 1;
                if (
                    e.key.length === 1 &&
                    choice >= 0 &&
                    choice < (current?.options.length ?? 0)
                ) {
                    e.preventDefault();
                    dispatch({ type: "reveal", choice });
                    return;
                }
            }
            const target = e.target as HTMLElement | null;
            if (target?.closest("button, a, input, select, textarea")) return;
            if (
                (e.key === "p" || e.key === "P") &&
                phase === "question" &&
                seconds > 0
            ) {
                dispatch({ type: "togglePause" });
                return;
            }
            if (e.key !== " " && e.key !== "Enter") return;
            e.preventDefault();
            if (phase === "question") dispatch({ type: "reveal" });
            else if (phase === "revealed") dispatch({ type: "advance" });
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [phase, current, seconds, dispatch]);

    return (
        <ActivityStage label={label} onClose={() => dispatch({ type: "exit" })}>
            <div className="flex items-center justify-between gap-4 text-sm font-bold">
                <button
                    type="button"
                    onClick={() => dispatch({ type: "exit" })}
                    className={ghostButton}
                >
                    {t.exit}
                </button>
                {phase === "question" || revealed ? (
                    <div className="flex items-center gap-4 sm:gap-6">
                        <span className="text-xs uppercase tracking-wider text-brand-yellow">
                            {t.progress(index + 1, round.length)}
                        </span>
                        {seconds > 0 && phase === "question" && (
                            <>
                                <span className="tabular-nums text-xl text-white">
                                    <span className="sr-only">
                                        {t.timeLeft}:{" "}
                                    </span>
                                    <span
                                        className={
                                            timeLeft <= 5 && !paused
                                                ? "text-red-300"
                                                : undefined
                                        }
                                    >
                                        {formatSeconds(timeLeft)}
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch({ type: "togglePause" })
                                    }
                                    aria-pressed={paused}
                                    className={ghostButton}
                                >
                                    {paused ? t.resume : t.pause}
                                </button>
                            </>
                        )}
                        {timedOut && revealed && (
                            <span className="text-red-300">{t.timeUp}</span>
                        )}
                    </div>
                ) : null}
            </div>

            {phase === "done" ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center py-16">
                    <h2
                        ref={headingRef}
                        tabIndex={-1}
                        className="font-display text-4xl sm:text-6xl font-extrabold text-white mb-4 outline-none"
                    >
                        {t.doneTitle}
                    </h2>
                    {answered > 0 && (
                        <p className="font-display text-3xl sm:text-4xl font-extrabold text-brand-yellow mb-3">
                            {t.score(correct, round.length)}
                        </p>
                    )}
                    {answered > 0 && answered < round.length && (
                        <p className="text-sm text-slate-400 mb-3">
                            {t.scoreNote(answered)}
                        </p>
                    )}
                    <p className="text-lg text-slate-300 mb-10">
                        {t.doneBody(round.length)}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={onPlayAgain}
                            className={primaryButton}
                        >
                            {t.again}
                        </button>
                        <button
                            type="button"
                            onClick={() => dispatch({ type: "exit" })}
                            className={ghostButton}
                        >
                            {t.changePack}
                        </button>
                    </div>
                </div>
            ) : (
                current && (
                    <div className="flex flex-1 flex-col justify-center py-10">
                        <p
                            role="status"
                            className="mb-4 min-h-5 text-sm font-bold uppercase tracking-wider text-slate-400"
                        >
                            {paused ? t.paused : ""}
                        </p>
                        <h2
                            ref={headingRef}
                            tabIndex={-1}
                            className="font-display text-3xl sm:text-5xl font-extrabold leading-tight text-white mb-10 outline-none"
                        >
                            {current.question}
                        </h2>

                        <ul
                            role="list"
                            className="grid gap-4 md:grid-cols-2 mb-8"
                        >
                            {current.options.map((option, i) => {
                                const isAnswer =
                                    revealed && i === current.answer;
                                const isWrongPick =
                                    revealed &&
                                    i === picked &&
                                    i !== current.answer;
                                const isOther =
                                    revealed && !isAnswer && !isWrongPick;
                                return (
                                    <li key={`${index}-${i}`}>
                                        <button
                                            type="button"
                                            disabled={revealed}
                                            onClick={() =>
                                                dispatch({
                                                    type: "reveal",
                                                    choice: i,
                                                })
                                            }
                                            className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left text-xl sm:text-2xl leading-snug transition-colors duration-200 ${
                                                isAnswer
                                                    ? "border-emerald-400 bg-emerald-400/10 text-white"
                                                    : isWrongPick
                                                      ? "border-red-400 bg-red-400/10 text-white"
                                                      : isOther
                                                        ? "border-white/5 text-slate-400"
                                                        : "border-white/10 bg-slate-900/50 text-slate-100 hover:border-brand-yellow/50 hover:bg-slate-900/80"
                                            }`}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-base font-bold ${
                                                    isAnswer
                                                        ? "bg-emerald-400 text-[#080D1A]"
                                                        : "bg-white/10 text-slate-300"
                                                }`}
                                            >
                                                {LETTERS[i]}
                                            </span>
                                            <span>
                                                <span className="sr-only">
                                                    {t.optionWord} {LETTERS[i]}
                                                    :{" "}
                                                </span>
                                                {option}
                                                {isAnswer && (
                                                    <span className="sr-only">
                                                        {" "}
                                                        ({t.correct})
                                                    </span>
                                                )}
                                                {isWrongPick && (
                                                    <span className="sr-only">
                                                        {" "}
                                                        ({t.picked})
                                                    </span>
                                                )}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>

                        <div aria-live="polite">
                            {revealed && picked !== null && (
                                <p
                                    className={`mb-4 text-2xl font-extrabold ${
                                        picked === current.answer
                                            ? "text-emerald-300"
                                            : "text-red-300"
                                    }`}
                                >
                                    {picked === current.answer
                                        ? t.right
                                        : t.wrong}
                                </p>
                            )}
                            {revealed && current.explanation && (
                                <p className="mb-8 border-l-2 border-emerald-400/60 pl-4 text-lg leading-relaxed text-slate-200">
                                    <span className="font-bold text-white">
                                        {t.why}:{" "}
                                    </span>
                                    {current.explanation}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            {revealed ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch({ type: "advance" })
                                    }
                                    className={primaryButton}
                                >
                                    {isLast ? t.finish : t.next}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => dispatch({ type: "reveal" })}
                                    className={primaryButton}
                                >
                                    {t.reveal}
                                </button>
                            )}
                            <span className="hidden text-xs text-slate-400 sm:inline">
                                {t.hintKeys}
                            </span>
                        </div>
                    </div>
                )
            )}
        </ActivityStage>
    );
}
