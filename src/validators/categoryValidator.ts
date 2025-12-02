import { CreateCategoryDTO, UpdateCategoryDTO } from "../dto/CategoryDTO";
import { ValidationError } from "../errors/AppError";

export class CategoryValidator {
    private static readonly MIN_NAME_LENGTH = 2;
    private static readonly MAX_NAME_LENGTH = 100;
    private static readonly MAX_DESCRIPTION_LENGTH = 500;

    static validateCreate(data: CreateCategoryDTO): void {
        if (!data.name || typeof data.name !== 'string') {
            throw new ValidationError('Nome da categoria é obrigatório');
        }

        const trimmedName = data.name.trim();
        
        if (trimmedName.length < this.MIN_NAME_LENGTH) {
            throw new ValidationError(`Nome deve ter pelo menos ${this.MIN_NAME_LENGTH} caracteres`);
        }

        if (trimmedName.length > this.MAX_NAME_LENGTH) {
            throw new ValidationError(`Nome deve ter no máximo ${this.MAX_NAME_LENGTH} caracteres`);
        }

        if (data.description && data.description.length > this.MAX_DESCRIPTION_LENGTH) {
            throw new ValidationError(`Descrição deve ter no máximo ${this.MAX_DESCRIPTION_LENGTH} caracteres`);
        }
    }

    static validateUpdate(data: UpdateCategoryDTO): void {
        if (data.name !== undefined) {
            if (typeof data.name !== 'string' || !data.name.trim()) {
                throw new ValidationError('Nome da categoria deve ser uma string não vazia');
            }

            const trimmedName = data.name.trim();
            
            if (trimmedName.length < this.MIN_NAME_LENGTH) {
                throw new ValidationError(`Nome deve ter pelo menos ${this.MIN_NAME_LENGTH} caracteres`);
            }

            if (trimmedName.length > this.MAX_NAME_LENGTH) {
                throw new ValidationError(`Nome deve ter no máximo ${this.MAX_NAME_LENGTH} caracteres`);
            }
        }

        if (data.description !== undefined && data.description.length > this.MAX_DESCRIPTION_LENGTH) {
            throw new ValidationError(`Descrição deve ter no máximo ${this.MAX_DESCRIPTION_LENGTH} caracteres`);
        }

        if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
            throw new ValidationError('isActive deve ser um valor booleano');
        }
    }

    static validateId(id: any): number {
        const parsedId = parseInt(id, 10);
        
        if (isNaN(parsedId) || parsedId <= 0) {
            throw new ValidationError('ID deve ser um número positivo válido');
        }

        return parsedId;
    }
}

