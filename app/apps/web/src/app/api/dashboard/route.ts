import { NextResponse } from "next/server";
import { buildDashboard, readState } from "@/lib/server-store";
import { requireUser } from "@/lib/auth";
import { scopeDashboardForTeacher } from "@/lib/dashboard-scope";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    const state = await readState();
    if (user.userType === "ADMIN") return NextResponse.json(buildDashboard(state));

    return NextResponse.json(scopeDashboardForTeacher(state, user));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "로그인이 필요합니다." }, { status: 401 });
  }
}
