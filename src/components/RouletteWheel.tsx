import { useEffect, useRef, useState } from "react";

interface RouletteWheelProps {
    presets: Array<{ id: string; name: string; options: string[] }>;
    freeModePlaceholder: string;
    freeModeMaxOptions: number;
}

const SLICE_COLORS_HUE = [280, 240, 200, 160, 120, 80, 40, 0];
const SPIN_DURATION_MS = 3000;
const MIN_SPIN_TURNS = 6;

function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
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

        const size = canvas.width;
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - 4;

        ctx.clearRect(0, 0, size, size);

        if (options.length < 2) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = "#e5e5e5";
            ctx.fill();
            ctx.strokeStyle = "#111111";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "#666666";
            ctx.font = "bold 12px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Agrega al menos", centerX, centerY - 8);
            ctx.fillText("2 opciones", centerX, centerY + 8);
            return;
        }

        const sliceAngle = (Math.PI * 2) / options.length;
        const rotationRad = (rotationDeg * Math.PI) / 180;

        options.forEach((_, i) => {
            const angle = i * sliceAngle + rotationRad;
            const nextAngle = angle + sliceAngle;

            ctx.fillStyle =
                i === selectedIndex
                    ? "rgba(79, 70, 229, 0.9)"
                    : `hsl(${SLICE_COLORS_HUE[i % SLICE_COLORS_HUE.length]}, 70%, 55%)`;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, nextAngle);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = "#111111";
            ctx.lineWidth = 2;
            ctx.stroke();

            const textAngle = angle + sliceAngle / 2;
            const textX = centerX + Math.cos(textAngle) * (radius * 0.65);
            const textY = centerY + Math.sin(textAngle) * (radius * 0.65);

            ctx.save();
            ctx.translate(textX, textY);
            ctx.rotate(textAngle + Math.PI / 2);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(i + 1), 0, 0);
            ctx.restore();
        });
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
        // Land the pointer (fixed at the top, 12 o'clock) on the middle of
        // the winning slice after `MIN_SPIN_TURNS` full turns.
        const targetSliceCenter = newIndex * sliceDeg + sliceDeg / 2;
        const finalRotation = MIN_SPIN_TURNS * 360 + (360 - targetSliceCenter);

        const startRotation = rotationRef.current % 360;
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
            <div className="flex flex-wrap gap-3 border-b-[3px] border-border pb-4">
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
                        width={320}
                        height={320}
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
