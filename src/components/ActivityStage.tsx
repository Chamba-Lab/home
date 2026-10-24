import { useEffect, useRef, type ReactNode } from "react";

interface ActivityStageProps {
    label: string;
    onClose: () => void;
    children: ReactNode;
}

/**
 * Full-viewport stage for dynamics that are screen-shared: a modal dialog
 * that locks the page scroll, makes the rest of the page inert and closes
 * with Esc.
 */
export default function ActivityStage({
    label,
    onClose,
    children,
}: ActivityStageProps) {
    const stageRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef(onClose);
    closeRef.current = onClose;

    // Stop the page behind the stage from scrolling.
    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, []);

    // No Tab into the rest of the page, and hidden from assistive technology.
    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const marked: Element[] = [];
        for (let node: Element = stage; node.parentElement;) {
            const parent: Element = node.parentElement;
            for (const sibling of Array.from(parent.children)) {
                if (sibling !== node && !sibling.hasAttribute("inert")) {
                    sibling.setAttribute("inert", "");
                    marked.push(sibling);
                }
            }
            node = parent;
        }
        return () => marked.forEach((el) => el.removeAttribute("inert"));
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeRef.current();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div
            ref={stageRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="fixed inset-0 z-[60] overflow-y-auto bg-bg"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-96 w-[48rem] max-w-full -translate-x-1/2 rounded-full bg-brand-yellow/5 blur-3xl"
            ></div>
            <div className="relative mx-auto flex min-h-full max-w-6xl flex-col px-5 py-5 sm:px-10 sm:py-8">
                {children}
            </div>
        </div>
    );
}
