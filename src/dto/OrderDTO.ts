import { OrderStatus } from "../models/Order";
import { CreateOrderItemDTO } from "./OrderItemDTO";
import { UserResponseDTO } from "./UserDTO";
import { AddressResponseDTO } from "./AddressDTO";
import { ProductResponseDTO } from "./ProductDTO";

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

export interface OrderItemDetailDTO {
    id: number;
    product: ProductResponseDTO;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface OrderDetailResponseDTO {
    id: number;
    user: UserResponseDTO;
    address: AddressResponseDTO;
    items: OrderItemDetailDTO[];
    status: OrderStatus;
    total: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

