import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      nodeEnv: process.env.NODE_ENV,
    }
  });
}