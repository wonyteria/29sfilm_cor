import { NextResponse } from "next/server";
import { addEvent } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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
