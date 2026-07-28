import { NextResponse } from "next/server";
import { scheduleMail, sendScheduledMail } from "@/lib/mail-service";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const recipients = Array.isArray(body.recipients)
      ? body.recipients
      : String(body.recipientEmails || "")
          .split(/[,\n;]/)
          .map((email) => email.trim())
          .filter(Boolean)
          .map((email) => ({ email }));
    const mail = await scheduleMail({
      subject: String(body.subject || "").trim(),
      body: String(body.body || "").trim(),
      recipients,
      scheduledAt: body.scheduledAt ? String(body.scheduledAt) : undefined,
      mailType: body.mailType ? String(body.mailType) : undefined
    });
    if (body.sendNow) {
      const sent = await sendScheduledMail(mail.id);
      return NextResponse.json({ mail: sent });
    }
    return NextResponse.json({ mail });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "메일을 처리하지 못했습니다." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    return NextResponse.json({ mail: await sendScheduledMail(String(body.scheduledMailId || "")) });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "메일을 발송하지 못했습니다." },
      { status: 400 }
    );
  }
}
