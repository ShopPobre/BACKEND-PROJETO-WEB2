import { Product, ProductAttributes } from "../models/Product";
import { IProductRepository } from "../interfaces/IProductRepository";

export class ProductRepository implements IProductRepository {
    private productModel = Product;    

    async create(productData: Omit<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
        try {
            return await this.productModel.create(productData);
        } catch (error: any) {
            throw error;
        }
    }

    async findByName(name: string): Promise<Product | null> {
        try {
            return await this.productModel.findOne({
                where: { name }
            });
        } catch (error: any) {
            throw error;
        }
    }

    async findById(id: number): Promise<Product | null> {
        try {
            return await this.productModel.findByPk(id);
        } catch (error: any) {
            throw error;
        }
    }

    async findByCategoryId(categoryId: number): Promise<Product[]> {
        try {
            return await this.productModel.findAll({
                where: { categoryId },
                order: [['name', 'ASC']]
            });
        } catch (error: any) {
            throw error;
        }
    }

    async getAllProducts(): Promise<Product[]> {
        try {
            return await this.productModel.findAll({
                order: [['name', 'ASC']]
            });
        } catch (error: any) {
            throw error;
        }
    }

    async update(id: number, productData: Partial<ProductAttributes>): Promise<Product | null> {
        try {
            const product = await this.findById(id);

            if (!product) {
                return null;
            }

            await product.update(productData);
            return await product.reload();
        } catch (error: any) {
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const deletedRows = await this.productModel.destroy({
                where: { id }
            });

            return deletedRows > 0;
        } catch (error: any) {
            throw error;
        }
    }
}

