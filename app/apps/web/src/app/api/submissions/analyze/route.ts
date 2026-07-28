import { NextResponse } from "next/server";
import { analyzeSubmissions } from "@/lib/server-store";
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
