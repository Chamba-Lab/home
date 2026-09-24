import { useEffect, useRef, useState } from "react";

interface RouletteWheelProps {
    presets: Array<{ id: string; name: string; options: string[] }>;
    freeModePlaceholder: string;
    freeModeMaxOptions: number;
}

const SPIN_DURATION_MS = 4000;
const MIN_SPIN_TURNS = 7;
const CANVAS_SIZE = 380;

// Curated dark glassmorphism palette for wheel slices
const SLICE_PALETTE = [
    { fill: "#0e172a", text: "#e2e8f0" },
    { fill: "#141f38", text: "#f8fafc" },
    { fill: "#1a2a4c", text: "#e2e8f0" },
    { fill: "#101a30", text: "#cbd5e1" },
];

const SELECTED_SLICE = {
    fill: "#FACC15",
    text: "#080D1A",
};

function easeOutQuart(t: number) {
    return 1 - Math.pow(1 - t, 4);
}

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

// Lightweight Web Audio API synthesizer for interactive mechanical clicks and win chime
class SoundFx {
    private ctx: AudioContext | null = null;
    enabled: boolean = true;

    private getContext(): AudioContext | null {
        if (!this.enabled) return null;
        if (!this.ctx && typeof window !== "undefined") {
            const AudioCtx =
                window.AudioContext ||
                (
                    window as unknown as {
                        webkitAudioContext: typeof AudioContext;
                    }
                ).webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
        return this.ctx;
    }

    playTick() {
        if (!this.enabled) return;
        try {
            const ctx = this.getContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(
                180,
                ctx.currentTime + 0.03,
            );
            gain.gain.setValueAtTime(0.045, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(
                0.001,
                ctx.currentTime + 0.03,
            );
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.03);
        } catch {
            // Ignore browser audio policy restrictions
        }
    }

    playWin() {
        if (!this.enabled) return;
        try {
            const ctx = this.getContext();
            if (!ctx) return;
            const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                const startTime = ctx.currentTime + idx * 0.09;
                osc.frequency.setValueAtTime(freq, startTime);
                gain.gain.setValueAtTime(0.09, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(startTime);
                osc.stop(startTime + 0.38);
            });
        } catch {
            // Ignore
        }
    }
}

interface ConfettiParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    vRotation: number;
    opacity: number;
}

