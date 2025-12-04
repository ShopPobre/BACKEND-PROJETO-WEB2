export interface CreateProductDTO {
    name: string;
    description?: string;
    price: number;
    categoryId: number;
}

export interface UpdateProductDTO {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: number;
    isActive?: boolean;
}

export interface ProductResponseDTO {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    categoryId: number;
    isActive: boolean;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

