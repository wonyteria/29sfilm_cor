import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const profileId = new URL(request.url).searchParams.get("profileId") || "";
    const profile = await prisma.teacherProfile.findUnique({ where: { id: profileId } });
    if (!profile?.idCardFileId) throw new Error("제출된 교사 증빙자료가 없습니다.");
    const file = await prisma.fileAsset.findUnique({ where: { id: profile.idCardFileId } });
    if (!file) throw new Error("교사 증빙 파일을 찾을 수 없습니다.");

    let bytes: Buffer;
    if (file.dataUrl) {
      const match = /^data:([^;]+);base64,(.+)$/.exec(file.dataUrl);
      if (!match) throw new Error("저장된 파일 형식이 올바르지 않습니다.");
      bytes = Buffer.from(match[2], "base64");
    } else if (file.bucket && file.objectPath && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const baseUrl = process.env.SUPABASE_URL.replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/storage/v1/object/authenticated/${file.bucket}/${file.objectPath}`, {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY
        },
        cache: "no-store"
      });
      if (!response.ok) throw new Error("저장소에서 교사 증빙 파일을 불러오지 못했습니다.");
      bytes = Buffer.from(await response.arrayBuffer());
    } else {
      throw new Error("교사 증빙 파일 저장 정보를 찾을 수 없습니다.");
    }

    return new NextResponse(new Blob([new Uint8Array(bytes)], { type: file.contentType || "application/octet-stream" }), {
      headers: {
        "Content-Type": file.contentType || "application/octet-stream",
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
        "Cache-Control": "private, no-store"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "교사 증빙자료를 불러오지 못했습니다." },
      { status: 400 }
    );
  }
}
