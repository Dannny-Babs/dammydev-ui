/* eslint-disable prefer-const */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

type ClassValue =
    | ClassArray
    | ClassDictionary
    | string
    | number
    | bigint
    | null
    | boolean
    | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];
function clsx(...inputs: ClassValue[]): string {
    return inputs.filter(Boolean).join(" ");
}

type hsl = {
    h: number;
    s: number;
    l: number;
};

type hex = {
    hex: string;
};
type Color = hsl & hex;



function hslToHex({ h, s, l }: hsl) {
    s /= 100;
    l /= 100;

    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
    let r = Math.round(255 * f(0));
    let g = Math.round(255 * f(8));
    let b = Math.round(255 * f(4));

    const toHex = (x: number) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return `${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hexToHsl({ hex }: hex): hsl {
    // Ensure the hex string is formatted properly
    hex = hex.replace(/^#/, "");

    // Handle 3-digit hex
    if (hex.length === 3) {
        hex = hex
            .split("")
            .map((char) => char + char)
            .join("");
    }

    // Pad with zeros if incomplete
    while (hex.length < 6) {
        hex += "0";
    }

    // Convert hex to RGB
    let r = parseInt(hex.slice(0, 2), 16) || 0;
    let g = parseInt(hex.slice(2, 4), 16) || 0;
    let b = parseInt(hex.slice(4, 6), 16) || 0;

    // Then convert RGB to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s: number;
    let l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
        h *= 360;
    }

    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Threshold calculation function
function thresholdY(x: number, size: number, h: number, bgRgb: [number, number, number], threshold = 4.5): number {
    // x is pixel index [0…size), map to s%
    const s = (x / (size - 1)) * 100;
    // binary-search on y to find where contrast hits threshold
    let lo = 0, hi = size - 1;
    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        // mid maps to lightness: l% = 100 - (mid/(size-1))*100
        const lPerc = 100 - (mid / (size - 1)) * 100;
        const fgRgb: [number, number, number] = hslToRgb(h, s, lPerc);
        const ratio = contrastRatio(fgRgb, bgRgb);
        if (ratio >= threshold) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    return lo;
}

// SVG-based contrast curve overlay
const ContrastCurveOverlay = ({
    h,
    backgroundHex = "#ffffff"
}: {
    h: number;
    backgroundHex?: string;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 500, height: 192 });

    // Get container dimensions
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDimensions({ width: rect.width, height: rect.height });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const points = React.useMemo(() => {
        const bgRgb: [number, number, number] = [
            parseInt(backgroundHex.slice(1, 3), 16),
            parseInt(backgroundHex.slice(3, 5), 16),
            parseInt(backgroundHex.slice(5, 7), 16),
        ];

        const arr: { x: number; y: number }[] = [];
        for (let x = 0; x < dimensions.width; x += 4) {   // step every 4px for performance
            const y = thresholdY(x, dimensions.height, h, bgRgb, 4.5); // for AA threshold
            arr.push({ x, y });
        }
        return arr;
    }, [h, backgroundHex, dimensions.width, dimensions.height]);

    // Build the SVG path string: M x0,y0 L x1,y1 … L xN,yN
    const curvePath = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
        .join(" ");

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none z-10">
            <svg
                width={dimensions.width}
                height={dimensions.height}
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
            >
                <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow
                            dx="0"
                            dy="1"
                            stdDeviation="3"
                            floodColor="rgba(0,0,0,0.15)"
                        />
                        <feDropShadow
                            dx="0"
                            dy="0"
                            stdDeviation="0.5"
                            floodColor="rgba(0,0,0,0.30)"
                        />
                        <feDropShadow
                            dx="0"
                            dy="0.5"
                            stdDeviation="0"
                            floodColor="rgba(0,0,0,0.10)"
                        />
                    </filter>

                    <pattern
                        id="dotGrid"
                        patternUnits="userSpaceOnUse"
                        width="6"
                        height="6"
                        patternTransform="translate(2,2)"
                    >
                        <circle cx="3" cy="3" r="1" fill="white" />
                    </pattern>

                    {/* 
                    Mask out the non-compliant region: 
                    - Start with full rect
                    - Subtract the area under the curve 
                */}
                                    <mask id="safeAreasMask">
                    <rect x="0" y="0" width={dimensions.width} height={dimensions.height} fill="white" />
                    <path
                        d={`${curvePath} L ${dimensions.width} ${dimensions.height} L 0 ${dimensions.height} Z`}
                        fill="black"
                    />
                </mask>
                </defs>

                {/* 1) Draw the white shadowed curve */}
                <path
                    d={curvePath}
                    stroke="white"
                    strokeOpacity={0.8}
                    strokeWidth={2}
                    fill="none"
                    filter="url(#shadow)"
                    strokeLinejoin="round"
                />

                            {/* 2) Dot grid in the compliant (masked) area */}
            <rect
                x={0}
                y={0}
                width={dimensions.width}
                height={dimensions.height}
                fill="url(#dotGrid)"
                opacity={0.25}
                mask="url(#safeAreasMask)"
            />
        </svg>
        </div>
    );
};

            // Helper functions for compliance overlay
            function contrastRatio(fgRgb: [number, number, number], bgRgb: [number, number, number]): number {
                function luminance([r, g, b]: [number, number, number]): number {
                    const toLinear = (c: number) => {
                        c /= 255;
                        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                    };
                    const R = toLinear(r);
                    const G = toLinear(g);
                    const B = toLinear(b);
                    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
                }
    const L1 = luminance(fgRgb);
            const L2 = luminance(bgRgb);
            return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

            function hslToRgb(h: number, s: number, l: number): [number, number, number] {
                s /= 100;
            l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
            const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
            return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
}

            const DraggableColorCanvas = ({
                h,
                s,
                l,
                handleChange,
                backgroundHex = "#ffffff",
}: hsl & {
                handleChange: (e: Partial<Color>) => void;
                    backgroundHex?: string;
}) => {
    const [dragging, setDragging] = useState(false);
                const colorAreaRef = useRef<HTMLDivElement>(null);

                    const calculateSaturationAndLightness = useCallback(
        (clientX: number, clientY: number) => {
            if (!colorAreaRef.current) return;
                    const rect = colorAreaRef.current.getBoundingClientRect();
                    const x = clientX - rect.left;
                    const y = clientY - rect.top;
                    const xClamped = Math.max(0, Math.min(x, rect.width));
                    const yClamped = Math.max(0, Math.min(y, rect.height));
                    const newSaturation = Math.round((xClamped / rect.width) * 100);
                    const newLightness = 100 - Math.round((yClamped / rect.height) * 100);
                    handleChange({s: newSaturation, l: newLightness });
        },
                    [handleChange],
                    );

                    // Mouse event handlers
                    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
                        e.preventDefault();
                    calculateSaturationAndLightness(e.clientX, e.clientY);
        },
                    [calculateSaturationAndLightness],
                    );

    const handleMouseUp = useCallback(() => {
                        setDragging(false);
    }, []);

                    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        setDragging(true);
                        calculateSaturationAndLightness(e.clientX, e.clientY);
    };

                        // Touch event handlers
                        const handleTouchMove = useCallback(
        (e: TouchEvent) => {
                            e.preventDefault();
                        const touch = e.touches[0];
                        if (touch) {
                            calculateSaturationAndLightness(touch.clientX, touch.clientY);
            }
        },
                        [calculateSaturationAndLightness],
                        );

    const handleTouchEnd = useCallback(() => {
                            setDragging(false);
    }, []);

                        const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
                            e.preventDefault();
                            const touch = e.touches[0];
                            if (touch) {
                                setDragging(true);
                            calculateSaturationAndLightness(touch.clientX, touch.clientY);
        }
    };

    useEffect(() => {
        if (dragging) {
                                window.addEventListener("mousemove", handleMouseMove);
                            window.addEventListener("mouseup", handleMouseUp);
                            window.addEventListener("touchmove", handleTouchMove, {passive: false });
                            window.addEventListener("touchend", handleTouchEnd);
        } else {
                                window.removeEventListener("mousemove", handleMouseMove);
                            window.removeEventListener("mouseup", handleMouseUp);
                            window.removeEventListener("touchmove", handleTouchMove);
                            window.removeEventListener("touchend", handleTouchEnd);
        }

        return () => {
                                window.removeEventListener("mousemove", handleMouseMove);
                            window.removeEventListener("mouseup", handleMouseUp);
                            window.removeEventListener("touchmove", handleTouchMove);
                            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [
                            dragging,
                            handleMouseMove,
                            handleMouseUp,
                            handleTouchMove,
                            handleTouchEnd,
                            ]);

                            return (
                            <div
                                ref={colorAreaRef}
                                className="h-48 w-full touch-auto overscroll-none rounded-xl border border-zinc-200 dark:touch-auto relative"
                                style={{
                                    background: `linear-gradient(to top, #000, transparent, #fff), linear-gradient(to left, hsl(${h}, 100%, 50%), #bbb)`,
                                    position: "relative",
                                    cursor: "crosshair",
                                }}
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleTouchStart}
                            >
                                <ContrastCurveOverlay h={h} backgroundHex={backgroundHex} />
                                <div
                                    className="color-selector border-4 border-white ring-1 ring-zinc-200 z-20"
                                    style={{
                                        position: "absolute",
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        background: `hsl(${h}, ${s}%, ${l}%)`,
                                        transform: "translate(-50%, -50%)",
                                        left: `${s}%`,
                                        top: `${100 - l}%`,
                                        cursor: dragging ? "grabbing" : "grab",
                                    }}
                                ></div>
                            </div>
                            );
};

                            function sanitizeHex(val: string) {
    const sanitized = val.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                            return sanitized;
}
                            const ColorPicker = ({
                                default_value = "#1C9488",
                                onChange,
                                backgroundHex = "#ffffff"
                            }: {
                                default_value ?: string;
    onChange?: (color: string) => void;
                            backgroundHex?: string;
}) => {
    // Initialize from controlled prop or a default
    const [color, setColor] = useState<Color>(() => {
        const hex = sanitizeHex(default_value);
                                const hsl = hexToHsl({hex: hex });
                                return {...hsl, hex: sanitizeHex(hex) };
    });

    // Update when default_value prop changes
    useEffect(() => {
        const hex = sanitizeHex(default_value);
                                const hsl = hexToHsl({hex: hex });
                                setColor({...hsl, hex: sanitizeHex(hex) });
    }, [default_value]);
    // Update from hex input
    const handleHexInputChange = (newVal: string) => {
        const hex = sanitizeHex(newVal);
                                if (hex.length === 6) {
            const hsl = hexToHsl({hex});
                                const newColor = {...hsl, hex: hex };
                                setColor(newColor);
                                onChange?.(`#${hex}`);
        } else if (hex.length < 6) {
                                    setColor((prev) => ({ ...prev, hex: hex }));
        }
    };
                                return (
                                <>
                                    <style
                                        id="slider-thumb-style"
                                        dangerouslySetInnerHTML={{
                                            // For the input range thumb styles. Some things are just easier to add to an external stylesheet.
                                            // don't actually put this in production.
                                            // Just putting this here for the sake of a single file in this example
                                            __html: `
              input[type='range']::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px; 
                height: 18px;
                background: transparent;
                border: 4px solid #FFFFFF;
                box-shadow: 0 0 0 1px #e4e4e7; 
                cursor: pointer;
                border-radius: 50%;
              }

              input[type='range']::-moz-range-thumb {
                width: 18px;
                height: 18px;
                cursor: pointer;
                border-radius: 50%;
                background: transparent;
                border: 4px solid #FFFFFF;
                box-shadow: 0 0 0 1px #e4e4e7;
              }
                
              input[type='range']::-ms-thumb {
                width: 18px;
                height: 18px;
                background: transparent;
                cursor: pointer;
                border-radius: 50%;
                border: 4px solid #FFFFFF;
                box-shadow: 0 0 0 1px #e4e4e7;
              }
    
              .dark input[type='range']::-webkit-slider-thumb {
                border: 4px solid rgb(24 24 27);
                box-shadow: 0 0 0 1px #3f3f46; 
              }
              .dark input[type='range']::-moz-range-thumb {
                border: 4px solid rgb(24 24 27);
                box-shadow: 0 0 0 1px #3f3f46; 
              }
              .dark input[type='range']::-ms-thumb {
                border: 4px solid rgb(24 24 27);
                box-shadow: 0 0 0 1px #3f3f46; 
              }
              `,
                                        }}
                                    />
                                    <div
                                        style={
                                            {
                                                "--thumb-border-color": "#000000",
                                                "--thumb-ring-color": "#666666",
                                            } as React.CSSProperties
                                        }
                                        className="z-30 flex w-full max-w-[500px] select-none flex-col items-center gap-3 overscroll-none  "
                                    >
                                        <DraggableColorCanvas
                                            {...color}
                                            backgroundHex={backgroundHex}
                                            handleChange={(parital) => {
                                                setColor((prev) => {
                                                    const value = { ...prev, ...parital };
                                                    const hex_formatted = hslToHex({
                                                        h: value.h,
                                                        s: value.s,
                                                        l: value.l,
                                                    });
                                                    const newColor = { ...value, hex: hex_formatted };
                                                    onChange?.(`#${hex_formatted}`);
                                                    return newColor;
                                                });
                                            }}
                                        />


                                        <input
                                            type="range"
                                            min="0"
                                            max="360"
                                            value={color.h}
                                            className={`h-3 w-full cursor-pointer appearance-none rounded-full border border-zinc-200 bg-white mt-2`}
                                            style={{
                                                background: `linear-gradient(to right, 
                    hsl(0, 100%, 50%), 
                    hsl(60, 100%, 50%), 
                    hsl(120, 100%, 50%), 
                    hsl(180, 100%, 50%), 
                    hsl(240, 100%, 50%), 
                    hsl(300, 100%, 50%), 
                    hsl(360, 100%, 50%))`,
                                            }}
                                            onChange={(e) => {
                                                const hue = e.target.valueAsNumber;
                                                setColor((prev) => {
                                                    const { hex, ...rest } = { ...prev, h: hue };
                                                    const hex_formatted = hslToHex({ ...rest });
                                                    const newColor = { ...rest, hex: hex_formatted };
                                                    onChange?.(`#${hex_formatted}`);
                                                    return newColor;
                                                });
                                            }}
                                        />

                                    </div>
                                </>
                                );
};

                                export default ColorPicker;
