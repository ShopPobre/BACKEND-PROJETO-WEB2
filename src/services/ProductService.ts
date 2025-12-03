import { Product } from "../models/Product";
import { IProductRepository } from "../interfaces/IProductRepository";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { CreateProductDTO, UpdateProductDTO } from "../dto/ProductDTO";
import { NotFoundError, ConflictError } from "../errors/AppError";
import {
    createProductSchema,
    updateProductSchema,
    validateWithZod,
    validateId
} from "../schemas/productSchema";

export class ProductService {
    constructor(
        private productRepository: IProductRepository,
        private categoryRepository: ICategoryRepository
    ) {}

    async createProduct(data: CreateProductDTO): Promise<Product> {
        // Zod já faz trim e validação
        const validatedData = validateWithZod(createProductSchema, data);

        // Verificar se a categoria existe
        const category = await this.categoryRepository.findById(validatedData.categoryId);
        if (!category) {
            throw new NotFoundError('Categoria não encontrada');
        }

        // Verificar se já existe produto com o mesmo nome
        const existing = await this.productRepository.findByName(validatedData.name);
        if (existing) {
            throw new ConflictError('Produto com este nome já existe');
        }

        return await this.productRepository.create({
            name: validatedData.name,
            description: validatedData.description || null,
            price: validatedData.price,
            categoryId: validatedData.categoryId,
            isActive: true
        });
    }

    async getProducts(): Promise<Product[]> {
        return await this.productRepository.getAllProducts();
    }

    async getProductById(id: number): Promise<Product> {
        const validatedId = validateId(id);
        const product = await this.productRepository.findById(validatedId);
        
        if (!product) {
            throw new NotFoundError('Produto não encontrado');
        }

        return product;
    }

    async getProductsByCategory(categoryId: number): Promise<Product[]> {
        const validatedCategoryId = validateId(categoryId);
        
        // Verificar se a categoria existe
        const category = await this.categoryRepository.findById(validatedCategoryId);
        if (!category) {
            throw new NotFoundError('Categoria não encontrada');
        }

        return await this.productRepository.findByCategoryId(validatedCategoryId);
    }

    async updateProductById(id: number, productData: UpdateProductDTO): Promise<Product> {
        const validatedId = validateId(id);
        // Zod já faz trim, validação e sanitização
        const validatedData = validateWithZod(updateProductSchema, productData);

        const product = await this.productRepository.findById(validatedId);
        if (!product) {
            throw new NotFoundError('Produto não encontrado');
        }

        const updateData: Partial<Product> = {};

        if (validatedData.name !== undefined) {
            // Verificar se o nome mudou antes de verificar duplicação
            if (validatedData.name !== product.name) {
                const existingName = await this.productRepository.findByName(validatedData.name);
                if (existingName) {
                    throw new ConflictError('Produto com este nome já existe');
                }
            }
            
            updateData.name = validatedData.name;
        }

        if (validatedData.description !== undefined) {
            // Zod já valida e sanitiza (trim + null handling)
            if (validatedData.description === null) {
                updateData.description = null;
            } else if (typeof validatedData.description === 'string') {
                updateData.description = validatedData.description || null;
            }
        }

        if (validatedData.price !== undefined) {
            updateData.price = validatedData.price;
        }

        if (validatedData.categoryId !== undefined) {
            // Verificar se a categoria existe
            const category = await this.categoryRepository.findById(validatedData.categoryId);
            if (!category) {
                throw new NotFoundError('Categoria não encontrada');
            }
            updateData.categoryId = validatedData.categoryId;
        }

        if (validatedData.isActive !== undefined) {
            updateData.isActive = validatedData.isActive;
        }

        const updatedProduct = await this.productRepository.update(validatedId, updateData);

        if (!updatedProduct) {
            throw new NotFoundError('Erro ao atualizar produto');
        }

        return updatedProduct;
    }

    async deleteProduct(id: number): Promise<void> {
        const validatedId = validateId(id);
        
        const product = await this.productRepository.findById(validatedId);
        if (!product) {
            throw new NotFoundError('Produto não encontrado');
        }

        const deleted = await this.productRepository.delete(validatedId);
        if (!deleted) {
            throw new NotFoundError('Erro ao deletar produto');
        }
    }
}

