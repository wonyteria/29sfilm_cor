import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { existsSync } from "node:fs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const schoolName = String(body.schoolName || "학교명");
  const teacherName = String(body.teacherName || "담당교사");
  const works = Array.isArray(body.works) ? body.works.map(String) : [];

  const pdf = await buildCertificatePdf({
    schoolName,
    teacherName,
    works,
    issuedAt: new Date()
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=certificate.pdf"
    }
  });
}

function buildCertificatePdf(input: { schoolName: string; teacherName: string; works: string[]; issuedAt: Date }) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 64 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const fontPath = findKoreanFontPath();
    let hasKoreanFont = false;
    if (fontPath) {
      try {
        doc.font(fontPath);
        hasKoreanFont = true;
      } catch {
        hasKoreanFont = false;
      }
    }

    doc.lineWidth(4).rect(48, 48, 499, 745).stroke("#111827");
    doc.fontSize(34).text(hasKoreanFont ? "활동확인서" : "Activity Certificate", 0, 120, { align: "center" });
    doc.moveDown(2);
    doc.fontSize(16);
    doc.text(hasKoreanFont ? `학교: ${input.schoolName}` : `School: ${asciiFallback(input.schoolName)}`, 96, 220);
    doc.moveDown(0.8);
    doc.text(hasKoreanFont ? `담당교사: ${input.teacherName}` : `Teacher: ${asciiFallback(input.teacherName)}`);
    doc.moveDown(0.8);
    doc.text(
      hasKoreanFont
        ? `활동 작품: ${input.works.join(", ") || "출품 확인 후 자동 기재"}`
        : `Works: ${input.works.map(asciiFallback).join(", ") || "To be filled after submission confirmation"}`,
      { width: 400 }
    );
    doc.moveDown(2);
    doc.text(
      hasKoreanFont
        ? "위 학교는 29초영화제사무국이 주관한 영상 꿈나무 양성 프로젝트에 참여하여 성실히 활동하였음을 확인합니다."
        : "This certifies participation in the 29 WITH Dream Project.",
      { width: 400, align: "left" }
    );
    doc.text(input.issuedAt.toLocaleDateString("ko-KR"), 0, 560, { align: "center" });
    doc.fontSize(20).text(hasKoreanFont ? "29초영화제사무국" : "29 WITH Operations", 0, 610, { align: "center" });
    doc.end();
  });
}

function findKoreanFontPath() {
  const candidates = [
    process.env.CERTIFICATE_FONT_PATH,
    "/System/Library/Fonts/Supplemental/AppleGothic.ttf",
    "/usr/share/fonts/truetype/noto/NotoSansKR-Regular.ttf",
    "/usr/share/fonts/opentype/noto/NotoSansKR-Regular.ttf",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
  ].filter(Boolean) as string[];
  return candidates.find((candidate) => existsSync(candidate));
}

function asciiFallback(value: string) {
  return value.replace(/[^\x20-\x7E]/g, "").trim() || "-";
}
