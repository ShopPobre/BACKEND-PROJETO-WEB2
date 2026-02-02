import { Order, OrderAttributes } from "../models/Order";
import { PaginationResult, QueryParams } from "../types/pagination";

export interface IOrderRepository {
    create(orderData: Omit<OrderAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
    findById(id: number): Promise<Order | null>;
    findByUserId(userId: string, queryParams?: QueryParams): Promise<PaginationResult<Order>>;
    getAllOrders(queryParams?: QueryParams): Promise<PaginationResult<Order>>;
    update(id: number, orderData: Partial<OrderAttributes>): Promise<Order | null>;
    delete(id: number): Promise<boolean>;
}

