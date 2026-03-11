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

import { ProductImageResponseDTO } from "./ProductImageDTO";

export interface ProductResponseDTO {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    categoryId: number;
    isActive: boolean;
    mainImage?: ProductImageResponseDTO | null;
    images?: ProductImageResponseDTO[];
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

