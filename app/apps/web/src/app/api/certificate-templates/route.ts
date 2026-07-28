import { NextResponse } from "next/server";
import { addCertificateTemplate } from "@/lib/server-store";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "권한이 없습니다." }, { status: 401 });
  }
  const body = await request.json();
  const dashboard = await addCertificateTemplate(String(body.fileName || "certificate-template"), body.dataUrl);
  return NextResponse.json(dashboard);
}
