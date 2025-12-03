import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import { CreateProductDTO, UpdateProductDTO } from "../dto/ProductDTO";
import { ProductMapper } from "../mappers/ProductMapper";
import { validateId } from "../schemas/productSchema";

export class ProductController {
    constructor(private productService: ProductService) {}

    async createProduct(req: Request, res: Response): Promise<void> {
        const productData: CreateProductDTO = req.body;
        const product = await this.productService.createProduct(productData);
        const response = ProductMapper.toDTO(product);
        res.status(201).json(response);
    }

    async getProducts(req: Request, res: Response): Promise<void> {
        const products = await this.productService.getProducts();
        const response = ProductMapper.toDTOArray(products);
        res.status(200).json(response);
    }

    async getProductById(req: Request, res: Response): Promise<void> {
        const id = validateId(req.params.id);
        const product = await this.productService.getProductById(id);
        const response = ProductMapper.toDTO(product);
        res.status(200).json(response);
    }

    async getProductsByCategory(req: Request, res: Response): Promise<void> {
        const categoryId = validateId(req.params.categoryId);
        const products = await this.productService.getProductsByCategory(categoryId);
        const response = ProductMapper.toDTOArray(products);
        res.status(200).json(response);
    }

    async updateProduct(req: Request, res: Response): Promise<void> {
        const id = validateId(req.params.id);
        const productData: UpdateProductDTO = req.body;
        const product = await this.productService.updateProductById(id, productData);
        const response = ProductMapper.toDTO(product);
        res.status(200).json(response);
    }

    async deleteProduct(req: Request, res: Response): Promise<void> {
        const id = validateId(req.params.id);
        await this.productService.deleteProduct(id);
        res.status(204).send();
    }
}

