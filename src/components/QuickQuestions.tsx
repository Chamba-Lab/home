import { useEffect, useRef, useState } from "react";
import { QUICK_QUESTIONS_I18N } from "../i18n/quick-questions";
import {
    COUNT_CHOICES,
    DEFAULT_TIMER_SECONDS,
    TIMER_CHOICES,
    buildRound,
    formatSeconds,
    nextIndex,
    roundSize,
    type QuickQuestion,
} from "../lib/quick-questions";

interface Pack {
    id: string;
    name: { es: string; en: string };
    questions: QuickQuestion[];
}

interface QuickQuestionsProps {
    packs: Pack[];
}

type Phase = "setup" | "question" | "revealed" | "done";

const LETTERS = ["A", "B", "C", "D", "E"];

const choiceClass = (active: boolean) =>
    `px-4 py-2 rounded-xl text-sm font-bold border transition-colors duration-200 ${
        active
            ? "bg-brand-yellow text-[#080D1A] border-brand-yellow"
            : "bg-slate-900/50 text-slate-300 border-white/10 hover:border-brand-yellow/40"
    }`;

const primaryButton =
    "bg-brand-yellow text-[#080D1A] font-bold px-8 py-3 rounded-xl hover:brightness-110 transition";
const ghostButton =
    "border border-white/15 text-slate-200 font-bold px-5 py-2.5 rounded-xl text-sm hover:border-brand-yellow/40 transition";

