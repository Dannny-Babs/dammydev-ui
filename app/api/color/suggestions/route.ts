import { NextRequest, NextResponse } from "next/server";
import {
  generateAccessibleColors,
  generateFallbackSuggestions,
} from "@/lib/color-suggestions";

export async function POST(request: NextRequest) {
  try {
    const { textHex, bgHex, targetRatio = 4.5 } = await request.json();

    if (
      !textHex ||
      !bgHex ||
      typeof textHex !== "string" ||
      typeof bgHex !== "string"
    ) {
      return NextResponse.json(
        { error: "Text color and background color are required" },
        { status: 400 }
      );
    }

    // Validate hex formats
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexRegex.test(textHex) || !hexRegex.test(bgHex)) {
      return NextResponse.json(
        { error: "Invalid hex color format" },
        { status: 400 }
      );
    }

    // Generate accessible color suggestions from original color
    console.log("Generating suggestions for:", textHex, "on", bgHex);
    let suggestions = generateAccessibleColors(textHex, bgHex, targetRatio);
    console.log("Generated suggestions:", suggestions.length);

    // If we don't have enough AA+ suggestions, add intelligent fallbacks
    if (suggestions.length < 6) {
      const fallbacks = generateFallbackSuggestions(bgHex);

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

    console.log(
      "Returning suggestions:",
      finalSuggestions.map((s) => s.hex)
    );

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
