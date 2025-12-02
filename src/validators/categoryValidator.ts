import { CreateCategoryDTO, UpdateCategoryDTO } from "../dto/CategoryDTO";
import {
    createCategorySchema,
    updateCategorySchema,
    idParamSchema,
    validateWithZod,
    CreateCategoryInput,
    UpdateCategoryInput
} from "../schemas/categorySchema";

export class CategoryValidator {
    /**
     * Valida dados de criação de categoria usando Zod
     * @param data Dados a serem validados
     * @returns Dados validados e sanitizados (com trim aplicado)
     */
    static validateCreate(data: unknown): CreateCategoryInput {
        return validateWithZod(createCategorySchema, data);
    }

    /**
     * Valida dados de atualização de categoria usando Zod
     * @param data Dados a serem validados
     * @returns Dados validados e sanitizados (com trim aplicado)
     */
    static validateUpdate(data: unknown): UpdateCategoryInput {
        return validateWithZod(updateCategorySchema, data);
    }

    /**
     * Valida e converte ID de string para number
     * @param id ID a ser validado (pode ser string ou number)
     * @returns ID validado como number
     */
    static validateId(id: unknown): number {
        // Se já for number, valida diretamente
        if (typeof id === 'number') {
            if (isNaN(id) || id <= 0) {
                throw new Error('ID deve ser um número positivo válido');
            }
            return id;
        }

        // Se for string, usa o schema Zod
        return validateWithZod(idParamSchema, String(id));
    }
}

