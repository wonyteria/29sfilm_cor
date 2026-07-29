import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { scopeDashboardForTeacher } from "@/lib/dashboard-scope";
import { saveFriendsProfile } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (user.programType !== "FRIENDS_2026") throw new Error("29프렌즈 계정으로 이용해 주세요.");
    const body = await request.json();
    const dashboard = await saveFriendsProfile({
      email: user.email,
      name: user.name,
      phone: String(body.phone || "").trim(),
      socialChannel: String(body.socialChannel || "").trim(),
      socialUrl: String(body.socialUrl || "").trim(),
      introduction: String(body.introduction || "").trim()
    });
    return NextResponse.json(scopeDashboardForTeacher(dashboard, user));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "프로필을 저장하지 못했습니다." }, { status: 400 });
  }
}
