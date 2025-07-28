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
  textColor: string,
  bgColor: string,
  targetRatio: number = 4.5
): ColorSuggestion[] {
  const suggestions: ColorSuggestion[] = [];
  const [h, s, l] = rgbToHsl(...hexToRgb(textColor));

  // Create a sophisticated color variation system
  // Focus on AA (4.5:1) to AAA (7.0:1) range with original color as base

  // Quad-based approach: 4 main directions from original color
  const variations = [
    // Darker variations (better contrast)
    { h: 0, s: 1.0, l: 0.6 }, // 20% darker
    { h: 0, s: 1.0, l: 0.4 }, // 40% darker
    { h: 0, s: 1.0, l: 0.2 }, // 60% darker

    // Saturation variations
    { h: 0, s: 1.3, l: 1.0 }, // 30% more saturated
    { h: 0, s: 0.7, l: 1.0 }, // 30% less saturated

    // Hue variations (complementary and analogous)
    { h: 30, s: 1.0, l: 1.0 }, // 30° hue shift
    { h: -30, s: 1.0, l: 1.0 }, // -30° hue shift
    { h: 180, s: 1.0, l: 1.0 }, // Complementary (180°)
  ];

  // Generate variations from original color
  for (const variation of variations) {
    if (suggestions.length >= 6) break;

    const newH = (h + variation.h + 360) % 360;
    const newS = Math.min(100, Math.max(0, s * variation.s));
    const newL = Math.min(100, Math.max(0, l * variation.l));

    const [r, g, b] = hslToRgb(newH, newS, newL);
    const hex = rgbToHex(r, g, b);
    const ratio = contrastRatio(hex, bgColor);

    // Only include AA and AAA level suggestions
    if (ratio >= 4.5) {
      const level = ratio >= 7.0 ? "AAA" : "AA";
      const label = `${level} (${ratio.toFixed(1)}:1)`;

      suggestions.push({
        hex,
        contrastRatio: ratio,
        level,
        label,
      });
    }
  }

  // If we don't have enough AA+ suggestions, add some strategic variations
  if (suggestions.length < 6) {
    const additionalVariations = [
      // Very dark variations for high contrast
      { h: 0, s: 1.0, l: 0.15 }, // 85% darker
      { h: 0, s: 1.0, l: 0.1 }, // 90% darker

      // High saturation variations
      { h: 0, s: 1.5, l: 0.8 }, // 50% more saturated, 20% darker
      { h: 0, s: 1.5, l: 0.6 }, // 50% more saturated, 40% darker
    ];

    for (const variation of additionalVariations) {
      if (suggestions.length >= 6) break;

      const newH = (h + variation.h + 360) % 360;
      const newS = Math.min(100, Math.max(0, s * variation.s));
      const newL = Math.min(100, Math.max(0, l * variation.l));

      const [r, g, b] = hslToRgb(newH, newS, newL);
      const hex = rgbToHex(r, g, b);
      const ratio = contrastRatio(hex, bgColor);

      if (ratio >= 4.5) {
        const level = ratio >= 7.0 ? "AAA" : "AA";
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

  // Sort by contrast ratio (highest first)
  suggestions.sort((a, b) => b.contrastRatio - a.contrastRatio);

  // Return top 6 suggestions
  return suggestions.slice(0, 6);
}

// Generate fallback suggestions if we don't have enough accessible colors
export function generateFallbackSuggestions(
  bgColor: string
): ColorSuggestion[] {
  // Get the background color's HSL to create intelligent fallbacks
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
      "#1f1f1f"  // Very dark charcoal
    );
  } else {
    // If background is dark, suggest light colors
    fallbacks.push(
      "#FFFFFF", // Pure white
      "#f8f8f8", // Off white
      "#e8e8e8", // Light gray
      "#d8d8d8", // Medium light gray
      "#f0f0f0", // Very light gray
      "#fafafa"  // Almost white
    );
  }

  // Add some color-aware suggestions based on background hue
  const complementaryHue = (bgH + 180) % 360;
  const [compR, compG, compB] = hslToRgb(complementaryHue, 70, bgL > 50 ? 20 : 80);
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
    .filter(suggestion => suggestion.level !== "Fail") // Only include AA and AAA
    .sort((a, b) => b.contrastRatio - a.contrastRatio)
    .slice(0, 6); // Return top 6
}
