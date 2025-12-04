export interface CreateCategoryDTO {
    name: string;
    description?: string;
}

export interface UpdateCategoryDTO {
    name?: string;
    description?: string;
    isActive?: boolean;
}

export interface CategoryResponseDTO {
    id: number;
    name: string;
    description?: string | null;
    isActive: boolean;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

