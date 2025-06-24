import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rows } = await sql`
      SELECT 
        p.id,
        p.slug,
        p.name,
        p.created_at,
        p.updated_at,
        p.view_count,
        p.is_public
      FROM portfolios p
      JOIN users u ON u.id = p.user_id
      WHERE u.email = ${session.user.email}
      ORDER BY p.created_at DESC
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolios" },
      { status: 500 }
    );
  }
}