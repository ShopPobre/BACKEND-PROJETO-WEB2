import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import { ProductImageService } from "../services/ProductImageService";
import { CreateProductDTO, UpdateProductDTO } from "../dto/ProductDTO";
import { ProductMapper } from "../mappers/ProductMapper";
import { ProductImageMapper } from "../mappers/ProductImageMapper";
import { validateId } from "../schemas/productSchema";

export class ProductController {
    constructor(
        private productService: ProductService,
        private productImageService: ProductImageService
    ) {}

    async createProduct(req: Request, res: Response) {
        try {
            const productData: CreateProductDTO = req.body;
            const product = await this.productService.createProduct(productData);
            const response = ProductMapper.toDTO(product);
            return res.status(201).json(response);   
        } catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao cadastrar produto", error: error.message });
        }
    }

    async getProducts(req: Request, res: Response) {
        try {
            const queryParams = req.query;
            const result = await this.productService.getProducts(queryParams);
            const response = {
                data: ProductMapper.toDTOArray(result.data),
                pagination: result.pagination
            };
            return res.status(200).json(response);
        } catch (error: any) {
            return res
            .status(error.statusCode || 500)
            .json({ message: "Erro ao buscar produtos", error: error.message });
        }
        
    }

    async getProductById(req: Request, res: Response) {
        try {
            const id = validateId(req.params.id);
            const product = await this.productService.getProductById(id);
            const response = ProductMapper.toDTO(product);
            return res.status(200).json(response);
        } catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao buscar produto", error: error.message });
        }
    }

    async getProductsByCategory(req: Request, res: Response) {
        try {
            const categoryId = validateId(req.params.categoryId);
            const queryParams = req.query;
            const result = await this.productService.getProductsByCategory(categoryId, queryParams);
            const response = {
                data: ProductMapper.toDTOArray(result.data),
                pagination: result.pagination
            };
            return res.status(200).json(response);
        } catch (error: any) {
            return res
            .status(error.statusCode || 500)
            .json({ message: "Erro ao buscar produtos", error: error.message });
        }
    }

    async updateProduct(req: Request, res: Response) {
        try {
            const id = validateId(req.params.id);
            const productData: UpdateProductDTO = req.body;
            const product = await this.productService.updateProductById(id, productData);
            const response = ProductMapper.toDTO(product);
            return res.status(200).json(response);
        } catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao atualizar produto", error: error.message });
        }
    }

    async deleteProduct(req: Request, res: Response) {
        try {
            const id = validateId(req.params.id);
            await this.productService.deleteProduct(id);
            return res.status(204).send();
        } catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao deletar produto", error: error.message });
        }
    }

    async uploadProductImage(req: Request, res: Response) {
        try {
            const productId = validateId(req.params.id);
            await this.productService.getProductById(productId);
            const file = req.file;
            if (!file || !file.buffer) {
                return res.status(400).json({ message: "Nenhum arquivo enviado. Use o campo 'file'." });
            }
            const image = await this.productImageService.createFromBuffer(
                productId,
                file.buffer,
                file.originalname,
                file.mimetype
            );
            const response = ProductImageMapper.toDTO(image, productId);
            return res.status(201).json(response);
        } catch (error: any) {
            const status = error.statusCode || 500;
            return res.status(status).json({
                message: error.message || "Erro ao fazer upload da imagem",
                error: error.message,
            });
        }
    }

    async getProductImageFile(req: Request, res: Response) {
        try {
            const productId = validateId(req.params.id);
            const imageId = validateId(req.params.imageId);
            const { stream, mimeType } = await this.productImageService.getObjectStream(imageId, productId);
            res.setHeader("Content-Type", mimeType);
            stream.pipe(res);
        } catch (error: any) {
            const status = error.statusCode || 500;
            return res.status(status).json({
                message: error.message || "Erro ao obter imagem",
                error: error.message,
            });
        }
    }

    async deleteProductImage(req: Request, res: Response) {
        try {
            const productId = validateId(req.params.id);
            const imageId = validateId(req.params.imageId);
            await this.productImageService.deleteImage(imageId, productId);
            return res.status(204).send();
        } catch (error: any) {
            const status = error.statusCode || 500;
            return res.status(status).json({
                message: error.message || "Erro ao remover imagem",
                error: error.message,
            });
        }
    }
}

