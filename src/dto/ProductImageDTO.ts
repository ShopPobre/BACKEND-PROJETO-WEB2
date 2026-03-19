export interface ProductImageResponseDTO {
  id: number;
  productId: number;
  objectKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  sortOrder: number;
  urlPath: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
