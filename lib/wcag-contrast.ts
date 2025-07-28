// WCAG 2.1 Color Contrast Engine
// Based on WCAG 2.1 guidelines using relative luminance

export interface ContrastResult {
  ratio: number;
  passes: {
    AA: {
      normal: boolean;
      large: boolean;
    };
    AAA: {
      normal: boolean;
      large: boolean;
    };
  };
  level: "AA Normal" | "AA Large" | "AAA Normal" | "AAA Large" | "Fail";
}

export function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

export function luminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };

  const [R, G, B] = [r, g, b].map(toLinear);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(hex1: string, hex2: string): number {
  const lum1 = luminance(hexToRgb(hex1));
  const lum2 = luminance(hexToRgb(hex2));
  const L1 = Math.max(lum1, lum2);
  const L2 = Math.min(lum1, lum2);
  return +((L1 + 0.05) / (L2 + 0.05)).toFixed(2);
}

export function checkContrast(
  textColor: string,
  bgColor: string
): ContrastResult {
  const ratio = contrastRatio(textColor, bgColor);

  const passes = {
    AA: {
      normal: ratio >= 4.5,
      large: ratio >= 3.0,
    },
    AAA: {
      normal: ratio >= 7.0,
      large: ratio >= 4.5,
    },
  };

  let level: ContrastResult["level"] = "Fail";
  if (ratio >= 7.0) level = "AAA Normal";
  else if (ratio >= 4.5) level = "AA Normal";
  else if (ratio >= 3.0) level = "AA Large";
  else if (ratio >= 4.5) level = "AAA Large";

  return {
    ratio,
    passes,
    level,
  };
}
