import { Readable } from "stream";
import { minioClient, MINIO_BUCKET, ensureBucket } from "../config/minio";
import { NotFoundError } from "../errors/AppError";

export interface UploadResult {
  objectKey: string;
  bucket: string;
}

export class MinioService {
  async uploadBuffer(
    buffer: Buffer,
    objectKey: string,
    mimeType: string,
    meta?: Record<string, string>
  ): Promise<UploadResult> {
    await ensureBucket();
    await minioClient.putObject(MINIO_BUCKET, objectKey, buffer, buffer.length, {
      "Content-Type": mimeType,
      ...meta,
    });
    return { objectKey, bucket: MINIO_BUCKET };
  }

  async getObjectStream(objectKey: string): Promise<Readable> {
    const stream = await minioClient.getObject(MINIO_BUCKET, objectKey);
    if (!stream) {
      throw new NotFoundError("Arquivo não encontrado no armazenamento");
    }
    return stream as Readable;
  }

  async removeObject(objectKey: string): Promise<void> {
    await minioClient.removeObject(MINIO_BUCKET, objectKey);
  }

  /** Gera uma chave única para o objeto no bucket (ex: products/1/uuid.ext) */
  static buildObjectKey(productId: number, originalName: string): string {
    const ext = originalName.includes(".") ? originalName.slice(originalName.lastIndexOf(".")) : "";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
    return `products/${productId}/${safeName}`;
  }
}
