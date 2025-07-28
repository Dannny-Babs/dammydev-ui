import { NextRequest, NextResponse } from "next/server";
import {
  generateAccessibleColors,
  generateFallbackSuggestions,
} from "@/lib/color-suggestions";

export async function POST(request: NextRequest) {
  try {
    const { textColor, bgColor, targetRatio = 4.5 } = await request.json();

    if (
      !textColor ||
      !bgColor ||
      typeof textColor !== "string" ||
      typeof bgColor !== "string"
    ) {
      return NextResponse.json(
        { error: "Text color and background color are required" },
        { status: 400 }
      );
    }

    // Validate hex formats
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexRegex.test(textColor) || !hexRegex.test(bgColor)) {
      return NextResponse.json(
        { error: "Invalid hex color format" },
        { status: 400 }
      );
    }

    // Generate accessible color suggestions from original color
    let suggestions = generateAccessibleColors(textColor, bgColor, targetRatio);

    // If we don't have enough AA+ suggestions, add intelligent fallbacks
    if (suggestions.length < 6) {
      const fallbacks = generateFallbackSuggestions(bgColor);

      // Combine and deduplicate suggestions
      const allSuggestions = [...suggestions];
      for (const fallback of fallbacks) {
        if (!allSuggestions.some((s) => s.hex === fallback.hex)) {
          allSuggestions.push(fallback);
        }
      }
      suggestions = allSuggestions;
    }

    // Return exactly 6 suggestions, prioritizing AA and AAA levels
    const finalSuggestions = suggestions
      .filter((s) => s.level !== "Fail") // Only AA and AAA
      .sort((a, b) => b.contrastRatio - a.contrastRatio) // Highest contrast first
      .slice(0, 6);

    return NextResponse.json({
      suggestions: finalSuggestions,
      count: finalSuggestions.length,
      targetRatio,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
