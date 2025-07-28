import { NextRequest, NextResponse } from "next/server";
import { checkContrast } from "@/lib/wcag-contrast";

export async function POST(request: NextRequest) {
  try {
    const { color1, color2 } = await request.json();

    if (
      !color1 ||
      !color2 ||
      typeof color1 !== "string" ||
      typeof color2 !== "string"
    ) {
      return NextResponse.json(
        { error: "Two hex colors are required" },
        { status: 400 }
      );
    }

    // Validate hex formats
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexRegex.test(color1) || !hexRegex.test(color2)) {
      return NextResponse.json(
        { error: "Invalid hex color format" },
        { status: 400 }
      );
    }

    const result = checkContrast(color1, color2);

    return NextResponse.json({
      contrastRatio: result.ratio,
      isAccessible: result.passes.AA.normal,
      passes: result.passes,
      level: result.level,
      color1,
      color2,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
