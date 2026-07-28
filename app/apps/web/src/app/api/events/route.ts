import { NextResponse } from "next/server";
import { addEvent } from "@/lib/server-store";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "권한이 없습니다." }, { status: 401 });
  }
  const body = await request.json();
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
    targetSubmissionCount: Number(body.targetSubmissionCount || 0),
    status: body.status
  });
  return NextResponse.json(dashboard);
}
