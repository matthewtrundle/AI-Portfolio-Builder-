import { NextRequest, NextResponse } from "next/server";
import { deletePortfolio, updatePortfolio } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";

// Helper function to check if user owns the portfolio
async function checkPortfolioOwnership(slug: string, userEmail: string): Promise<boolean> {
  try {
    const { rows } = await sql`
      SELECT email FROM portfolios WHERE slug = ${slug}
    `;
    
    if (rows.length === 0) return false;
    return rows[0].email === userEmail;
  } catch (error) {
    console.error("Error checking portfolio ownership:", error);
    return false;
  }
}

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

    // Optional: Check if user is authenticated and owns the portfolio
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const isOwner = await checkPortfolioOwnership(params.slug, session.user.email);
      if (!isOwner) {
        return NextResponse.json(
          { error: "You don't have permission to delete this portfolio" },
          { status: 403 }
        );
      }
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

// UPDATE portfolio
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

    // Optional: Check if user is authenticated and owns the portfolio
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const isOwner = await checkPortfolioOwnership(params.slug, session.user.email);
      if (!isOwner) {
        return NextResponse.json(
          { error: "You don't have permission to edit this portfolio" },
          { status: 403 }
        );
      }
    }

    const result = await updatePortfolio(params.slug, pin, data, generatedCode);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to update portfolio", remainingEdits: result.remainingEdits },
        { status: result.error === "Invalid PIN" ? 401 : 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      remainingEdits: result.remainingEdits 
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}