import { useReducer, useRef, useState } from "react";
import { QUICK_QUESTIONS_I18N } from "../i18n/quick-questions";
import {
    COUNT_CHOICES,
    DEFAULT_TIMER_SECONDS,
    buildRound,
} from "../lib/quick-questions";
import { INITIAL_ROUND, roundReducer } from "../lib/quick-questions-round";
import { useCountdown } from "../lib/use-countdown";
import { useLang } from "../lib/use-lang";
import Setup, { type Pack } from "./quick-questions/Setup";
import Stage from "./quick-questions/Stage";

interface QuickQuestionsProps {
    packs: Pack[];
}

export default function QuickQuestions({ packs }: QuickQuestionsProps) {
    const lang = useLang();
    const t = QUICK_QUESTIONS_I18N[lang];

    const [packId, setPackId] = useState(packs[0]?.id ?? "");
    const [count, setCount] = useState<number>(COUNT_CHOICES[0]);
    const [seconds, setSeconds] = useState<number>(DEFAULT_TIMER_SECONDS);
    const [state, dispatch] = useReducer(roundReducer, INITIAL_ROUND);
    // Questions already asked in this visit, so a new round avoids them.
    const seen = useRef<Set<string>>(new Set());

    const pack = packs.find((p) => p.id === packId) ?? packs[0];

    const timeLeft = useCountdown({
        active: state.phase === "question" && !state.paused,
        seconds,
        resetKey: `${state.run}:${state.index}`,
        onEnd: () => dispatch({ type: "reveal", byTime: true }),
    });

    const start = () => {
        if (!pack) return;
        const questions = buildRound(
            pack.questions,
            count,
            Math.random,
            seen.current,
        );
        // Re-adding moves a question to the end: the order is "oldest first".
        questions.forEach((q) => {
            seen.current.delete(q.question);
            seen.current.add(q.question);
        });
        dispatch({ type: "start", round: questions });
    };

    if (!pack) return null;

    if (state.phase === "setup") {
        return (
            <Setup
                t={t}
                lang={lang}
                packs={packs}
                packId={packId}
                onPack={setPackId}
                count={count}
                onCount={setCount}
                seconds={seconds}
                onSeconds={setSeconds}
                onStart={start}
            />
        );
    }

    return (
        <Stage
            t={t}
            label={pack.name[lang]}
            state={state}
            dispatch={dispatch}
            seconds={seconds}
            timeLeft={timeLeft}
            onPlayAgain={start}
        />
    );
}
