export interface CreateOrderItemDTO {
    productId: number;
    quantity: number;
}

export interface UpdateOrderItemDTO {
    quantity?: number;
}

export interface OrderItemResponseDTO {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

