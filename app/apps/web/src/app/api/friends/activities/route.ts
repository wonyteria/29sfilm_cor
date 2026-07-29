import { NextResponse } from "next/server";
import { requireAdmin, requireUser } from "@/lib/auth";
import { scopeDashboardForTeacher } from "@/lib/dashboard-scope";
import { addFriendsActivity, reviewFriendsActivity } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (user.programType !== "FRIENDS_2026") throw new Error("29프렌즈 계정으로 이용해 주세요.");
    const body = await request.json();
    const dashboard = await addFriendsActivity({
      email: user.email,
      participationId: String(body.participationId || ""),
      activityType: body.activityType === "PROMOTION" ? "PROMOTION" : "SUBMISSION",
      title: String(body.title || "").trim(),
      url: String(body.url || "").trim(),
      memo: String(body.memo || "").trim()
    });
    return NextResponse.json(scopeDashboardForTeacher(dashboard, user));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "활동 링크를 제출하지 못했습니다." }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    return NextResponse.json(await reviewFriendsActivity({
      linkId: String(body.linkId || ""),
      status: body.status === "NEEDS_REVISION" ? "NEEDS_REVISION" : "APPROVED",
      adminMemo: String(body.adminMemo || "").trim(),
      handledBy: admin.email
    }));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "활동을 검토하지 못했습니다." }, { status: 400 });
  }
}
