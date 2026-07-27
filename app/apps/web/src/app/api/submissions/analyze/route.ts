import { NextResponse } from "next/server";
import { analyzeSubmissions } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const eventId = String(body.eventId || "");
  const rows = Array.isArray(body.rows) ? body.rows : [];
  const dashboard = await analyzeSubmissions(eventId, rows);
  return NextResponse.json(dashboard);
}
