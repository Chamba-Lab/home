import React, { useState, useRef } from "react";

interface RouletteWheelProps {
    presets: Array<{ id: string; name: string; options: string[] }>;
    freeModePlaceholder: string;
    freeModeMaxOptions: number;
}

export default function RouletteWheel({
    presets,
    freeModePlaceholder,
    freeModeMaxOptions,
}: RouletteWheelProps) {
    const [mode, setMode] = useState<"free" | "preset">("free");
    const [selectedPresetId, setSelectedPresetId] = useState(
        presets[0]?.id || "",
    );
    const [customInput, setCustomInput] = useState("");
    const [customOptions, setCustomOptions] = useState<string[]>([]);
    const [spinning, setSpinning] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);

    const currentPreset =
        mode === "preset"
            ? presets.find((p) => p.id === selectedPresetId)
            : null;
    const options =
        mode === "preset"
            ? currentPreset?.options || []
            : customOptions.filter((o) => o.trim());

    const handleCustomInput = (value: string) => {
        setCustomInput(value);
        const lines = value
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l)
            .slice(0, freeModeMaxOptions);
        setCustomOptions(lines);
        setSelectedIndex(null);
    };

    const spinRoulette = () => {
        if (options.length < 2 || spinning) return;
        setSpinning(true);

        const newIndex = Math.floor(Math.random() * options.length);
        const spins = 10;
        const rotations = spins + newIndex / options.length;
        const finalAngle =
            ((rotations * 360) % 360) + (360 / options.length) * newIndex;

        let currentRotation = 0;
        const startTime = Date.now();
        const duration = 3000;

        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);

            currentRotation = finalAngle * eased;
            drawWheel(currentRotation);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setSelectedIndex(newIndex);
                setSpinning(false);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    const drawWheel = (rotation: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const size = canvas.width;
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - 4;

        ctx.clearRect(0, 0, size, size);

        const sliceAngle = (360 / options.length) * (Math.PI / 180);

        options.forEach((_, i) => {
            const angle =
                ((i * 360) / options.length + rotation) * (Math.PI / 180);
            const nextAngle = angle + sliceAngle;

            const hues = [280, 240, 200, 160, 120, 80, 40, 0];
            ctx.fillStyle =
                i === selectedIndex
                    ? "rgba(79, 70, 229, 0.9)"
                    : `hsl(${hues[i % hues.length]}, 70%, 55%)`;

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
            ctx.font = "bold 11px Inter";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const label = (i + 1).toString();
            ctx.fillText(label, 0, 0);
            ctx.restore();
        });
    };

    React.useEffect(() => {
        drawWheel(0);
    }, [options, selectedIndex]);

    return (
        <div className="space-y-8">
            {/* Mode Selector */}
            <div className="flex gap-3 border-b-[3px] border-border pb-4">
                <button
                    onClick={() => {
                        setMode("free");
                        setSelectedIndex(null);
                    }}
                    className={`px-4 py-2 border-[3px] font-bold uppercase text-sm transition-all ${
                        mode === "free"
                            ? "border-primary bg-primary text-content-inverse shadow-brutal-sm"
                            : "border-border bg-surface text-content hover:bg-primary hover:text-content-inverse"
                    }`}
                >
                    Ruleta Libre
                </button>
                <button
                    onClick={() => {
                        setMode("preset");
                        setSelectedIndex(null);
                    }}
                    className={`px-4 py-2 border-[3px] font-bold uppercase text-sm transition-all ${
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
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold uppercase text-content mb-2">
                            Tus opciones
                        </label>
                        <textarea
                            value={customInput}
                            onChange={(e) => handleCustomInput(e.target.value)}
                            placeholder={freeModePlaceholder}
                            maxLength={500}
                            className="w-full px-4 py-3 border-[3px] border-border bg-surface text-content font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={6}
                        />
                        <p className="text-xs text-muted mt-2">
                            {customOptions.length} / {freeModeMaxOptions}{" "}
                            opciones
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold uppercase text-content mb-3">
                            Elige un tema
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {presets.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => {
                                        setSelectedPresetId(preset.id);
                                        setSelectedIndex(null);
                                    }}
                                    className={`px-4 py-3 border-[3px] text-left font-bold uppercase text-sm transition-all ${
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
                        <div className="p-3 border-[3px] border-border bg-surface">
                            <p className="text-xs font-bold uppercase text-muted mb-2">
                                Opciones disponibles
                            </p>
                            <ul className="space-y-1">
                                {currentPreset.options.map((opt, i) => (
                                    <li
                                        key={i}
                                        className="text-sm text-content flex gap-2"
                                    >
                                        <span className="text-primary font-bold">
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
            <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                    <canvas
                        ref={canvasRef}
                        width={300}
                        height={300}
                        className="border-[3px] border-border shadow-brutal"
                    />
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-accent z-10" />
                </div>

                <button
                    onClick={spinRoulette}
                    disabled={options.length < 2 || spinning}
                    className="px-8 py-3 border-[3px] border-border bg-primary text-content-inverse font-bold uppercase text-sm shadow-brutal transition-transform hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-40 disabled:cursor-not-allowed"
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
