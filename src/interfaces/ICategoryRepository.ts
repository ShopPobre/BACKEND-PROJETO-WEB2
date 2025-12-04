import { Category, CategoryAttributes } from "../models/Category";

export interface ICategoryRepository {
    create(categoryData: Omit<CategoryAttributes, 'id'>): Promise<Category>;
    findByName(name: string): Promise<Category | null>;
    findById(id: number): Promise<Category | null>;
    getAllCategories(): Promise<Category[]>;
    update(id: number, categoryData: Partial<CategoryAttributes>): Promise<Category | null>;
    delete(id: number): Promise<boolean>;
}

