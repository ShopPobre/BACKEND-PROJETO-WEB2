import { ProductImage, ProductImageAttributes } from "../models/ProductImage";
import { IProductImageRepository } from "../interfaces/IProductImageRepository";

export class ProductImageRepository implements IProductImageRepository {
  async create(
    data: Omit<ProductImageAttributes, "id" | "createdAt" | "updatedAt">
  ): Promise<ProductImage> {
    return await ProductImage.create(data);
  }

  async findById(id: number): Promise<ProductImage | null> {
    return await ProductImage.findByPk(id);
  }

  async findByProductId(productId: number): Promise<ProductImage[]> {
    return await ProductImage.findAll({
      where: { productId },
      order: [["sortOrder", "ASC"]],
    });
  }

  async deleteById(id: number): Promise<void> {
    await ProductImage.destroy({ where: { id } });
  }

  async getNextSortOrder(productId: number): Promise<number> {
    const result = await ProductImage.max("sortOrder", { where: { productId } });
    const max = (result as number) ?? 0;
    return max + 1;
  }
}