export default function RouletteWheel({
    presets,
    freeModePlaceholder,
    freeModeMaxOptions,
}: RouletteWheelProps) {
    const [mode, setMode] = useState<"preset" | "free">("preset");
    const [selectedPresetId, setSelectedPresetId] = useState(
        presets[0]?.id ?? "",
    );
    const [customInput, setCustomInput] = useState("");
    const [spinning, setSpinning] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [needleWobble, setNeedleWobble] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const confettiFrameRef = useRef<number | null>(null);
    const rotationRef = useRef(0);
    const lastPegRef = useRef<number>(-1);
    const soundFxRef = useRef<SoundFx>(new SoundFx());

    // Sync sound setting
    useEffect(() => {
        soundFxRef.current.enabled = soundEnabled;
    }, [soundEnabled]);

    const currentPreset = presets.find((p) => p.id === selectedPresetId);
    const customOptions = customInput
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, freeModeMaxOptions);

    const [presetOptionsOverride, setPresetOptionsOverride] = useState<
        string[] | null
    >(null);

    const options =
        mode === "preset"
            ? (presetOptionsOverride ?? currentPreset?.options ?? [])
            : customOptions;
    const optionsKey = options.join("|");

    // Reset override on preset change
    const selectPreset = (presetId: string) => {
        if (spinning || presetId === selectedPresetId) return;
        setSelectedPresetId(presetId);
        setPresetOptionsOverride(null);
    };

    const shuffleOptions = () => {
        if (spinning || options.length < 2) return;
        const shuffled = [...options].sort(() => Math.random() - 0.5);
        if (mode === "preset") {
            setPresetOptionsOverride(shuffled);
        } else {
            setCustomInput(shuffled.join("\n"));
        }
    };

    // Confetti celebration animation
    const fireConfetti = () => {
        const canvas = confettiCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const colors = [
            "#FACC15",
            "#5865F2",
            "#38BDF8",
            "#34D399",
            "#F43F5E",
            "#FFFFFF",
        ];
        const particles: ConfettiParticle[] = [];
        const count = 65;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            particles.push({
                x: width / 2,
                y: height / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 4 + Math.random() * 5,
                rotation: Math.random() * 360,
                vRotation: (Math.random() - 0.5) * 12,
                opacity: 1,
            });
        }

        const startTime = performance.now();
        const duration = 2400;

        const renderConfetti = (now: number) => {
            const elapsed = now - startTime;
            if (elapsed > duration) {
                ctx.clearRect(0, 0, width, height);
                confettiFrameRef.current = null;
                return;
            }

            ctx.clearRect(0, 0, width, height);
            const fade = 1 - elapsed / duration;

            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.12; // gravity
                p.rotation += p.vRotation;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, fade);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
                ctx.restore();
            });

            confettiFrameRef.current = requestAnimationFrame(renderConfetti);
        };

        if (confettiFrameRef.current !== null) {
            cancelAnimationFrame(confettiFrameRef.current);
        }
        confettiFrameRef.current = requestAnimationFrame(renderConfetti);
    };

    const drawWheel = (optionsList: string[], rotationDeg: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const size = CANVAS_SIZE;
        const targetPx = Math.round(size * dpr);

        if (canvas.width !== targetPx || canvas.height !== targetPx) {
            canvas.width = targetPx;
            canvas.height = targetPx;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - 10;

        ctx.clearRect(0, 0, size, size);

        // Empty state / not enough options
        if (optionsList.length < 2) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = "#0B1120";
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "#94a3b8";
            ctx.font = "600 13px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Agrega al menos", centerX, centerY - 10);
            ctx.fillText("2 opciones para girar", centerX, centerY + 10);
            return;
        }

        const sliceAngle = (Math.PI * 2) / optionsList.length;
        const rotationRad = (rotationDeg * Math.PI) / 180;
        const isRadial = optionsList.length > 10;

        // Draw slices
        optionsList.forEach((option, i) => {
            const angle = i * sliceAngle + rotationRad;
            const nextAngle = angle + sliceAngle;
            const isSelected = i === selectedIndex;
            const isHovered = i === hoveredIndex && !spinning;
            const swatch = SLICE_PALETTE[i % SLICE_PALETTE.length];

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, nextAngle);
            ctx.closePath();

            ctx.fillStyle = isSelected
                ? SELECTED_SLICE.fill
                : isHovered
                  ? "#1e2c4f"
                  : swatch.fill;
            ctx.fill();

            // Slice border
            ctx.strokeStyle = isSelected
                ? "rgba(250, 204, 21, 0.95)"
                : isHovered
                  ? "rgba(250, 204, 21, 0.65)"
                  : "rgba(255, 255, 255, 0.08)";
            ctx.lineWidth = isSelected ? 3.5 : isHovered ? 2.5 : 1.5;
            ctx.stroke();

            // Text Label Layout
            const textAngle = angle + sliceAngle / 2;

            if (isRadial) {
                // RADIAL TEXT (Pointing from center outwards along the ray - fits up to 24-30 options comfortably)
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(textAngle);
                ctx.textAlign = "right";
                ctx.textBaseline = "middle";
                ctx.fillStyle = isSelected ? SELECTED_SLICE.text : swatch.text;

                const radialFontSize =
                    optionsList.length > 20
                        ? 8.5
                        : optionsList.length > 15
                          ? 9.5
                          : 10.5;
                ctx.font = `${isSelected || isHovered ? "700" : "600"} ${radialFontSize}px Inter, sans-serif`;

                const maxRadialWidth = radius * 0.65;
                ctx.fillText(
                    truncateToFit(ctx, option.toUpperCase(), maxRadialWidth),
                    radius - 14,
                    0,
                );
                ctx.restore();
            } else {
                // TANGENTIAL TEXT (Traditional chord orientation for <= 10 options)
                const labelRadius = radius * 0.65;
                const textX = centerX + Math.cos(textAngle) * labelRadius;
                const textY = centerY + Math.sin(textAngle) * labelRadius;
                const fontSize = optionsList.length <= 4 ? 13 : 11;
                const maxLabelWidth =
                    2 * labelRadius * Math.sin(sliceAngle / 2) * 0.85;

                ctx.save();
                ctx.translate(textX, textY);
                ctx.rotate(textAngle + Math.PI / 2);
                ctx.fillStyle = isSelected ? SELECTED_SLICE.text : swatch.text;
                ctx.font = `${isSelected || isHovered ? "700" : "600"} ${
                    isSelected ? fontSize + 1 : fontSize
                }px Inter, sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(
                    truncateToFit(ctx, option.toUpperCase(), maxLabelWidth),
                    0,
                    0,
                );
                ctx.restore();
            }
        });

        // Outer glowing rim
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(250, 204, 21, 0.4)";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Decorative studs/dots along rim
        const dotCount = Math.max(optionsList.length * 2, 24);
        for (let d = 0; d < dotCount; d++) {
            const dotAngle = (d * (Math.PI * 2)) / dotCount + rotationRad;
            const dotX = centerX + Math.cos(dotAngle) * (radius - 5);
            const dotY = centerY + Math.sin(dotAngle) * (radius - 5);
            ctx.beginPath();
            ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
            ctx.fillStyle =
                d % 2 === 0 ? "#FACC15" : "rgba(255, 255, 255, 0.4)";
            ctx.fill();
        }

        // Center hub (outer ring)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.16, 0, Math.PI * 2);
        ctx.fillStyle = "#080D1A";
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#FACC15";
        ctx.stroke();

        // Center hub inner core
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = "#131e36";
        ctx.fill();

        // Center Power Bolt icon (⚡)
        const boltScale = radius * 0.055;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.fillStyle = "#FACC15";
        ctx.beginPath();
        ctx.moveTo(-0.15 * boltScale, -1.0 * boltScale);
        ctx.lineTo(0.55 * boltScale, -1.0 * boltScale);
        ctx.lineTo(0.05 * boltScale, -0.1 * boltScale);
        ctx.lineTo(0.6 * boltScale, -0.1 * boltScale);
        ctx.lineTo(-0.55 * boltScale, 1.0 * boltScale);
        ctx.lineTo(-0.05 * boltScale, 0.1 * boltScale);
        ctx.lineTo(-0.6 * boltScale, 0.1 * boltScale);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    };

    useEffect(() => {
        if (spinning) return;
        rotationRef.current = 0;
        setSelectedIndex(null);
        drawWheel(options, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionsKey]);

    useEffect(() => {
        if (spinning) return;
        drawWheel(options, rotationRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIndex, hoveredIndex]);

    useEffect(() => {
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (confettiFrameRef.current !== null) {
                cancelAnimationFrame(confettiFrameRef.current);
            }
        };
    }, []);

    const spinRoulette = () => {
        if (options.length < 2 || spinning) return;
        setSpinning(true);
        setSelectedIndex(null);
        setHoveredIndex(null);
        setCopied(false);
        lastPegRef.current = -1;

        const newIndex = Math.floor(Math.random() * options.length);
        const sliceDeg = 360 / options.length;
        const POINTER_ANGLE_DEG = 270; // 12 o'clock top pointer
        const targetSliceCenter = newIndex * sliceDeg + sliceDeg / 2;
        const targetAbsoluteRotation =
            (((POINTER_ANGLE_DEG - targetSliceCenter) % 360) + 360) % 360;

        const startRotation = rotationRef.current % 360;
        const finalRotation =
            MIN_SPIN_TURNS * 360 +
            ((((targetAbsoluteRotation - startRotation) % 360) + 360) % 360);

        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / SPIN_DURATION_MS, 1);
            const eased = easeOutQuart(progress);
            const rotation = startRotation + finalRotation * eased;

            rotationRef.current = rotation;
            drawWheel(options, rotation);

            // Calculate which peg/slice crosses the pointer for needle wobble & sound tick
            const currentPeg = Math.floor(
                (rotation + 90) / (360 / options.length),
            );
            if (currentPeg !== lastPegRef.current) {
                lastPegRef.current = currentPeg;
                setNeedleWobble(true);
                soundFxRef.current.playTick();
                setTimeout(() => setNeedleWobble(false), 45);
            }

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                animationFrameRef.current = null;
                setSpinning(false);
                setSelectedIndex(newIndex);
                soundFxRef.current.playWin();
                fireConfetti();
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (spinning || options.length < 2) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const dist = Math.sqrt(x * x + y * y);
        const radius = rect.width / 2;

        if (dist >= radius * 0.16 && dist <= radius) {
            let angle = Math.atan2(y, x);
            if (angle < 0) angle += Math.PI * 2;

            const currentRotRad = ((rotationRef.current % 360) * Math.PI) / 180;
            let relativeAngle = (angle - currentRotRad) % (Math.PI * 2);
            if (relativeAngle < 0) relativeAngle += Math.PI * 2;

            const sliceAngle = (Math.PI * 2) / options.length;
            const sliceIdx =
                Math.floor(relativeAngle / sliceAngle) % options.length;
            setHoveredIndex(sliceIdx);
        } else {
            setHoveredIndex(null);
        }
    };

    const handleCanvasMouseLeave = () => {
        setHoveredIndex(null);
    };

    const copyToClipboard = () => {
        if (selectedIndex === null || !options[selectedIndex]) return;
        const text = `🎡 **Ruleta Chamba Lab**: "${options[selectedIndex]}"`;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const loadExampleCustom = () => {
        setCustomInput(
            "¿Cuál es tu lenguaje de programación favorito?\n¿Qué proyecto te gustaría crear este año?\n¿Cuál fue el bug más difícil que resolviste?\n¿Qué consejo le darías a tu yo junior?\n¿Framework favorito y por qué?\n¿Libro, curso o canal tech que recomiendes?\n¿Prefieres trabajar remoto o presencial?\n¿Cuál ha sido tu peor entrevista técnica?",
        );
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            {/* LEFT COLUMN: Roulette Stage */}
            <div className="w-full lg:w-[440px] flex flex-col items-center shrink-0">
                <div className="w-full card-glass rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center bg-[#0B1120]/90 backdrop-blur-xl">
                    {/* Ambient Stage Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Stage Header Controls: Peg Count & Sound Toggle */}
                    <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-white/[0.08] relative z-10 text-xs">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-white/10 text-slate-300 font-semibold">
                            <span
                                className={`w-2 h-2 rounded-full ${spinning ? "bg-brand-yellow animate-ping" : "bg-emerald-400"}`}
                            />
                            <span>
                                {spinning
                                    ? "Girando..."
                                    : `${options.length} opciones en rueda`}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Standard Shuffle button with clean intersecting arrows icon */}
                            <button
                                type="button"
                                onClick={shuffleOptions}
                                disabled={spinning || options.length < 2}
                                title="Mezclar aleatoriamente el orden de las opciones"
                                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-brand-yellow border border-white/10 transition-all disabled:opacity-40 flex items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"
                                    />
                                </svg>
                            </button>

                            {/* Sound Toggle */}
                            <button
                                type="button"
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                                    soundEnabled
                                        ? "bg-slate-900/90 text-brand-yellow border-brand-yellow/30"
                                        : "bg-slate-950/70 text-slate-500 border-white/10"
                                }`}
                            >
                                <span>{soundEnabled ? "🔊" : "🔇"}</span>
                                <span className="hidden sm:inline">
                                    {soundEnabled ? "Sonido" : "Mute"}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Wheel Canvas Wrapper with Confetti Overlay */}
                    <div className="relative w-full max-w-[340px] sm:max-w-[370px] aspect-square flex items-center justify-center my-2">
                        {/* Confetti Particle Canvas */}
                        <canvas
                            ref={confettiCanvasRef}
                            className="absolute inset-0 w-full h-full pointer-events-none z-30"
                        />

                        {/* Interactive Golden Needle Pointer (12 o'clock) with dynamic physical wobble */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
                            <div
                                className={`w-7 h-10 filter drop-shadow-[0_4px_12px_rgba(250,204,21,0.7)] transition-transform duration-75 origin-top ${
                                    needleWobble
                                        ? "-rotate-12 scale-110"
                                        : "rotate-0 scale-100"
                                }`}
                            >
                                <svg
                                    viewBox="0 0 24 36"
                                    className="w-full h-full fill-brand-yellow"
                                >
                                    <path d="M12 36L2 10C0 5 4 0 9 0H15C20 0 24 5 22 10L12 36Z" />
                                    <circle
                                        cx="12"
                                        cy="10"
                                        r="4.5"
                                        fill="#080D1A"
                                    />
                                    <circle
                                        cx="12"
                                        cy="10"
                                        r="2.5"
                                        fill="#FACC15"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Interactive Canvas */}
                        <canvas
                            ref={canvasRef}
                            width={CANVAS_SIZE}
                            height={CANVAS_SIZE}
                            className="w-full h-full rounded-full cursor-pointer transition-transform hover:scale-[1.01]"
                            onClick={spinRoulette}
                            onMouseMove={handleCanvasMouseMove}
                            onMouseLeave={handleCanvasMouseLeave}
                            title="Haz clic para girar la ruleta"
                        />

                        {/* Floating Tooltip when hovering over a slice on desktop */}
                        {hoveredIndex !== null &&
                            !spinning &&
                            options[hoveredIndex] && (
                                <div className="absolute -bottom-2 left-2 right-2 z-30 pointer-events-none transition-all duration-200 animate-fade-in">
                                    <div className="card-glass rounded-xl p-3 border border-brand-yellow/60 bg-[#080D1A]/95 backdrop-blur-xl shadow-2xl flex items-start gap-2.5">
                                        <span className="w-5 h-5 rounded-md bg-brand-yellow text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                            #{hoveredIndex + 1}
                                        </span>
                                        <p className="text-xs text-white font-medium leading-relaxed">
                                            {options[hoveredIndex]}
                                        </p>
                                    </div>
                                </div>
                            )}
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 mb-2 font-medium">
                        Haz clic en la rueda o en el botón para girar
                    </p>

                    {/* Primary Spin Button */}
                    <button
                        type="button"
                        onClick={spinRoulette}
                        disabled={options.length < 2 || spinning}
                        className="w-full py-3.5 px-6 rounded-xl font-display font-extrabold text-slate-950 text-base bg-gradient-to-r from-brand-yellow via-amber-300 to-brand-yellow hover:from-amber-300 hover:to-brand-yellow shadow-lg shadow-brand-yellow/25 hover:shadow-brand-yellow/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:pointer-events-none disabled:hover:translate-y-0 disabled:shadow-none"
                    >
                        {spinning ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-950"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>GIRANDO RULETA...</span>
                            </>
                        ) : (
                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                <span>¡GIRAR LA RULETA!</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* RIGHT COLUMN: Mode Selector, Presets & Live Result */}
            <div className="flex-1 w-full space-y-6">
                {/* Result Card (Celebratory reveal when wheel finishes) */}
                {selectedIndex !== null &&
                    !spinning &&
                    options[selectedIndex] && (
                        <div className="card-glass rounded-2xl p-6 sm:p-7 border border-brand-yellow/50 bg-gradient-to-br from-brand-yellow/15 via-[#0B1120] to-[#5865F2]/10 shadow-2xl relative overflow-hidden animate-fade-in">
                            <div className="flex items-center justify-between mb-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow text-slate-950 text-xs font-black tracking-wide uppercase shadow-sm">
                                    <span>🎉</span>
                                    <span>Tema Seleccionado</span>
                                </span>
                                <span className="text-xs text-brand-yellow/80 font-mono">
                                    Opción #{selectedIndex + 1} de{" "}
                                    {options.length}
                                </span>
                            </div>

                            <p className="font-display text-xl sm:text-2xl font-extrabold text-white leading-relaxed my-4">
                                “{options[selectedIndex]}”
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={copyToClipboard}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-bold border border-white/15 hover:border-brand-yellow/40 transition-all shadow-md"
                                >
                                    {copied ? (
                                        <>
                                            <span className="text-emerald-400">
                                                ✓
                                            </span>
                                            <span className="text-emerald-300">
                                                ¡Copiado para Discord!
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4 text-brand-yellow"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                                />
                                            </svg>
                                            <span>Copiar pregunta</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={spinRoulette}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-yellow/15 hover:bg-brand-yellow/25 text-brand-yellow text-xs font-bold border border-brand-yellow/30 transition-all"
                                >
                                    <span>Girar de nuevo</span>
                                    <span>↻</span>
                                </button>
                            </div>
                        </div>
                    )}

                {/* Mode Selector Tabs */}
                <div className="card-glass rounded-2xl p-6 sm:p-7 border border-white/10 bg-[#0B1120]/80">
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950/70 border border-white/10 mb-6 max-w-md">
                        <button
                            type="button"
                            onClick={() => !spinning && setMode("preset")}
                            disabled={spinning}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                mode === "preset"
                                    ? "bg-brand-yellow text-slate-950 shadow-md font-extrabold"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <span>🎯</span>
                            <span>Temas de Debate ({presets.length})</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => !spinning && setMode("free")}
                            disabled={spinning}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                mode === "free"
                                    ? "bg-brand-yellow text-slate-950 shadow-md font-extrabold"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <span>✍️</span>
                            <span>Ruleta Libre</span>
                        </button>
                    </div>

                    {/* Mode Content */}
                    {mode === "preset" ? (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Selecciona un paquete temático (
                                    {presets.length} disponibles)
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                    {presets.map((preset) => {
                                        const isSelected =
                                            selectedPresetId === preset.id;
                                        return (
                                            <button
                                                type="button"
                                                key={preset.id}
                                                onClick={() =>
                                                    selectPreset(preset.id)
                                                }
                                                disabled={spinning}
                                                title={preset.name}
                                                className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between gap-1.5 ${
                                                    isSelected
                                                        ? "border-brand-yellow bg-brand-yellow/10 shadow-lg shadow-brand-yellow/10"
                                                        : "border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-slate-900/90"
                                                }`}
                                            >
                                                <span
                                                    className={`font-display text-sm font-bold line-clamp-2 leading-snug ${
                                                        isSelected
                                                            ? "text-brand-yellow"
                                                            : "text-white"
                                                    }`}
                                                >
                                                    {preset.name}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-mono">
                                                    {preset.options.length}{" "}
                                                    preguntas
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Preset Options Preview with Full Text and Tooltips */}
                            {currentPreset && (
                                <div className="pt-4 border-t border-white/[0.08]">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Preguntas en este paquete (
                                            {options.length})
                                        </span>
                                        <button
                                            type="button"
                                            onClick={shuffleOptions}
                                            disabled={spinning}
                                            className="text-xs text-brand-yellow hover:text-amber-300 inline-flex items-center gap-1.5 font-semibold transition-colors"
                                            title="Mezclar aleatoriamente el orden de las preguntas"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"
                                                />
                                            </svg>
                                            <span>Mezclar orden</span>
                                        </button>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                                        {options.map((opt, i) => (
                                            <div
                                                key={i}
                                                onMouseEnter={() =>
                                                    setHoveredIndex(i)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredIndex(null)
                                                }
                                                title={opt}
                                                className={`p-2.5 rounded-xl text-xs flex items-start gap-2.5 transition-all cursor-default group ${
                                                    i === selectedIndex &&
                                                    !spinning
                                                        ? "bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow font-bold"
                                                        : i === hoveredIndex &&
                                                            !spinning
                                                          ? "bg-slate-900/90 border border-brand-yellow/30 text-white"
                                                          : "bg-slate-900/60 border border-white/5 text-slate-300 hover:border-white/15"
                                                }`}
                                            >
                                                <span className="w-5 h-5 rounded-md bg-white/5 text-[10px] font-mono flex items-center justify-center shrink-0 text-slate-400 group-hover:text-brand-yellow mt-0.5">
                                                    {String(i + 1).padStart(
                                                        2,
                                                        "0",
                                                    )}
                                                </span>
                                                <p className="leading-relaxed break-words flex-1 text-xs">
                                                    {opt}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Tus preguntas u opciones (una por línea)
                                </label>
                                <span className="text-xs font-mono text-brand-yellow font-bold">
                                    {customOptions.length} /{" "}
                                    {freeModeMaxOptions} opciones
                                </span>
                            </div>

                            <textarea
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                placeholder={freeModePlaceholder}
                                maxLength={1200}
                                disabled={spinning}
                                rows={7}
                                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-950/80 text-white placeholder-slate-500 font-mono text-xs sm:text-sm resize-none focus:outline-none focus:border-brand-yellow/50 focus:ring-1 focus:ring-brand-yellow/30 disabled:opacity-60 transition-colors"
                            />

                            <div className="flex items-center justify-between text-xs pt-1">
                                <button
                                    type="button"
                                    onClick={loadExampleCustom}
                                    disabled={spinning}
                                    className="text-brand-yellow hover:underline font-semibold inline-flex items-center gap-1"
                                >
                                    <span>✨</span>
                                    <span>Cargar tema de ejemplo</span>
                                </button>
                                {customInput && (
                                    <button
                                        type="button"
                                        onClick={() => setCustomInput("")}
                                        disabled={spinning}
                                        className="text-slate-400 hover:text-rose-400 font-semibold"
                                    >
                                        Limpiar texto
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
