import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dto/CategoryDTO";
import { CategoryMapper } from "../mappers/CategoryMapper";
import { validateId } from "../schemas/categorySchema";

export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    async createCategory(req: Request, res: Response) {
        try {
            const categoryData: CreateCategoryDTO = req.body;
            const category = await this.categoryService.createCategory(categoryData);
            const response = CategoryMapper.toDTO(category);
            return res.status(201).json(response);
        } catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao cadastrar a categoria", error: error.message });
        }
    }

    async getCategories(req: Request, res: Response) {
        try {
            const queryParams = req.query;
            const result = await this.categoryService.getCategories(queryParams);
            const response = {
                data: CategoryMapper.toDTOArray(result.data),
                pagination: result.pagination
            };
            return res.status(200).json(response);
        } catch (error: any) {
            return res
            .status(error.statusCode || 500)
            .json({ message: "Erro ao buscar categorias", error: error.message });
        }
    }

    async getCategoryById(req: Request, res: Response) {
        try {
            const id = validateId(req.params.id);
            const category = await this.categoryService.getCategoryById(id);
            const response = CategoryMapper.toDTO(category);
            return res.status(200).json(response);
        } catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao buscar categoria", error: error.message });
        }
    }

    async updateCategory(req: Request, res: Response) {
        try {
            const id = validateId(req.params.id);
            const categoryData: UpdateCategoryDTO = req.body;
            const category = await this.categoryService.updateCategoryById(id, categoryData);
            const response = CategoryMapper.toDTO(category);
            return res.status(200).json(response);
        }  catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao atualizar categoria", error: error.message });
        }

    }

    async deleteCategory(req: Request, res: Response) {
        try {
            const id = validateId(req.params.id);
            await this.categoryService.deleteCategory(id);
            return res.status(204).send();
        } catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao deletar categoria", error: error.message });
        }
    }
}