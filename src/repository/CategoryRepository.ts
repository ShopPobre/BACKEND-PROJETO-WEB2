import { Category, CategoryAttributes } from "../models/Category";

export class CategoryRepository {

    private categoryModel = Category;    

    async create(categoryData: Omit<CategoryAttributes, 'id'>) : Promise<Category>{
        return await this.categoryModel.create(categoryData)
    }

    async findByName(name: string): Promise<Category | null> {
        return await Category.findOne({
            where: { name }
        });
    }

    async findById(id: number): Promise<Category | null>{
        return await this.categoryModel.findByPk(id)
    }

    async getAllCategories() : Promise<Category[]> {
        return await this.categoryModel.findAll();
    }

    async update(id: number, categoryData: Partial<Category>) : Promise<Category | null> {
        const category = await this.findById(id);

        if (!category) {
            return null;
        }

        await category.update(categoryData);

        return await category.reload();
    }

    async delete(id: number): Promise<boolean> {
        const deletedRows = await Category.destroy({
            where: { id }
        });

        return deletedRows > 0;
    }
}