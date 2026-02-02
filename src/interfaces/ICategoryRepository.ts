import { Category, CategoryAttributes } from "../models/Category";
import { PaginationResult, QueryParams } from "../types/pagination";

export interface ICategoryRepository {
    create(categoryData: Omit<CategoryAttributes, 'id'>): Promise<Category>;
    findByName(name: string): Promise<Category | null>;
    findById(id: number): Promise<Category | null>;
    getAllCategories(queryParams?: QueryParams): Promise<PaginationResult<Category>>;
    update(id: number, categoryData: Partial<CategoryAttributes>): Promise<Category | null>;
    delete(id: number): Promise<boolean>;
}

