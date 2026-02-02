import { Product, ProductAttributes } from "../models/Product";
import { IProductRepository } from "../interfaces/IProductRepository";
import { QueryParams, PaginationResult, normalizePaginationParams, normalizeSortParams, createPaginationResponse } from "../types/pagination";
import { Op } from "sequelize";

export class ProductRepository implements IProductRepository {
    private productModel = Product;
    private readonly allowedSortFields = ['name', 'price', 'createdAt', 'updatedAt'] as const;

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

    async findByCategoryId(categoryId: number, queryParams?: QueryParams): Promise<PaginationResult<Product>> {
        try {
            const { page, limit, offset } = normalizePaginationParams(queryParams || {});
            const { sortBy, sortOrder } = normalizeSortParams(queryParams || {}, this.allowedSortFields, 'name');

            // Construir filtros
            const where: any = { categoryId };

            // Filtro por nome (busca parcial)
            if (queryParams?.name) {
                where.name = { [Op.like]: `%${queryParams.name}%` };
            }

            // Filtro por preço mínimo
            if (queryParams?.minPrice) {
                where.price = { ...where.price, [Op.gte]: Number(queryParams.minPrice) };
            }

            // Filtro por preço máximo
            if (queryParams?.maxPrice) {
                where.price = { ...where.price, [Op.lte]: Number(queryParams.maxPrice) };
            }

            // Filtro por status ativo
            if (queryParams?.isActive !== undefined) {
                where.isActive = queryParams.isActive === 'true' || queryParams.isActive === true;
            }

            // Contar total
            const total = await this.productModel.count({ where });

            // Buscar dados paginados
            const products = await this.productModel.findAll({
                where,
                order: [[sortBy, sortOrder]],
                limit,
                offset,
            });

            return createPaginationResponse(products, total, page, limit);
        } catch (error: any) {
            throw error;
        }
    }

    async getAllProducts(queryParams?: QueryParams): Promise<PaginationResult<Product>> {
        try {
            const { page, limit, offset } = normalizePaginationParams(queryParams || {});
            const { sortBy, sortOrder } = normalizeSortParams(queryParams || {}, this.allowedSortFields, 'name');

            // Construir filtros
            const where: any = {};

            // Filtro por nome (busca parcial)
            if (queryParams?.name) {
                where.name = { [Op.like]: `%${queryParams.name}%` };
            }

            // Filtro por categoria
            if (queryParams?.categoryId) {
                where.categoryId = Number(queryParams.categoryId);
            }

            // Filtro por preço mínimo
            if (queryParams?.minPrice) {
                where.price = { ...where.price, [Op.gte]: Number(queryParams.minPrice) };
            }

            // Filtro por preço máximo
            if (queryParams?.maxPrice) {
                where.price = { ...where.price, [Op.lte]: Number(queryParams.maxPrice) };
            }

            // Filtro por status ativo
            if (queryParams?.isActive !== undefined) {
                where.isActive = queryParams.isActive === 'true' || queryParams.isActive === true;
            }

            // Contar total
            const total = await this.productModel.count({ where });

            // Buscar dados paginados
            const products = await this.productModel.findAll({
                where,
                order: [[sortBy, sortOrder]],
                limit,
                offset,
            });

            return createPaginationResponse(products, total, page, limit);
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

