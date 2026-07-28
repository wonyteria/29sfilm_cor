import { NextResponse } from "next/server";
import { sendDueScheduledMails } from "@/lib/mail-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const expectedSecret = process.env.CRON_SECRET;
  const actualSecret = request.headers.get("x-cron-secret") || new URL(request.url).searchParams.get("secret");
  if (!expectedSecret || actualSecret !== expectedSecret) {
    return NextResponse.json({ message: "예약 발송 권한이 없습니다." }, { status: 401 });
  }

  const body = await safeJson(request);
  const limit = Math.min(Math.max(Number(body?.limit || 20), 1), 100);
  return NextResponse.json(await sendDueScheduledMails(limit));
}

export async function GET(request: Request) {
  return POST(request);
}

async function safeJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
