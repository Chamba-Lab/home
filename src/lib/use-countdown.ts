import { useEffect, useRef, useState } from "react";

interface CountdownOptions {
    /** Counting only while true; false pauses and keeps what is left. */
    active: boolean;
    seconds: number;
    /** A new key restarts the countdown from `seconds`. */
    resetKey: string | number;
    onEnd: () => void;
}

/**
 * Countdown against a deadline (it does not drift like a chain of timeouts).
 * Returns the whole seconds left.
 */
export function useCountdown({
    active,
    seconds,
    resetKey,
    onEnd,
}: CountdownOptions): number {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const remainingMs = useRef(seconds * 1000);
    const onEndRef = useRef(onEnd);
    onEndRef.current = onEnd;

    useEffect(() => {
        remainingMs.current = seconds * 1000;
        setTimeLeft(seconds);
    }, [resetKey, seconds]);

    useEffect(() => {
        if (!active || seconds === 0) return;
        const end = Date.now() + remainingMs.current;
        const id = window.setInterval(() => {
            const left = Math.max(0, end - Date.now());
            remainingMs.current = left;
            setTimeLeft(Math.ceil(left / 1000));
            if (left <= 0) {
                window.clearInterval(id);
                onEndRef.current();
            }
        }, 200);
        return () => window.clearInterval(id);
    }, [active, seconds, resetKey]);

    return timeLeft;
}
