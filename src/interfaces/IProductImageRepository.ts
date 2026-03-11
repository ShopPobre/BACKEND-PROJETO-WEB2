import { ProductImage, ProductImageAttributes } from "../models/ProductImage";

export interface IProductImageRepository {
  create(data: Omit<ProductImageAttributes, "id" | "createdAt" | "updatedAt">): Promise<ProductImage>;
  findById(id: number): Promise<ProductImage | null>;
  findByProductId(productId: number): Promise<ProductImage[]>;
  deleteById(id: number): Promise<void>;
  getNextSortOrder(productId: number): Promise<number>;
}
