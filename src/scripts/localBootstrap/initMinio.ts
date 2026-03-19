import "../../config/env";
import sequelize from "../../config/database";
import { ensureBucket, MINIO_BUCKET } from "../../config/minio";

export async function runInitMinio(options?: { closeConnection?: boolean }) {
  const closeConnection = options?.closeConnection ?? true;
  await sequelize.authenticate();
  await ensureBucket();
  console.log(`✅ MinIO pronto. Bucket alvo: "${MINIO_BUCKET}"`);
  if (closeConnection) {
    await sequelize.close();
  }
}

if (require.main === module) {
  runInitMinio().catch((err) => {
    console.error("❌ Falha ao inicializar MinIO:", err);
    process.exit(1);
  });
}

