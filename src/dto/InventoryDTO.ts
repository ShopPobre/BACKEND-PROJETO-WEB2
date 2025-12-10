export interface InventoryResponseDTO {
    id: number;
    productId: number;
    quantity: number;
    minQuantity: number;
    maxQuantity?: number | null;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface InvetoryUpdateDTO {
    quantity: number
}