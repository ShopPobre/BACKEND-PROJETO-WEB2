import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dto/CategoryDTO";
import { CategoryMapper } from "../mappers/CategoryMapper";

export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    async createCategory(req: Request, res: Response): Promise<void> {
        const categoryData: CreateCategoryDTO = req.body;
        const category = await this.categoryService.createCategory(categoryData);
        const response = CategoryMapper.toDTO(category);
        res.status(201).json(response);
    }

    async getCategories(req: Request, res: Response): Promise<void> {
        const categories = await this.categoryService.getCategories();
        const response = CategoryMapper.toDTOArray(categories);
        res.status(200).json(response);
    }

    async getCategoryById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const category = await this.categoryService.getCategoryById(id);
        const response = CategoryMapper.toDTO(category);
        res.status(200).json(response);
    }

    async updateCategory(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const categoryData: UpdateCategoryDTO = req.body;
        const category = await this.categoryService.updateCategoryById(id, categoryData);
        const response = CategoryMapper.toDTO(category);
        res.status(200).json(response);
    }

    async deleteCategory(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.categoryService.deleteCategory(id);
        res.status(204).send();
    }
}