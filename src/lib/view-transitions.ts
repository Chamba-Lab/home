/**
 * Durante el fundido entre páginas (View Transitions entre documentos) la
 * página no recibe clics: todos caen en <html>. Si se pulsa en ese momento,
 * se termina el fundido y el clic se reenvía al elemento que hay debajo, así
 * se puede navegar de nuevo sin esperar a que acabe.
 */
type DocumentWithTransition = Document & {
    activeViewTransition?: ViewTransition | null;
};

export function forwardClicksDuringTransition(
    root: DocumentWithTransition = document,
) {
    root.addEventListener(
        "click",
        (event) => {
            const transition = root.activeViewTransition;
            if (!transition || event.target !== root.documentElement) return;
            transition.skipTransition();
            transition.finished.finally(() => {
                const target = root.elementFromPoint(
                    event.clientX,
                    event.clientY,
                );
                if (!target || target === root.documentElement) return;
                // Conserva las teclas (Ctrl/Cmd + clic abre en otra pestaña).
                target.dispatchEvent(
                    new MouseEvent("click", {
                        bubbles: true,
                        cancelable: true,
                        clientX: event.clientX,
                        clientY: event.clientY,
                        button: event.button,
                        ctrlKey: event.ctrlKey,
                        metaKey: event.metaKey,
                        shiftKey: event.shiftKey,
                        altKey: event.altKey,
                    }),
                );
            });
        },
        true,
    );
}
