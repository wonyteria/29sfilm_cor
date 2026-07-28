import { NextResponse } from "next/server";
import { buildDashboard, resetState } from "@/lib/server-store";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await requireAdmin();
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "권한이 없습니다." }, { status: 401 });
  }
  const state = await resetState();
  return NextResponse.json(buildDashboard(state));
}
