import fs from "fs/promises";
import path from "path";

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function guessMimeTypeByExt(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".avif") return "image/avif";
  if (ext === ".gif") return "image/gif";
  return "application/octet-stream";
}

export async function readBase64FileToBuffer(base64Path: string): Promise<Buffer> {
  const content = (await fs.readFile(base64Path, "utf8")).trim();
  return Buffer.from(content, "base64");
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readSeedImageToBufferOrPlaceholder(seedFilePath: string): Promise<Buffer> {
  if (await fileExists(seedFilePath)) {
    return await fs.readFile(seedFilePath);
  }
  const placeholderBase64 = seedImagePath("placeholder.png");
  return await readBase64FileToBuffer(placeholderBase64);
}

export function seedImagePath(fileName: string): string {
  return path.resolve(process.cwd(), "seed-images", fileName);
}

