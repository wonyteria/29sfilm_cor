import { NextResponse } from "next/server";
import { addCertificateTemplate } from "@/lib/server-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const dashboard = await addCertificateTemplate(String(body.fileName || "certificate-template"), body.dataUrl);
  return NextResponse.json(dashboard);
}
