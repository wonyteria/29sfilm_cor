import { NextResponse } from "next/server";
import { buildDashboard, resetState } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function POST() {
  const state = await resetState();
  return NextResponse.json(buildDashboard(state));
}
