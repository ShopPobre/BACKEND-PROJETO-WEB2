import * as Minio from "minio";

const endpoint = process.env.MINIO_ENDPOINT || "localhost";
const port = parseInt(process.env.MINIO_PORT || "9000", 10);
const useSSL = process.env.MINIO_USE_SSL === "true";
const accessKey = process.env.MINIO_ACCESS_KEY || "minioadmin";
const secretKey = process.env.MINIO_SECRET_KEY || "minioadmin";
export const MINIO_BUCKET = process.env.MINIO_BUCKET || "shopobre";

export const minioClient = new Minio.Client({
  endPoint: endpoint,
  port,
  useSSL,
  accessKey,
  secretKey,
});

let bucketExistsPromise: Promise<void> | null = null;

export async function ensureBucket(): Promise<void> {
  if (bucketExistsPromise) return bucketExistsPromise;
  bucketExistsPromise = (async () => {
    try {
      const exists = await minioClient.bucketExists(MINIO_BUCKET);
      if (!exists) {
        await minioClient.makeBucket(MINIO_BUCKET, "us-east-1");
        console.log(`✅ Bucket MinIO "${MINIO_BUCKET}" criado.`);
      }
    } catch (err) {
      console.warn("⚠️ MinIO: não foi possível garantir bucket:", (err as Error).message);
    }
  })();
  return bucketExistsPromise;
}
