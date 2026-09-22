import { useEffect, useRef, useState } from "react";

interface RouletteWheelProps {
    presets: Array<{ id: string; name: string; options: string[] }>;
    freeModePlaceholder: string;
    freeModeMaxOptions: number;
}

const SPIN_DURATION_MS = 3000;
const MIN_SPIN_TURNS = 6;
const CANVAS_SIZE = 320;

interface WheelPalette {
    border: string;
    muted: string;
    surface: string;
    slices: Array<{ fill: string; text: string }>;
    selectedFill: string;
    selectedText: string;
}

function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

function readPalette(el: HTMLElement): WheelPalette {
    const styles = getComputedStyle(el);
    const read = (name: string) => styles.getPropertyValue(name).trim();

    const border = read("--color-border");
    const muted = read("--color-muted");
    const surface = read("--color-surface");
    const primary = read("--color-primary");
    const primaryStrong = read("--color-primary-strong");
    const accent = read("--color-accent");
    const content = read("--color-content");
    const contentInverse = read("--color-content-inverse");
    const onAccent = read("--color-on-accent");

    return {
        border,
        muted,
        surface,
        slices: [
            { fill: primary, text: contentInverse },
            { fill: accent, text: onAccent },
            { fill: primaryStrong, text: contentInverse },
            { fill: surface, text: content },
        ],
        selectedFill: accent,
        selectedText: onAccent,
    };
}

// Truncates `text` with an ellipsis so it fits within `maxWidth` px at the
// canvas's current font — slice labels are real option text now, which can
// easily overrun a narrow pie slice unlike the single-digit numbers before.
function truncateToFit(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
) {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let truncated = text;
    while (
        truncated.length > 1 &&
        ctx.measureText(`${truncated}…`).width > maxWidth
    ) {
        truncated = truncated.slice(0, -1);
    }
    return `${truncated}…`;
}

