import { Category } from "../models/Category";
import { CategoryRepository } from "../repository/CategoryRepository";

export class CategoryService{

    constructor(private categoryRepository: CategoryRepository){}

    async createCategory(name : string): Promise<Category> {
        if(!name){
            throw new Error('O nome é obrigatório.')
        }

        const existing = await this.categoryRepository.findByName(name);
        if (existing) {
            throw new Error('Category already exists')
        }

        return this.categoryRepository.create({ name });
    }

    async getCategories() : Promise<Category[]> {
        return this.categoryRepository.getAllCategories();
    }

    async getCategoryById(id : number) : Promise<Category | null> {
        if(!id){
            throw new Error('ID é obrigatório');
        }

        const category = await this.categoryRepository.findById(id);
        if (!category) throw new Error('Category not found');

        return category;
    }

    async updateCategoryById(id: number, categoryData : Partial<Category>){
        if(!id){
            throw new Error('ID é obrigatório');
        }

        const category = await this.categoryRepository.findById(id);
        if (!category) throw new Error('Category not found');

        if (categoryData.name && categoryData.name !== category.name) {
            
            const existingName = await this.categoryRepository.findByName(categoryData.name);
            
            if (existingName) {
                throw new Error('Category name already currently in use');
            }
        }

        const updatedCategory = this.categoryRepository.update(id, categoryData)

        if(!updatedCategory){
            throw new Error('Error updating category')
        }

        return updatedCategory;
    }
}