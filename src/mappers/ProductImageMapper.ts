import { ProductImage } from "../models/ProductImage";
import { ProductImageResponseDTO } from "../dto/ProductImageDTO";

export class ProductImageMapper {
  static toDTO(image: ProductImage, productId: number): ProductImageResponseDTO {
    return {
      id: image.id,
      productId: image.productId,
      objectKey: image.objectKey,
      originalName: image.originalName,
      mimeType: image.mimeType,
      size: image.size,
      sortOrder: image.sortOrder,
      urlPath: `/api/products/${productId}/images/${image.id}/file`,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  }

  static toDTOArray(images: ProductImage[], productId: number): ProductImageResponseDTO[] {
    return images.map((img) => this.toDTO(img, productId));
  }
}
