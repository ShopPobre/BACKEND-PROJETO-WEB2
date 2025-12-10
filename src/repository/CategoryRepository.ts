import { Category, CategoryAttributes } from "../models/Category";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";

export class CategoryRepository implements ICategoryRepository {
    private categoryModel = Category;    

    async create(categoryData: Omit<CategoryAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
        try {
            return await this.categoryModel.create(categoryData);
        } catch (error: any) {
            throw error;
        }
    }

    async findByName(name: string): Promise<Category | null> {
        try {
            return await this.categoryModel.findOne({
                where: { name }
            });
        } catch (error: any) {
            throw error;
        }
    }

    async findById(id: number): Promise<Category | null> {
        try {
            return await this.categoryModel.findByPk(id);
        } catch (error: any) {
            throw error;
        }
    }

    async getAllCategories(): Promise<Category[]> {
        try {
            return await this.categoryModel.findAll({
                order: [['name', 'ASC']]
            });
        } catch (error: any) {
            throw error;
        }
    }

    async update(id: number, categoryData: Partial<CategoryAttributes>): Promise<Category | null> {
        try {
            const category = await this.findById(id);

            if (!category) {
                return null;
            }

            await category.update(categoryData);
            return await category.reload();
        } catch (error: any) {
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const deletedRows = await this.categoryModel.destroy({
                where: { id }
            });

            return deletedRows > 0;
        } catch (error: any) {
            throw error;
        }
    }
}