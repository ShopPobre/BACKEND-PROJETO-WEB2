import { Product, ProductAttributes } from "../models/Product";

export interface IProductRepository {
    create(productData: Omit<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
    findByName(name: string): Promise<Product | null>;
    findById(id: number): Promise<Product | null>;
    findByCategoryId(categoryId: number): Promise<Product[]>;
    getAllProducts(): Promise<Product[]>;
    update(id: number, productData: Partial<ProductAttributes>): Promise<Product | null>;
    delete(id: number): Promise<boolean>;
}

