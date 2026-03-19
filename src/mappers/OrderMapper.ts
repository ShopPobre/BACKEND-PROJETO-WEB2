import { Order } from "../models/Order";
import { OrderResponseDTO } from "../dto/OrderDTO";

export class OrderMapper {
    static toDTO(order: Order): OrderResponseDTO {
        return {
            id: order.id,
            userId: order.userId,
            addressId: order.addressId,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        };
    }

    static toDTOArray(orders: Order[]): OrderResponseDTO[] {
        return orders.map(order => this.toDTO(order));
    }
}

