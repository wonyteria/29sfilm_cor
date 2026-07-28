import { prisma, isDatabaseConfigured } from "./prisma";

export type StoredFileInput = {
  originalName: string;
  dataUrl?: string;
  contentType?: string;
  uploadedBy?: string;
  folder?: string;
};

export async function storeFileAsset(input: StoredFileInput) {
  const parsed = input.dataUrl ? parseDataUrl(input.dataUrl) : null;
  const contentType = input.contentType || parsed?.contentType || "application/octet-stream";
  const sizeBytes = parsed?.buffer.byteLength ?? null;

  if (isDatabaseConfigured() && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_STORAGE_BUCKET && parsed) {
    const bucket = process.env.SUPABASE_STORAGE_BUCKET;
    const objectPath = `${input.folder || "uploads"}/${Date.now()}-${safeFileName(input.originalName)}`;
    const baseUrl = process.env.SUPABASE_URL.replace(/\/$/, "");
    const uploadResponse = await fetch(`${baseUrl}/storage/v1/object/${bucket}/${objectPath}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        "Content-Type": contentType,
        "x-upsert": "true"
      },
      body: parsed.buffer
    });
    if (!uploadResponse.ok) {
      throw new Error(`Supabase Storage 업로드 실패: ${await uploadResponse.text()}`);
    }
    return prisma.fileAsset.create({
      data: {
        originalName: input.originalName,
        contentType,
        sizeBytes,
        storageProvider: "SUPABASE_STORAGE",
        bucket,
        objectPath,
        publicUrl: `${baseUrl}/storage/v1/object/public/${bucket}/${objectPath}`,
        uploadedBy: input.uploadedBy
      }
    });
  }

  if (!isDatabaseConfigured()) return null;

  return prisma.fileAsset.create({
    data: {
      originalName: input.originalName,
      contentType,
      sizeBytes,
      storageProvider: "LOCAL_DATA_URL",
      dataUrl: input.dataUrl,
      uploadedBy: input.uploadedBy
    }
  });
}

function parseDataUrl(dataUrl: string) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  return {
    contentType: match[1],
    buffer: Buffer.from(match[2], "base64")
  };
}

function safeFileName(value: string) {
  return value.replace(/[^A-Za-z0-9._-]+/g, "_").slice(0, 120) || "upload.bin";
}
