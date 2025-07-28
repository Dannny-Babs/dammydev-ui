// Color Suggestion Engine
// Generates accessible color suggestions based on WCAG guidelines

import { contrastRatio } from "./wcag-contrast";

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
  textColor: string,
  bgColor: string,
  targetRatio: number = 4.5
): ColorSuggestion[] {
  const suggestions: ColorSuggestion[] = [];
  const [h, s, l] = rgbToHsl(...hexToRgb(textColor));

  // Generate a 3x3 grid of color variations
  const lightnessSteps = [0.3, 0.5, 0.7]; // Darker, Original, Lighter
  const saturationSteps = [0.8, 1.0, 1.2]; // Less saturated, Original, More saturated
  const hueSteps = [-30, 0, 30]; // Shifted hue, Original, Shifted hue

  for (const lightness of lightnessSteps) {
    for (const saturation of saturationSteps) {
      for (const hueShift of hueSteps) {
        if (suggestions.length >= 6) break;

        const newH = (h + hueShift + 360) % 360;
        const newS = Math.min(100, Math.max(0, s * saturation));
        const newL = Math.min(100, Math.max(0, l * lightness));

        const [r, g, b] = hslToRgb(newH, newS, newL);
        const hex = rgbToHex(r, g, b);
        const ratio = contrastRatio(hex, bgColor);

        if (ratio >= targetRatio) {
          const level = ratio >= 7.0 ? "AAA" : ratio >= 4.5 ? "AA" : "Fail";
          const label = `${level} (${ratio.toFixed(1)}:1)`;

          suggestions.push({
            hex,
            contrastRatio: ratio,
            level,
            label,
          });
        }
      }
    }
  }

  // Sort by contrast ratio (highest first)
  suggestions.sort((a, b) => b.contrastRatio - a.contrastRatio);

  // Return top 6 suggestions
  return suggestions.slice(0, 6);
}

// Generate fallback suggestions if we don't have enough accessible colors
export function generateFallbackSuggestions(
  bgColor: string
): ColorSuggestion[] {
  const fallbacks = [
    "#000000", // Pure black
    "#FFFFFF", // Pure white
    "#333333", // Dark gray
    "#666666", // Medium gray
    "#999999", // Light gray
    "#CCCCCC", // Very light gray
    "#1a1a1a", // Very dark
    "#4a4a4a", // Dark medium
    "#7a7a7a", // Medium light
  ];

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
    .sort((a, b) => b.contrastRatio - a.contrastRatio);
}
