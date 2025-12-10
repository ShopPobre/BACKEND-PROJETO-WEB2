import { OrderItem } from "../models/OrderItem";
import { OrderItemResponseDTO } from "../dto/OrderItemDTO";

export class OrderItemMapper {
    static toDTO(orderItem: OrderItem): OrderItemResponseDTO {
        return {
            id: orderItem.id,
            orderId: orderItem.orderId,
            productId: orderItem.productId,
            quantity: orderItem.quantity,
            unitPrice: orderItem.unitPrice,
            subtotal: orderItem.subtotal,
            createdAt: orderItem.createdAt,
            updatedAt: orderItem.updatedAt
        };
    }

    static toDTOArray(orderItems: OrderItem[]): OrderItemResponseDTO[] {
        return orderItems.map(orderItem => this.toDTO(orderItem));
    }
}

