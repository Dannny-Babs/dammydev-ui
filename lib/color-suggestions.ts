// Color Suggestion Engine
// Generates accessible color suggestions based on WCAG guidelines

import { contrastRatio, hexToRgb } from "./wcag-contrast";

export interface ColorSuggestion {
  hex: string;
  contrastRatio: number;
  level: string;
  label: string;
}

// Convert RGB to HSL for easier manipulation
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
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
  }

  return [h * 360, s * 100, l * 100];
}

// Convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
}

export function generateAccessibleColors(
  textHex: string,
  bgHex: string,
  targetRatio: number = 4.5
): ColorSuggestion[] {
  const suggestions: ColorSuggestion[] = [];
  const [baseH, baseS, baseL] = rgbToHsl(...hexToRgb(textHex));

  // 1) Core “quad” around base color, with lighter emphasis
  const quadVariations = [
    { Δh:   0, scaleS: 1.0, addL: +20 }, // lighter
    { Δh:   0, scaleS: 1.0, addL: -20 }, // darker
    { Δh:   0, scaleS: 1.3, addL:  0 },  // more saturated
    { Δh:   0, scaleS: 0.7, addL:  0 },  // less saturated
  ];

  // 2) Vibrant hue shifts including light and dark versions
  const hueShifts = [
    { Δh:  45, scaleS: 1.1, addL: +15 }, // analogous brighter
    { Δh:  45, scaleS: 1.1, addL: -15 }, // analogous darker
    { Δh: -45, scaleS: 1.1, addL: +15 }, // other side brighter
    { Δh: -45, scaleS: 1.1, addL: -15 }, // other side darker
    { Δh: 180, scaleS: 1.2, addL: +10 }, // complementary lighter
    { Δh: 180, scaleS: 1.2, addL: -10 }, // complementary darker
  ];

  const variations = [...quadVariations, ...hueShifts];

  for (const { Δh, scaleS, addL } of variations) {
    if (suggestions.length >= 6) break;

    const h = (baseH + Δh + 360) % 360;
    const s = clamp(baseS * scaleS, 0, 100);
    const l = clamp(baseL + addL, 10, 90);

    const hex = rgbToHex(...hslToRgb(h, s, l));
    const ratio = contrastRatio(hex, bgHex);

    if (ratio >= targetRatio) {
      const level = ratio >= 7   ? "AAA"
                   : ratio >= 4.5 ? "AA"
                   : null;
      if (level) {
        suggestions.push({
          hex,
          contrastRatio: ratio,
          level,
          label: `${level} (${ratio.toFixed(1)}:1)`,
        });
      }
    }
  }

  // 3) If underfilled, sprinkle in some intentionally light variants
  if (suggestions.length < 6) {
    for (const extraL of [baseL + 30, baseL + 40, baseL + 50]) {
      if (suggestions.length >= 6) break;
      const l = clamp(extraL, 10, 95);
      const hex = rgbToHex(...hslToRgb(baseH, baseS, l));
      const ratio = contrastRatio(hex, bgHex);
      if (ratio >= targetRatio) {
        const level = ratio >= 7   ? "AAA"
                     : ratio >= 4.5 ? "AA"
                     : null;
        if (level) {
          suggestions.push({
            hex,
            contrastRatio: ratio,
            level,
            label: `${level} (${ratio.toFixed(1)}:1)`,
          });
        }
      }
    }
  }

  // Sort by contrast descending, then return top 6
  return suggestions
    .sort((a,b) => b.contrastRatio - a.contrastRatio)
    .slice(0,6);
}

// Helper to bound values
function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}
// Generate fallback suggestions if we don't have enough accessible colors
export function generateFallbackSuggestions(
  bgColor: string
): ColorSuggestion[] {
  // Get the background color's HSL to create intelligent fallbacks
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bgH, bgS, bgL] = rgbToHsl(...hexToRgb(bgColor));

  // Create intelligent fallbacks based on background color
  const fallbacks: string[] = [];

  // If background is light, suggest dark colors
  if (bgL > 50) {
    fallbacks.push(
      "#000000", // Pure black
      "#1a1a1a", // Very dark gray
      "#333333", // Dark gray
      "#4a4a4a", // Medium dark gray
      "#2c2c2c", // Dark charcoal
      "#1f1f1f" // Very dark charcoal
    );
  } else {
    // If background is dark, suggest light colors
    fallbacks.push(
      "#FFFFFF", // Pure white
      "#f8f8f8", // Off white
      "#e8e8e8", // Light gray
      "#d8d8d8", // Medium light gray
      "#f0f0f0", // Very light gray
      "#fafafa" // Almost white
    );
  }

  // Add some color-aware suggestions based on background hue
  const complementaryHue = (bgH + 180) % 360;
  const [compR, compG, compB] = hslToRgb(
    complementaryHue,
    70,
    bgL > 50 ? 20 : 80
  );
  fallbacks.push(rgbToHex(compR, compG, compB));

  return fallbacks
    .map((hex) => {
      const ratio = contrastRatio(hex, bgColor);
      const level = ratio >= 7.0 ? "AAA" : ratio >= 4.5 ? "AA" : "Fail";
      const label = `${level} (${ratio.toFixed(1)}:1)`;

      return {
        hex,
        contrastRatio: ratio,
        level,
        label,
      };
    })
    .filter((suggestion) => suggestion.level !== "Fail") // Only include AA and AAA
    .sort((a, b) => b.contrastRatio - a.contrastRatio)
    .slice(0, 6); // Return top 6
}
