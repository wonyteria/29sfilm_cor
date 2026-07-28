import nodemailer from "nodemailer";
import { prisma, isDatabaseConfigured } from "./prisma";

export type MailDraftInput = {
  subject: string;
  body: string;
  senderEmail?: string;
  senderName?: string;
  recipients: Array<{ email: string; teacherName?: string; schoolName?: string }>;
  scheduledAt?: string;
  mailType?: string;
};

export async function scheduleMail(input: MailDraftInput) {
  if (!input.subject || !input.body || !input.recipients.length) {
    throw new Error("제목, 본문, 수신자가 필요합니다.");
  }

  if (!isDatabaseConfigured()) {
    return { id: `mail_${Date.now()}`, status: "DRAFT" };
  }

  return prisma.scheduledMail.create({
    data: {
      mailType: input.mailType || "NOTICE",
      senderName: input.senderName || "29 WITH",
      senderEmail: input.senderEmail || process.env.MAIL_FROM || process.env.SMTP_USER || "no-reply@29with.local",
      subject: input.subject,
      body: input.body,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
      status: input.scheduledAt ? "SCHEDULED" : "DRAFT",
      recipients: {
        create: input.recipients.map((recipient) => ({
          email: recipient.email,
          teacherName: recipient.teacherName,
          schoolName: recipient.schoolName
        }))
      }
    },
    include: { recipients: true }
  });
}

export async function listScheduledMails(limit = 20) {
  if (!isDatabaseConfigured()) return [];

  return prisma.scheduledMail.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { recipients: true, sendLogs: true }
  });
}

export async function sendScheduledMail(scheduledMailId: string) {
  if (!isDatabaseConfigured()) {
    return { id: scheduledMailId, status: "SENT_DEMO" };
  }

  const mail = await prisma.scheduledMail.findUnique({
    where: { id: scheduledMailId },
    include: { recipients: true }
  });
  if (!mail) throw new Error("메일 예약 건을 찾을 수 없습니다.");
  if (!mail.recipients.filter((recipient) => !recipient.isExcluded).length) throw new Error("발송 대상 수신자가 없습니다.");

  const transporter = createSmtpTransporter();
  const activeRecipients = mail.recipients.filter((recipient) => !recipient.isExcluded);

  for (const recipient of activeRecipients) {
    try {
      const result = await transporter.sendMail({
        from: mail.senderName ? `"${mail.senderName}" <${mail.senderEmail}>` : mail.senderEmail,
        to: recipient.email,
        subject: mail.subject,
        text: mail.body,
        html: mail.body.replace(/\n/g, "<br />")
      });
      await prisma.mailSendLog.create({
        data: {
          scheduledMailId: mail.id,
          recipientEmail: recipient.email,
          status: "SENT",
          providerMessageId: String(result.messageId || ""),
          sentAt: new Date()
        }
      });
    } catch (error) {
      await prisma.mailSendLog.create({
        data: {
          scheduledMailId: mail.id,
          recipientEmail: recipient.email,
          status: "FAILED",
          errorMessage: error instanceof Error ? error.message : "발송 실패"
        }
      });
      throw error;
    }
  }

  return prisma.scheduledMail.update({
    where: { id: mail.id },
    data: { status: "SENT", sentAt: new Date() },
    include: { recipients: true, sendLogs: true }
  });
}

export async function sendDueScheduledMails(limit = 20) {
  if (!isDatabaseConfigured()) return { sent: 0, failed: 0, results: [] };

  const dueMails = await prisma.scheduledMail.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { lte: new Date() }
    },
    orderBy: { scheduledAt: "asc" },
    take: limit
  });

  const results: Array<{ id: string; status: "SENT" | "FAILED"; message?: string }> = [];
  for (const mail of dueMails) {
    try {
      await sendScheduledMail(mail.id);
      results.push({ id: mail.id, status: "SENT" });
    } catch (error) {
      results.push({
        id: mail.id,
        status: "FAILED",
        message: error instanceof Error ? error.message : "발송 실패"
      });
    }
  }

  return {
    sent: results.filter((result) => result.status === "SENT").length,
    failed: results.filter((result) => result.status === "FAILED").length,
    results
  };
}

function createSmtpTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP_HOST, SMTP_USER, SMTP_PASS 환경변수가 필요합니다.");
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}
