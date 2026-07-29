import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { scopeDashboardForTeacher } from "@/lib/dashboard-scope";
import { joinFriendsEvent } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (user.programType !== "FRIENDS_2026") throw new Error("29프렌즈 계정으로 이용해 주세요.");
    const body = await request.json();
    const dashboard = await joinFriendsEvent({ email: user.email, eventId: String(body.eventId || "") });
    return NextResponse.json(scopeDashboardForTeacher(dashboard, user));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "행사 참여를 시작하지 못했습니다." }, { status: 400 });
  }
}