export default function RouletteWheel({
    presets,
    freeModePlaceholder,
    freeModeMaxOptions,
}: RouletteWheelProps) {
    // Default to "preset" so the wheel is populated and visible immediately;
    // "free" mode starts with zero options, which renders as an empty circle.
    const [mode, setMode] = useState<"free" | "preset">("preset");
    const [selectedPresetId, setSelectedPresetId] = useState(
        presets[0]?.id ?? "",
    );
    const [customInput, setCustomInput] = useState("");
    const [spinning, setSpinning] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const rotationRef = useRef(0);

    const currentPreset = presets.find((p) => p.id === selectedPresetId);
    const customOptions = customInput
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, freeModeMaxOptions);

    const options =
        mode === "preset" ? (currentPreset?.options ?? []) : customOptions;
    const optionsKey = options.join("|");

    const drawWheel = (options: string[], rotationDeg: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Render at device-pixel resolution so real words stay crisp — the
        // old single-digit labels could get away with a soft canvas, text
        // can't. `size` below stays in logical (CSS) px for all the layout
        // math; only the transform scales up to the backing store.
        const dpr = window.devicePixelRatio || 1;
        const size = CANVAS_SIZE;
        const targetPx = Math.round(size * dpr);
        if (canvas.width !== targetPx || canvas.height !== targetPx) {
            canvas.width = targetPx;
            canvas.height = targetPx;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const palette = readPalette(canvas);
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - 6;

        ctx.clearRect(0, 0, size, size);

        if (options.length < 2) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = palette.surface;
            ctx.fill();
            ctx.strokeStyle = palette.border;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.fillStyle = palette.muted;
            ctx.font = "bold 13px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Agrega al menos", centerX, centerY - 9);
            ctx.fillText("2 opciones", centerX, centerY + 9);
            return;
        }

        const sliceAngle = (Math.PI * 2) / options.length;
        const rotationRad = (rotationDeg * Math.PI) / 180;
        const labelRadius = radius * 0.62;
        const fontSize =
            options.length <= 4 ? 14 : options.length <= 8 ? 12 : 10.5;
        // Text runs tangentially (perpendicular to the radius), so the space
        // it has to work with is the slice's chord width at `labelRadius`,
        // not the slice's radial depth.
        const maxLabelWidth = 2 * labelRadius * Math.sin(sliceAngle / 2) * 0.82;

        options.forEach((option, i) => {
            const angle = i * sliceAngle + rotationRad;
            const nextAngle = angle + sliceAngle;
            const isSelected = i === selectedIndex;
            const swatch = palette.slices[i % palette.slices.length];

            ctx.fillStyle = isSelected ? palette.selectedFill : swatch.fill;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, nextAngle);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = palette.border;
            ctx.lineWidth = isSelected ? 4 : 2.5;
            ctx.stroke();

            const textAngle = angle + sliceAngle / 2;
            const textX = centerX + Math.cos(textAngle) * labelRadius;
            const textY = centerY + Math.sin(textAngle) * labelRadius;

            ctx.save();
            ctx.translate(textX, textY);
            ctx.rotate(textAngle + Math.PI / 2);
            ctx.fillStyle = isSelected ? palette.selectedText : swatch.text;
            ctx.font = `bold ${isSelected ? fontSize + 1 : fontSize}px Inter, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(
                truncateToFit(ctx, option.toUpperCase(), maxLabelWidth),
                0,
                0,
            );
            ctx.restore();
        });

        // Center hub — a flat brutalist button cap over the slice tips.
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.13, 0, Math.PI * 2);
        ctx.fillStyle = palette.surface;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = palette.border;
        ctx.stroke();
    };

    // Redraw whenever the actual set of options changes (mode switch, preset
    // switch, or free-mode text edits) — but only when we're not mid-spin,
    // since the animation loop already owns the canvas in that window.
    useEffect(() => {
        if (spinning) return;
        rotationRef.current = 0;
        setSelectedIndex(null);
        drawWheel(options, 0);
        // Redraw only when the option set itself changes; `options` is
        // recomputed every render so we key off its stable string form.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionsKey]);

    // Keep the wheel's highlighted slice in sync without touching rotation,
    // so the wheel stays exactly where the spin animation left it.
    useEffect(() => {
        if (spinning) return;
        drawWheel(options, rotationRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIndex]);

    useEffect(() => {
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const spinRoulette = () => {
        if (options.length < 2 || spinning) return;
        setSpinning(true);
        setSelectedIndex(null);

        const newIndex = Math.floor(Math.random() * options.length);
        const sliceDeg = 360 / options.length;
        // Slice angles in drawWheel are measured clockwise from the 3
        // o'clock direction (canvas arc convention), but the pointer is
        // drawn fixed at the top of the wheel — 12 o'clock, i.e. 270° in
        // that same convention. Rotate so the winning slice's center lands
        // under the pointer there, not at 0°.
        const POINTER_ANGLE_DEG = 270;
        const targetSliceCenter = newIndex * sliceDeg + sliceDeg / 2;
        const targetAbsoluteRotation =
            (((POINTER_ANGLE_DEG - targetSliceCenter) % 360) + 360) % 360;

        const startRotation = rotationRef.current % 360;
        // `finalRotation` is added on top of `startRotation` (not the wheel's
        // absolute angle), so it must first cancel out whatever rotation is
        // already on the wheel before adding the full spin turns — otherwise
        // rotation carried over from a previous spin throws off where the
        // winning slice actually lands under the pointer.
        const finalRotation =
            MIN_SPIN_TURNS * 360 +
            ((((targetAbsoluteRotation - startRotation) % 360) + 360) % 360);

        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / SPIN_DURATION_MS, 1);
            const eased = easeOutCubic(progress);
            const rotation = startRotation + finalRotation * eased;

            rotationRef.current = rotation;
            drawWheel(options, rotation);

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                animationFrameRef.current = null;
                setSpinning(false);
                setSelectedIndex(newIndex);
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);
    };

    const switchMode = (nextMode: "free" | "preset") => {
        if (spinning || nextMode === mode) return;
        setMode(nextMode);
    };

    const selectPreset = (presetId: string) => {
        if (spinning || presetId === selectedPresetId) return;
        setSelectedPresetId(presetId);
    };

    return (
        <div className="space-y-6">
            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-3 border-b-[3px] border-border pb-4">
                <button
                    type="button"
                    onClick={() => switchMode("free")}
                    disabled={spinning}
                    className={`px-4 py-2 border-[3px] font-bold uppercase text-sm transition-all disabled:opacity-50 disabled:pointer-events-none ${
                        mode === "free"
                            ? "border-primary bg-primary text-content-inverse shadow-brutal-sm"
                            : "border-border bg-surface text-content hover:bg-primary hover:text-content-inverse"
                    }`}
                >
                    Ruleta Libre
                </button>
                <button
                    type="button"
                    onClick={() => switchMode("preset")}
                    disabled={spinning}
                    className={`px-4 py-2 border-[3px] font-bold uppercase text-sm transition-all disabled:opacity-50 disabled:pointer-events-none ${
                        mode === "preset"
                            ? "border-primary bg-primary text-content-inverse shadow-brutal-sm"
                            : "border-border bg-surface text-content hover:bg-primary hover:text-content-inverse"
                    }`}
                >
                    Temas Preestablecidos
                </button>
            </div>

            {/* Mode Content */}
            {mode === "free" ? (
                <div>
                    <label className="block text-sm font-bold uppercase text-content mb-2">
                        Tus opciones
                    </label>
                    <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder={freeModePlaceholder}
                        maxLength={500}
                        disabled={spinning}
                        className="w-full px-4 py-3 border-[3px] border-border bg-surface text-content font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                        rows={5}
                    />
                    <p className="text-xs text-muted mt-2">
                        {customOptions.length} / {freeModeMaxOptions} opciones
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold uppercase text-content mb-3">
                            Elige un tema
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {presets.map((preset) => (
                                <button
                                    type="button"
                                    key={preset.id}
                                    onClick={() => selectPreset(preset.id)}
                                    disabled={spinning}
                                    className={`px-3 py-2.5 border-[3px] text-left font-bold uppercase text-xs sm:text-sm transition-all disabled:opacity-50 disabled:pointer-events-none ${
                                        selectedPresetId === preset.id
                                            ? "border-primary bg-primary text-content-inverse shadow-brutal-sm"
                                            : "border-border bg-surface text-content hover:bg-primary hover:text-content-inverse"
                                    }`}
                                >
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    {currentPreset && (
                        <div className="p-3 border-[3px] border-border bg-surface max-h-40 overflow-y-auto">
                            <p className="text-xs font-bold uppercase text-muted mb-2">
                                Opciones disponibles
                            </p>
                            <ul className="space-y-1">
                                {currentPreset.options.map((opt, i) => (
                                    <li
                                        key={i}
                                        className="text-sm text-content flex gap-2"
                                    >
                                        <span className="text-primary font-bold shrink-0">
                                            {i + 1}.
                                        </span>
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Roulette Wheel */}
            <div className="flex flex-col items-center gap-6 pt-2">
                <div className="relative w-full max-w-[260px]">
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_SIZE}
                        height={CANVAS_SIZE}
                        className="w-full aspect-square border-[3px] border-border shadow-brutal"
                    />
                    <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-accent z-10" />
                </div>

                <button
                    type="button"
                    onClick={spinRoulette}
                    disabled={options.length < 2 || spinning}
                    className="px-8 py-3 border-[3px] border-border bg-primary text-content-inverse font-bold uppercase text-sm shadow-brutal transition-transform hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-40 disabled:pointer-events-none disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutal"
                >
                    {spinning ? "Girando..." : "GIRAR"}
                </button>
            </div>

            {/* Result */}
            {selectedIndex !== null && !spinning && options[selectedIndex] && (
                <div className="p-6 border-[3px] border-accent bg-accent text-on-accent">
                    <p className="text-xs font-bold uppercase mb-2 opacity-90">
                        ✨ Resultado
                    </p>
                    <p className="text-lg font-bold uppercase leading-relaxed">
                        {options[selectedIndex]}
                    </p>
                </div>
            )}
        </div>
    );
}
