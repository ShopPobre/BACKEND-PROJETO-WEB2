import "../../config/env";
import fs from "fs/promises";
import path from "path";
import sequelize from "../../config/database";
import { ensureBucket, minioClient, MINIO_BUCKET } from "../../config/minio";
import { Category } from "../../models/Category";
import { Product } from "../../models/Product";
import { ProductImage } from "../../models/ProductImage";
import { Inventory } from "../../models/Inventory";
import { seedCategories, seedProducts } from "./seedData";
import { fileExists, guessMimeTypeByExt, readBase64FileToBuffer, seedImagePath, slugify } from "./utils";

async function ensureCategories() {
  for (const cat of seedCategories) {
    const existing = await Category.findOne({ where: { name: cat.name } });
    if (existing) continue;
    await Category.create({
      name: cat.name,
      description: cat.description ?? null,
      isActive: true,
    } as any);
  }
}

async function ensureInventoryForProduct(productId: number) {
  const inv = await Inventory.findOne({ where: { productId } });
  if (inv) return;
  await Inventory.create({
    productId,
    quantity: 0,
    minQuantity: 0,
    maxQuantity: 9999,
    isActive: true,
  } as any);
}

async function ensureMinioObject(
  objectKey: string,
  buffer: Buffer,
  mimeType: string,
  options?: { force?: boolean }
) {
  const force = options?.force ?? false;

  if (force) {
    await minioClient.putObject(MINIO_BUCKET, objectKey, buffer, buffer.length, {
      "Content-Type": mimeType,
    });
    return;
  }

  try {
    await minioClient.statObject(MINIO_BUCKET, objectKey);
    return;
  } catch {
    // segue para upload
  }

  await minioClient.putObject(MINIO_BUCKET, objectKey, buffer, buffer.length, {
    "Content-Type": mimeType,
  });
}

async function ensureProductAndImage() {
  const placeholderPngPath = seedImagePath("placeholder.png");
  const placeholderBase64Path = seedImagePath("placeholder.png.base64");
  const placeholderBuffer = (await fileExists(placeholderPngPath))
    ? await fs.readFile(placeholderPngPath)
    : await readBase64FileToBuffer(placeholderBase64Path);

  for (const p of seedProducts) {
    const category = await Category.findOne({ where: { name: p.categoryName } });
    if (!category) {
      throw new Error(`Categoria seed não encontrada: ${p.categoryName}`);
    }

    let product = await Product.findOne({ where: { name: p.name } });
    if (!product) {
      product = await Product.create({
        name: p.name,
        description: p.description ?? null,
        price: p.price,
        categoryId: (category as any).id,
        isActive: true,
      } as any);
    }

    await ensureInventoryForProduct((product as any).id);

    const productId = (product as any).id as number;

    for (let i = 0; i < p.images.length; i++) {
      const img = p.images[i];
      const expectedOriginalName = img.originalName;
      const expectedExt = path.extname(expectedOriginalName).toLowerCase() || ".png";

      const seedStem = path.parse(img.seedFileName).name;
      const extCandidates = [".png", ".webp", ".jpg", ".jpeg", ".gif", ".avif"];

      let actualMimeType = guessMimeTypeByExt(`${seedStem}${expectedExt}`);
      let originalNameToSave = expectedOriginalName;
      let bufferToUpload = placeholderBuffer;
      let foundActualFile = false;

      for (const candidateExt of extCandidates) {
        const candidateFileName = `${seedStem}${candidateExt}`;
        const candidateFilePath = seedImagePath(candidateFileName);

        if (!(await fileExists(candidateFilePath))) continue;

        bufferToUpload = await fs.readFile(candidateFilePath);
        actualMimeType = guessMimeTypeByExt(candidateFileName);
        originalNameToSave = candidateFileName;
        foundActualFile = true;
        break;
      }

      const objectKey = `products/${productId}/seed-${slugify(p.name)}-${String(i + 1).padStart(2, "0")}${expectedExt}`;

      const alreadyLinked = await ProductImage.findOne({
        where: { productId, objectKey },
      });

      await ensureBucket();
      await ensureMinioObject(objectKey, bufferToUpload, actualMimeType, {
        force: foundActualFile,
      });

      if (!alreadyLinked) {
        const maxSort =
          ((await ProductImage.max("sortOrder", { where: { productId } })) as number) ?? 0;
        const nextSortOrder = maxSort + 1;

        await ProductImage.create({
          productId,
          objectKey,
          originalName: originalNameToSave,
          mimeType: actualMimeType,
          size: bufferToUpload.length,
          sortOrder: nextSortOrder,
        } as any);
        continue;
      }

      const needsUpdate =
        alreadyLinked.mimeType !== actualMimeType ||
        alreadyLinked.originalName !== originalNameToSave ||
        alreadyLinked.size !== bufferToUpload.length;

      if (needsUpdate) {
        alreadyLinked.mimeType = actualMimeType;
        alreadyLinked.originalName = originalNameToSave;
        alreadyLinked.size = bufferToUpload.length;
        await alreadyLinked.save();
      }
    }
  }
}

export async function runSeedLocal(options?: { closeConnection?: boolean }) {
  const closeConnection = options?.closeConnection ?? true;
  await sequelize.authenticate();
  await sequelize.sync();
  await ensureBucket();
  await ensureCategories();
  await ensureProductAndImage();
  console.log("✅ Seed local concluído (categorias, produtos e imagens).");
  if (closeConnection) {
    await sequelize.close();
  }
}

if (require.main === module) {
  runSeedLocal().catch((err) => {
    console.error("❌ Falha ao rodar seed local:", err);
    process.exit(1);
  });
}

