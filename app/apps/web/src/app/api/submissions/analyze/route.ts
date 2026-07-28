import { NextResponse } from "next/server";
import { analyzeSubmissions, confirmSubmissionMatch } from "@/lib/server-store";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "권한이 없습니다." }, { status: 401 });
  }
  const body = await request.json();
  const eventId = String(body.eventId || "");
  const rows = Array.isArray(body.rows) ? body.rows : [];
  const dashboard = await analyzeSubmissions(eventId, rows, {
    fileName: body.fileName ? String(body.fileName) : undefined,
    dataUrl: body.dataUrl ? String(body.dataUrl) : undefined
  });
  return NextResponse.json(dashboard);
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    return NextResponse.json(
      await confirmSubmissionMatch(String(body.externalSubmissionId || ""), String(body.applicationId || ""))
    );
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "출품작 매칭을 확정하지 못했습니다." },
      { status: 400 }
    );
  }
}
