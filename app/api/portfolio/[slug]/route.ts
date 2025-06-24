import { NextRequest, NextResponse } from "next/server";
import { deletePortfolio, updatePortfolio } from "@/lib/db";

// DELETE portfolio
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json({ error: "PIN required" }, { status: 400 });
    }

    const success = await deletePortfolio(params.slug, pin);

    if (!success) {
      return NextResponse.json(
        { error: "Invalid PIN or portfolio not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE portfolio (for future use)
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { pin, data, generatedCode } = await request.json();

    if (!pin || !data) {
      return NextResponse.json(
        { error: "PIN and data required" },
        { status: 400 }
      );
    }

    const success = await updatePortfolio(params.slug, pin, data, generatedCode);

    if (!success) {
      return NextResponse.json(
        { error: "Invalid PIN or portfolio not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}