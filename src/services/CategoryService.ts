import { Category } from "../models/Category";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dto/CategoryDTO";
import { NotFoundError, ConflictError } from "../errors/AppError";
import { CategoryValidator } from "../validators/categoryValidator";

export class CategoryService {
    constructor(private categoryRepository: ICategoryRepository) {}

    async createCategory(data: CreateCategoryDTO): Promise<Category> {
        CategoryValidator.validateCreate(data);

        const trimmedName = data.name.trim();
        const existing = await this.categoryRepository.findByName(trimmedName);
        
        if (existing) {
            throw new ConflictError('Categoria com este nome já existe');
        }

        return await this.categoryRepository.create({
            name: trimmedName,
            description: data.description?.trim() || null,
            isActive: true
        });
    }

    async getCategories(): Promise<Category[]> {
        return await this.categoryRepository.getAllCategories();
    }

    async getCategoryById(id: number): Promise<Category> {
        const validatedId = CategoryValidator.validateId(id);
        const category = await this.categoryRepository.findById(validatedId);
        
        if (!category) {
            throw new NotFoundError('Categoria não encontrada');
        }

        return category;
    }

    async updateCategoryById(id: number, categoryData: UpdateCategoryDTO): Promise<Category> {
        const validatedId = CategoryValidator.validateId(id);
        CategoryValidator.validateUpdate(categoryData);

        const category = await this.categoryRepository.findById(validatedId);
        if (!category) {
            throw new NotFoundError('Categoria não encontrada');
        }

        const updateData: Partial<Category> = {};

        if (categoryData.name !== undefined) {
            const trimmedName = categoryData.name.trim();
            
            if (trimmedName !== category.name) {
                const existingName = await this.categoryRepository.findByName(trimmedName);
                if (existingName) {
                    throw new ConflictError('Categoria com este nome já existe');
                }
            }
            
            updateData.name = trimmedName;
        }

        if (categoryData.description !== undefined) {
            updateData.description = categoryData.description.trim() || null;
        }

        if (categoryData.isActive !== undefined) {
            updateData.isActive = categoryData.isActive;
        }

        const updatedCategory = await this.categoryRepository.update(validatedId, updateData);

        if (!updatedCategory) {
            throw new NotFoundError('Erro ao atualizar categoria');
        }

        return updatedCategory;
    }

    async deleteCategory(id: number): Promise<void> {
        const validatedId = CategoryValidator.validateId(id);
        
        const category = await this.categoryRepository.findById(validatedId);
        if (!category) {
            throw new NotFoundError('Categoria não encontrada');
        }

        const deleted = await this.categoryRepository.delete(validatedId);
        if (!deleted) {
            throw new NotFoundError('Erro ao deletar categoria');
        }
    }
}