import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { verifyPin } from "@/lib/db";

// GET edit information for a portfolio
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json({ error: "PIN required" }, { status: 400 });
    }

    // Get portfolio edit info
    const { rows } = await sql`
      SELECT pin_hash, edit_count, name, email FROM portfolios WHERE slug = ${params.slug}
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    const portfolio = rows[0];

    // Verify PIN
    if (!verifyPin(pin, portfolio.pin_hash)) {
      return NextResponse.json(
        { error: "Invalid PIN" },
        { status: 401 }
      );
    }

    const editCount = portfolio.edit_count || 0;
    const remainingEdits = Math.max(0, 5 - editCount);

    return NextResponse.json({
      name: portfolio.name,
      email: portfolio.email,
      editCount,
      remainingEdits,
      maxEdits: 5
    });
  } catch (error) {
    console.error("Error fetching edit info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}