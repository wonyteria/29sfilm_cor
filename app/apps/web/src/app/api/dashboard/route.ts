import { NextResponse } from "next/server";
import { buildDashboard, readState } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await readState();
  return NextResponse.json(buildDashboard(state));
}
