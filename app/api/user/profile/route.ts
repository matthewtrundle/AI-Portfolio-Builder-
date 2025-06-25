import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";

// GET user profile and statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user portfolios with statistics
    const { rows: portfolios } = await sql`
      SELECT 
        id,
        slug,
        name,
        view_count,
        edit_count,
        created_at,
        updated_at
      FROM portfolios
      WHERE email = ${session.user.email}
      ORDER BY created_at DESC
    `;

    // Calculate total statistics
    const totalPortfolios = portfolios.length;
    const totalViews = portfolios.reduce((sum, p) => sum + (p.view_count || 0), 0);
    const totalEdits = portfolios.reduce((sum, p) => sum + (p.edit_count || 0), 0);
    const totalRemainingEdits = portfolios.reduce((sum, p) => sum + Math.max(0, 5 - (p.edit_count || 0)), 0);

    return NextResponse.json({
      user: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image
      },
      stats: {
        totalPortfolios,
        totalViews,
        totalEdits,
        totalRemainingEdits,
        maxEditsPerPortfolio: 5
      },
      portfolios: portfolios.map(p => ({
        ...p,
        remainingEdits: Math.max(0, 5 - (p.edit_count || 0))
      }))
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE user account and all portfolios
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Delete all user's portfolios
    await sql`
      DELETE FROM portfolios WHERE email = ${session.user.email}
    `;

    // If using the v2 schema with users table, also delete the user
    if (session.user.id) {
      await sql`
        DELETE FROM users WHERE id = ${session.user.id}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}