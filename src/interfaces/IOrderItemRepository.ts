import { OrderItem, OrderItemAttributes } from "../models/OrderItem";

export interface IOrderItemRepository {
    create(orderItemData: Omit<OrderItemAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrderItem>;
    findById(id: number): Promise<OrderItem | null>;
    findByOrderId(orderId: number): Promise<OrderItem[]>;
    update(id: number, orderItemData: Partial<OrderItemAttributes>): Promise<OrderItem | null>;
    delete(id: number): Promise<boolean>;
    deleteByOrderId(orderId: number): Promise<boolean>;
}