export default function QuickQuestions({ packs }: QuickQuestionsProps) {
    const [lang, setLang] = useState<"es" | "en">("es");

    useEffect(() => {
        const stored = localStorage.getItem("chamba-lab-lang");
        if (stored === "es" || stored === "en") setLang(stored);

        const handleLangChange = (e: Event) => {
            const detail = (e as CustomEvent<{ lang: "es" | "en" }>).detail;
            if (detail?.lang === "es" || detail?.lang === "en") {
                setLang(detail.lang);
            }
        };
        document.addEventListener("chamba-lab:lang", handleLangChange);
        return () =>
            document.removeEventListener("chamba-lab:lang", handleLangChange);
    }, []);

    const t = QUICK_QUESTIONS_I18N[lang];

    const [packId, setPackId] = useState(packs[0]?.id ?? "");
    const [count, setCount] = useState<number>(COUNT_CHOICES[0]);
    const [seconds, setSeconds] = useState<number>(DEFAULT_TIMER_SECONDS);
    const [phase, setPhase] = useState<Phase>("setup");
    const [round, setRound] = useState<QuickQuestion[]>([]);
    const [index, setIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timedOut, setTimedOut] = useState(false);
    const [paused, setPaused] = useState(false);
    const headingRef = useRef<HTMLHeadingElement>(null);
    // Time left in the open question, in ms (survives pauses).
    const remainingMs = useRef(0);
    // Questions already asked in this visit, so a new round avoids them.
    const seen = useRef<Set<string>>(new Set());

    const pack = packs.find((p) => p.id === packId) ?? packs[0];
    const current = round[index];
    const inStage = phase !== "setup";

    const openQuestion = (at: number) => {
        setIndex(at);
        setTimedOut(false);
        setPaused(false);
        remainingMs.current = seconds * 1000;
        setTimeLeft(seconds);
        setPhase("question");
    };

    const start = () => {
        if (!pack) return;
        const questions = buildRound(
            pack.questions,
            count,
            Math.random,
            seen.current,
        );
        if (questions.length === 0) return;
        const unseen = pack.questions.filter(
            (q) => !seen.current.has(q.question),
        ).length;
        // Fewer unseen than the round needs: the pack starts over.
        if (unseen < questions.length) seen.current.clear();
        questions.forEach((q) => seen.current.add(q.question));
        setRound(questions);
        openQuestion(0);
    };

    const reveal = () => setPhase("revealed");

    const advance = () => {
        const next = nextIndex(index, round.length);
        if (next === null) setPhase("done");
        else openQuestion(next);
    };

    const exit = () => setPhase("setup");

    // Countdown against a deadline, so it does not drift; a pause keeps what
    // is left and resumes from there.
    useEffect(() => {
        if (phase !== "question" || seconds === 0 || paused) return;
        const end = Date.now() + remainingMs.current;
        const id = window.setInterval(() => {
            const left = Math.max(0, end - Date.now());
            remainingMs.current = left;
            setTimeLeft(Math.ceil(left / 1000));
            if (left <= 0) {
                window.clearInterval(id);
                setTimedOut(true);
                setPhase("revealed");
            }
        }, 200);
        return () => window.clearInterval(id);
    }, [phase, seconds, paused, index]);

    // Keep focus on the question (or the closing title) so keyboard and
    // screen reader users follow the flow.
    useEffect(() => {
        if (phase === "question" || phase === "done") {
            headingRef.current?.focus();
        }
    }, [phase, index]);

    // The stage covers the page: stop the page behind it from scrolling.
    useEffect(() => {
        if (!inStage) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [inStage]);

    // Keyboard: Space / Enter move the round along, P pauses, Esc exits.
    useEffect(() => {
        if (!inStage) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                exit();
                return;
            }
            const target = e.target as HTMLElement | null;
            if (target?.closest("button, a, input, select, textarea")) return;
            if (
                (e.key === "p" || e.key === "P") &&
                phase === "question" &&
                seconds > 0
            ) {
                setPaused((value) => !value);
                return;
            }
            if (e.key !== " " && e.key !== "Enter") return;
            e.preventDefault();
            if (phase === "question") reveal();
            else if (phase === "revealed") advance();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    });

    if (!pack) return null;

    if (phase === "setup") {
        return (
            <div className="card-glass rounded-3xl border border-white/10 p-6 sm:p-10 max-w-3xl mx-auto">
                <fieldset className="mb-8">
                    <legend className="text-xs font-bold uppercase tracking-wider text-brand-yellow mb-3">
                        {t.packLabel}
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {packs.map((p) => (
                            <label
                                key={p.id}
                                className={`cursor-pointer rounded-2xl border p-4 transition-colors duration-200 focus-within:ring-2 focus-within:ring-brand-yellow ${
                                    p.id === packId
                                        ? "border-brand-yellow bg-brand-yellow/10"
                                        : "border-white/10 bg-slate-900/50 hover:border-brand-yellow/40"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="pack"
                                    value={p.id}
                                    checked={p.id === packId}
                                    onChange={() => setPackId(p.id)}
                                    className="sr-only"
                                />
                                <span className="block font-bold text-white text-sm mb-1">
                                    {p.name[lang]}
                                </span>
                                <span className="block text-xs text-slate-400">
                                    {t.questionsInPack(p.questions.length)}
                                </span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <div className="grid gap-6 sm:grid-cols-2 mb-8">
                    <fieldset>
                        <legend className="text-xs font-bold uppercase tracking-wider text-brand-yellow mb-3">
                            {t.countLabel}
                        </legend>
                        <div className="flex flex-wrap gap-2">
                            {COUNT_CHOICES.map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    aria-pressed={count === n}
                                    onClick={() => setCount(n)}
                                    className={choiceClass(count === n)}
                                >
                                    {t.countOption(
                                        roundSize(n, pack.questions.length),
                                    )}
                                </button>
                            ))}
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend className="text-xs font-bold uppercase tracking-wider text-brand-yellow mb-3">
                            {t.timerLabel}
                        </legend>
                        <div className="flex flex-wrap gap-2">
                            {TIMER_CHOICES.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    aria-pressed={seconds === s}
                                    onClick={() => setSeconds(s)}
                                    className={choiceClass(seconds === s)}
                                >
                                    {t.timerOption(s)}
                                </button>
                            ))}
                        </div>
                    </fieldset>
                </div>

                <p className="text-xs text-slate-500 mb-6">{t.spanishNote}</p>

                <button
                    type="button"
                    onClick={start}
                    className={`w-full sm:w-auto ${primaryButton}`}
                >
                    {t.start}
                </button>
            </div>
        );
    }

    // From here on the round fills the whole viewport: no page title, no
    // instructions, no box inside a box. It is made to be screen-shared.
    const revealed = phase === "revealed";
    const isLast = nextIndex(index, round.length) === null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={pack.name[lang]}
            className="fixed inset-0 z-[60] overflow-y-auto bg-bg"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-96 w-[48rem] max-w-full -translate-x-1/2 rounded-full bg-brand-yellow/5 blur-3xl"
            ></div>
            <div className="relative mx-auto flex min-h-full max-w-6xl flex-col px-5 py-5 sm:px-10 sm:py-8">
                <div className="flex items-center justify-between gap-4 text-sm font-bold">
                    <button
                        type="button"
                        onClick={exit}
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
                                        onClick={() => setPaused((v) => !v)}
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
                        <p className="text-lg text-slate-300 mb-10">
                            {t.doneBody(round.length)}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={start}
                                className={primaryButton}
                            >
                                {t.again}
                            </button>
                            <button
                                type="button"
                                onClick={exit}
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
                                    const isOther =
                                        revealed && i !== current.answer;
                                    return (
                                        <li
                                            key={`${index}-${i}`}
                                            className={`flex items-start gap-4 rounded-2xl border p-5 text-xl sm:text-2xl leading-snug transition-colors duration-200 ${
                                                isAnswer
                                                    ? "border-emerald-400 bg-emerald-400/10 text-white"
                                                    : isOther
                                                      ? "border-white/5 text-slate-400"
                                                      : "border-white/10 bg-slate-900/50 text-slate-100"
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
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div aria-live="polite">
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
                                        onClick={advance}
                                        className={primaryButton}
                                    >
                                        {isLast ? t.finish : t.next}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={reveal}
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
            </div>
        </div>
    );
}
