// Client-side color utilities

export function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace("#", "");

  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? "text-black" : "text-white";
}

export async function hexToRgb(hex: string) {
  const response = await fetch("/api/color/hex-to-rgb", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ hex }),
  });

  if (!response.ok) {
    throw new Error("Failed to convert hex to RGB");
  }

  return response.json();
}

export async function getContrastRatio(color1: string, color2: string) {
  const response = await fetch("/api/color/contrast-ratio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ color1, color2 }),
  });

  if (!response.ok) {
    throw new Error("Failed to calculate contrast ratio");
  }

  return response.json();
}

export function rgbToHex(r: number, g: number, b: number): string {
  const hex =
    `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
  return hex;
}

export function hexToRgbValues(hex: string): {
  r: number;
  g: number;
  b: number;
} {
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);
    return { r, g, b };
  }
  return { r: 0, g: 0, b: 0 };
}

export async function getColorSuggestions(
  textColor: string,
  bgColor: string,
  targetRatio: number = 4.5
) {
  const response = await fetch("/api/color/suggestions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ textColor, bgColor, targetRatio }),
  });

  if (!response.ok) {
    throw new Error("Failed to get color suggestions");
  }

  return response.json();
}
