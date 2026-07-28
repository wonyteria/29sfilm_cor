import { NextResponse } from "next/server";
import { addEvent, updateEventStatus } from "@/lib/server-store";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "권한이 없습니다." }, { status: 401 });
  }
  const body = await request.json();
  const targetSubmissionCount = Number.parseInt(String(body.targetSubmissionCount || "10"), 10);
  const dashboard = await addEvent({
    title: String(body.title || "").trim(),
    eventType: body.eventType,
    posterUrl: String(body.posterUrl || "").trim(),
    contestPeriod: String(body.contestPeriod || "").trim(),
    topic: String(body.topic || "").trim(),
    prize: String(body.prize || "").trim(),
    homepageUrl: String(body.homepageUrl || "").trim(),
    submissionUrl: String(body.submissionUrl || "").trim(),
    notice: String(body.notice || "").trim(),
    targetSubmissionCount: Number.isFinite(targetSubmissionCount) && targetSubmissionCount > 0 ? targetSubmissionCount : 10,
    status: body.status
  });
  return NextResponse.json(dashboard);
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    return NextResponse.json(await updateEventStatus(String(body.eventId || ""), body.status));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "행사 단계를 변경하지 못했습니다." },
      { status: 400 }
    );
  }
}
