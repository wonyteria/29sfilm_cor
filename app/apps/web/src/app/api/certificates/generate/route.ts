import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { existsSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CertificateWork = {
  title: string;
  participantName?: string;
};

export async function POST(request: Request) {
  const body = await request.json();
  const works = normalizeWorks(body.works);
  const pdf = await buildCertificatePdf({
    certificateNo: String(body.certificateNo || "0000"),
    schoolName: String(body.schoolName || t("학교명")),
    teacherName: String(body.teacherName || ""),
    eventTitle: String(body.eventTitle || t("영상 꿈나무 양성 프로젝트")),
    activityPeriod: String(body.activityPeriod || ""),
    issuedAt: body.issuedAt ? new Date(String(body.issuedAt)) : new Date(),
    works
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=activity-certificate.pdf"
    }
  });
}

function normalizeWorks(value: unknown): CertificateWork[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === "string") return { title: item };
    const row = item as Partial<CertificateWork>;
    return {
      title: String(row.title || "").trim(),
      participantName: String(row.participantName || "").trim()
    };
  }).filter((item) => item.title || item.participantName);
}

function buildCertificatePdf(input: {
  certificateNo: string;
  schoolName: string;
  teacherName: string;
  eventTitle: string;
  activityPeriod: string;
  issuedAt: Date;
  works: CertificateWork[];
}) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 0 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const fontPath = findKoreanFontPath();
    const hasKoreanFont = Boolean(fontPath);
    if (fontPath) doc.font(fontPath);

    const beige = "#d8b994";
    const dark = "#2a2523";
    doc.rect(0, 0, 595, 842).fill("#fffdf9");
    drawCertificateBorder(doc, beige);
    drawBrand(doc, beige);

    doc.fillColor(dark);
    doc.fontSize(15).text(`${t("제")} ${input.certificateNo} ${t("호")}`, 70, 72);
    doc.fontSize(34).text(hasKoreanFont ? t("활동확인서") : "Activity Certificate", 0, 180, { align: "center" });

    const workTitles = input.works.map((work) => work.title).filter(Boolean).join(", ") || t("출품 확인 작품");
    const studentNames = input.works.map((work) => work.participantName).filter(Boolean).join(", ") || input.teacherName || "-";
    const periodText = input.activityPeriod || t("공모기간");

    doc.fontSize(17);
    fieldLine(doc, t("학교"), input.schoolName, 80, 300, 430);
    fieldLine(doc, t("작품명"), workTitles, 80, 338, 430);
    fieldLine(doc, t("이름"), studentNames, 80, 376, 430);

    doc.fontSize(17).text(`${t("위 학생은")} ${periodText}${t("까지")}`, 0, 452, { align: "center" });
    doc.fontSize(17).text(t("29초영화제사무국이 주관한"), 0, 492, { align: "center" });
    doc.fontSize(17).text(`<${input.eventTitle}>${t("에서 활동하며,")}`, 0, 532, { align: "center" });
    doc.fontSize(17).text(t("맡은 역할을 열정적인 자세로"), 0, 572, { align: "center" });
    doc.fontSize(17).text(t("성실히 수행하였기에 이 증서를 수여합니다."), 0, 612, { align: "center" });

    doc.fontSize(20).text(formatKoreanDate(input.issuedAt), 0, 704, { align: "center" });
    doc.fontSize(19).text(t("29초영화제사무국"), 0, 762, { align: "center" });
    doc.fontSize(9).text(t("(직인생략)"), 360, 768);
    doc.end();
  });
}

function drawCertificateBorder(doc: PDFKit.PDFDocument, color: string) {
  doc.save();
  doc.strokeColor(color).lineWidth(2);
  doc.moveTo(82, 32).lineTo(513, 32).stroke();
  doc.moveTo(82, 810).lineTo(513, 810).stroke();
  doc.moveTo(30, 92).lineTo(30, 318).stroke();
  doc.moveTo(30, 522).lineTo(30, 762).stroke();
  doc.moveTo(565, 92).lineTo(565, 318).stroke();
  doc.moveTo(565, 522).lineTo(565, 762).stroke();
  doc.fontSize(34).fillColor(color);
  doc.text("29", 33, 34);
  doc.text("29", 518, 34);
  doc.text("29", 33, 773);
  doc.text("29", 518, 773);
  doc.restore();
}

function drawBrand(doc: PDFKit.PDFDocument, color: string) {
  const symbolPath = join(process.cwd(), "public", "brand", "29film-symbol.jpg");
  if (existsSync(symbolPath)) {
    doc.image(symbolPath, 245, 108, { width: 104, height: 104 });
  } else {
    doc.save().fillColor(color).fontSize(62).text("29", 0, 112, { align: "center" }).restore();
  }
}

function fieldLine(doc: PDFKit.PDFDocument, label: string, value: string, x: number, y: number, width: number) {
  doc.fillColor("#2a2523").fontSize(17).text(`${label}:`, x, y, { continued: true });
  doc.fontSize(17).text(` ${value || "-"}`, { width, continued: false });
}

function findKoreanFontPath() {
  const candidates = [
    process.env.CERTIFICATE_FONT_PATH,
    join(process.cwd(), "public", "fonts", "NotoSansKR-Regular.ttf"),
    "C:/Windows/Fonts/malgun.ttf",
    "/System/Library/Fonts/Supplemental/AppleGothic.ttf",
    "/usr/share/fonts/truetype/noto/NotoSansKR-Regular.ttf",
    "/usr/share/fonts/opentype/noto/NotoSansKR-Regular.ttf",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
  ].filter(Boolean) as string[];
  return candidates.find((candidate) => existsSync(candidate));
}

function formatKoreanDate(date: Date) {
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

function t(value: string) {
  return value;
}
