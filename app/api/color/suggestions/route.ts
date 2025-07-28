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

    // Generate accessible color suggestions
    let suggestions = generateAccessibleColors(textColor, bgColor, targetRatio);

    // If we don't have enough suggestions, add fallbacks
    if (suggestions.length < 6) {
      const fallbacks = generateFallbackSuggestions(bgColor);
      suggestions = [...suggestions, ...fallbacks].slice(0, 6);
    }

    return NextResponse.json({
      suggestions,
      count: suggestions.length,
      targetRatio,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
