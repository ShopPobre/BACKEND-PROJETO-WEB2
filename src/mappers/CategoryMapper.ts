import { Category } from "../models/Category";
import { CategoryResponseDTO } from "../dto/CategoryDTO";

export class CategoryMapper {
    static toDTO(category: Category): CategoryResponseDTO {
        return {
            id: category.id,
            name: category.name,
            description: category.description,
            isActive: category.isActive,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        };
    }

    static toDTOArray(categories: Category[]): CategoryResponseDTO[] {
        return categories.map(category => this.toDTO(category));
    }
}

