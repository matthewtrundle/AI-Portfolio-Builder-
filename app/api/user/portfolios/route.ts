import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try to fetch portfolios - first attempt with user_id (v2 schema)
    let { rows } = await sql`
      SELECT 
        p.id,
        p.slug,
        p.name,
        p.created_at,
        p.updated_at,
        p.view_count,
        p.edit_count,
        p.is_public
      FROM portfolios p
      JOIN users u ON u.id = p.user_id
      WHERE u.email = ${session.user.email}
      ORDER BY p.created_at DESC
    `.catch(() => ({ rows: [] }));

    // Fallback to email-based query (v1 schema)
    if (rows.length === 0) {
      const result = await sql`
        SELECT 
          id,
          slug,
          name,
          created_at,
          updated_at,
          view_count,
          edit_count,
          COALESCE(is_public, true) as is_public
        FROM portfolios
        WHERE email = ${session.user.email}
        ORDER BY created_at DESC
      `;
      rows = result.rows;
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolios" },
      { status: 500 }
    );
  }
}