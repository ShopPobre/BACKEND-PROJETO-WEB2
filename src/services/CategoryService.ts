import { Category } from "../models/Category";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dto/CategoryDTO";
import { NotFoundError, ConflictError } from "../errors/AppError";
import {
    createCategorySchema,
    updateCategorySchema,
    validateWithZod,
    validateId
} from "../schemas/categorySchema";

export class CategoryService {
    constructor(private categoryRepository: ICategoryRepository) {}

    async createCategory(data: CreateCategoryDTO): Promise<Category> {
        // Zod já faz trim e validação
        const validatedData = validateWithZod(createCategorySchema, data);

        const existing = await this.categoryRepository.findByName(validatedData.name);
        
        if (existing) {
            throw new ConflictError('Categoria com este nome já existe');
        }

        return await this.categoryRepository.create({
            name: validatedData.name,
            description: validatedData.description || null,
            isActive: true
        });
    }

    async getCategories(): Promise<Category[]> {
        return await this.categoryRepository.getAllCategories();
    }

    async getCategoryById(id: number): Promise<Category> {
        const validatedId = validateId(id);
        const category = await this.categoryRepository.findById(validatedId);
        
        if (!category) {
            throw new NotFoundError('Categoria não encontrada');
        }

        return category;
    }

    async updateCategoryById(id: number, categoryData: UpdateCategoryDTO): Promise<Category> {
        const validatedId = validateId(id);
        // Zod já faz trim, validação e sanitização
        const validatedData = validateWithZod(updateCategorySchema, categoryData);

        const category = await this.categoryRepository.findById(validatedId);
        if (!category) {
            throw new NotFoundError('Categoria não encontrada');
        }

        const updateData: Partial<Category> = {};

        if (validatedData.name !== undefined) {
            // Verificar se o nome mudou antes de verificar duplicação
            if (validatedData.name !== category.name) {
                const existingName = await this.categoryRepository.findByName(validatedData.name);
                if (existingName) {
                    throw new ConflictError('Categoria com este nome já existe');
                }
            }
            
            updateData.name = validatedData.name;
        }

        if (validatedData.description !== undefined) {
            // Zod já valida e sanitiza (trim + null handling)
            // Se for string vazia após trim, converte para null
            if (validatedData.description === null) {
                updateData.description = null;
            } else if (typeof validatedData.description === 'string') {
                updateData.description = validatedData.description || null;
            }
        }

        if (validatedData.isActive !== undefined) {
            updateData.isActive = validatedData.isActive;
        }

        const updatedCategory = await this.categoryRepository.update(validatedId, updateData);

        if (!updatedCategory) {
            throw new NotFoundError('Erro ao atualizar categoria');
        }

        return updatedCategory;
    }

    async deleteCategory(id: number): Promise<void> {
        const validatedId = validateId(id);
        
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