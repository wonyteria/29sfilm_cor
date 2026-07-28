import { NextResponse } from "next/server";
import { listScheduledMails, scheduleMail, sendScheduledMail } from "@/lib/mail-service";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ mails: await listScheduledMails(30) });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "메일 목록을 불러오지 못했습니다." },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const action = String(body.action || "save");
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
      scheduledAt: action === "schedule" && body.scheduledAt ? String(body.scheduledAt) : undefined,
      mailType: body.mailType ? String(body.mailType) : undefined
    });
    if (action === "send") {
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
