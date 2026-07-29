import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { issueFriendsWarning, resolveFriendsWarning } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    return NextResponse.json(await issueFriendsWarning({
      participationId: String(body.participationId || ""),
      reason: String(body.reason || "").trim(),
      message: String(body.message || "").trim(),
      issuedBy: admin.email
    }));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "경고를 등록하지 못했습니다." }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    return NextResponse.json(await resolveFriendsWarning({ warningId: String(body.warningId || ""), handledBy: admin.email }));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "경고를 해제하지 못했습니다." }, { status: 400 });
  }
}
