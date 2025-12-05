import { Order, OrderAttributes } from "../models/Order";

export interface IOrderRepository {
    create(orderData: Omit<OrderAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
    findById(id: number): Promise<Order | null>;
    findByUserId(userId: string): Promise<Order[]>;
    update(id: number, orderData: Partial<OrderAttributes>): Promise<Order | null>;
    delete(id: number): Promise<boolean>;
}

