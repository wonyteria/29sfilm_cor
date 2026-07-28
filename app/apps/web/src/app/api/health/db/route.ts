import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`select 1`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const err = error as { code?: string; name?: string; message?: string };
    return NextResponse.json(
      {
        ok: false,
        errorCode: err.code ?? err.name ?? "UNKNOWN",
        message: sanitizeMessage(err.message)
      },
      { status: 500 }
    );
  }
}

function sanitizeMessage(message?: string) {
  if (!message) return "Database health check failed.";
  return message
    .replace(/postgres(?:ql)?:\/\/\S+/gi, "postgresql://<redacted>")
    .replace(/[A-Za-z0-9_+/-]{40,}/g, "<redacted>");
}
