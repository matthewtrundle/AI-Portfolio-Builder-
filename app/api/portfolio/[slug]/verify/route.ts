import { NextRequest, NextResponse } from "next/server";
import { getPortfolio, verifyPin } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json({ error: "PIN required" }, { status: 400 });
    }

    const portfolio = await getPortfolio(params.slug);

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    if (!verifyPin(pin, portfolio.pin_hash)) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    // Don't send the PIN hash to the client
    const { pin_hash, ...portfolioData } = portfolio;

    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}