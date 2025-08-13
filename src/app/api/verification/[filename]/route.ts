// src/app/api/verification/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  pdf: "application/pdf",
};

export async function GET(req: NextRequest) {
  try {
    // извлекаем имя файла из URL: /api/verification/<filename>
    const url = new URL(req.url);
    const filenameRaw = url.pathname.split("/").pop() || "";
    // защита от traversal + декод
    const filename = path.basename(decodeURIComponent(filenameRaw));
    if (!filename) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, filename);
    const file = await fs.readFile(filePath);

    const ext = (filename.split(".").pop() || "").toLowerCase();
    const type = MIME[ext] ?? "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "private, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
