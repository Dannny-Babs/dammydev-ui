import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { hex } = await request.json();

    if (!hex || typeof hex !== "string") {
      return NextResponse.json(
        { error: "Hex color is required" },
        { status: 400 }
      );
    }

    // Remove # if present
    const cleanHex = hex.replace("#", "");

    // Validate hex format
    if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      return NextResponse.json(
        { error: "Invalid hex color format" },
        { status: 400 }
      );
    }

    // Convert to RGB
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    return NextResponse.json({ r, g, b });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
