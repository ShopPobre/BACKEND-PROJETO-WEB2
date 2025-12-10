import { OrderStatus } from "../models/Order";
import { CreateOrderItemDTO } from "./OrderItemDTO";

export interface CreateOrderDTO {
    userId: string;
    addressId: string;
    items: CreateOrderItemDTO[];
}

export interface UpdateOrderDTO {
    status?: OrderStatus;
    addressId?: string;
}

export interface OrderResponseDTO {
    id: number;
    userId: string;
    addressId: string;
    status: OrderStatus;
    total: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

