import { Category, CategoryAttributes } from "../models/Category";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { QueryParams, PaginationResult, normalizePaginationParams, normalizeSortParams, createPaginationResponse } from "../types/pagination";
import { Op } from "sequelize";

export class CategoryRepository implements ICategoryRepository {
    private categoryModel = Category;
    private readonly allowedSortFields = ['name', 'createdAt', 'updatedAt'] as const;

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

    async getAllCategories(queryParams?: QueryParams): Promise<PaginationResult<Category>> {
        try {
            const { page, limit, offset } = normalizePaginationParams(queryParams || {});
            const { sortBy, sortOrder } = normalizeSortParams(queryParams || {}, this.allowedSortFields, 'name');

            // Construir filtros
            const where: any = {};

            // Filtro por nome (busca parcial)
            if (queryParams?.name) {
                where.name = { [Op.like]: `%${queryParams.name}%` };
            }

            // Filtro por status ativo
            if (queryParams?.isActive !== undefined) {
                where.isActive = queryParams.isActive === 'true' || queryParams.isActive === true;
            }

            // Contar total
            const total = await this.categoryModel.count({ where });

            // Buscar dados paginados
            const categories = await this.categoryModel.findAll({
                where,
                order: [[sortBy, sortOrder]],
                limit,
                offset,
            });

            return createPaginationResponse(categories, total, page, limit);
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