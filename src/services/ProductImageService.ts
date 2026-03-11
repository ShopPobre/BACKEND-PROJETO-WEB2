import { ProductImage } from "../models/ProductImage";
import { IProductImageRepository } from "../interfaces/IProductImageRepository";
import { MinioService } from "./MinioService";
import { NotFoundError, BadRequestError } from "../errors/AppError";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export class ProductImageService {
  constructor(
    private productImageRepository: IProductImageRepository,
    private minioService: MinioService
  ) {}

  async createFromBuffer(
    productId: number,
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<ProductImage> {
    if (!ALLOWED_MIMES.includes(mimeType)) {
      throw new BadRequestError(
        `Tipo de arquivo não permitido. Use: ${ALLOWED_MIMES.join(", ")}`
      );
    }
    if (buffer.length > MAX_SIZE_BYTES) {
      throw new BadRequestError("Arquivo muito grande. Máximo 5MB.");
    }
    const objectKey = MinioService.buildObjectKey(productId, originalName);
    await this.minioService.uploadBuffer(buffer, objectKey, mimeType);
    const sortOrder = await this.productImageRepository.getNextSortOrder(productId);
    return await this.productImageRepository.create({
      productId,
      objectKey,
      originalName,
      mimeType,
      size: buffer.length,
      sortOrder,
    });
  }

  async findByProductId(productId: number): Promise<ProductImage[]> {
    return await this.productImageRepository.findByProductId(productId);
  }

  async findByIdAndProductId(id: number, productId: number): Promise<ProductImage> {
    const image = await this.productImageRepository.findById(id);
    if (!image || image.productId !== productId) {
      throw new NotFoundError("Imagem não encontrada");
    }
    return image;
  }

  async deleteImage(id: number, productId: number): Promise<void> {
    const image = await this.findByIdAndProductId(id, productId);
    await this.minioService.removeObject(image.objectKey);
    await this.productImageRepository.deleteById(id);
  }

  async getObjectStream(id: number, productId: number): Promise<{ stream: NodeJS.ReadableStream; mimeType: string }> {
    const image = await this.findByIdAndProductId(id, productId);
    const stream = await this.minioService.getObjectStream(image.objectKey);
    return { stream, mimeType: image.mimeType };
  }
}
