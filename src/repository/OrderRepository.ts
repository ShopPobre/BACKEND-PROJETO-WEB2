import { Order, OrderAttributes } from "../models/Order";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { QueryParams, PaginationResult, normalizePaginationParams, normalizeSortParams, createPaginationResponse } from "../types/pagination";
import { Op } from "sequelize";

export class OrderRepository implements IOrderRepository {
    private orderModel = Order;
    private readonly allowedSortFields = ['createdAt', 'updatedAt', 'total', 'status'] as const;

    async create(orderData: Omit<OrderAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
        try {
            return await this.orderModel.create(orderData);
        } catch (error: any) {
            throw error;
        }
    }

    async findById(id: number): Promise<Order | null> {
        try {
            return await this.orderModel.findByPk(id);
        } catch (error: any) {
            throw error;
        }
    }

    async findByUserId(userId: string, queryParams?: QueryParams): Promise<PaginationResult<Order>> {
        try {
            const { page, limit, offset } = normalizePaginationParams(queryParams || {});
            const { sortBy, sortOrder } = normalizeSortParams(queryParams || {}, this.allowedSortFields, 'createdAt', 'DESC');

            // Construir filtros
            const where: any = { userId };

            // Filtro por status
            if (queryParams?.status) {
                where.status = queryParams.status;
            }

            // Filtro por valor mínimo
            if (queryParams?.minTotal) {
                where.total = { ...where.total, [Op.gte]: Number(queryParams.minTotal) };
            }

            // Filtro por valor máximo
            if (queryParams?.maxTotal) {
                where.total = { ...where.total, [Op.lte]: Number(queryParams.maxTotal) };
            }

            // Contar total
            const total = await this.orderModel.count({ where });

            // Buscar dados paginados
            const orders = await this.orderModel.findAll({
                where,
                order: [[sortBy, sortOrder]],
                limit,
                offset,
            });

            return createPaginationResponse(orders, total, page, limit);
        } catch (error: any) {
            throw error;
        }
    }

    async getAllOrders(queryParams?: QueryParams): Promise<PaginationResult<Order>> {
        try {
            const { page, limit, offset } = normalizePaginationParams(queryParams || {});
            const { sortBy, sortOrder } = normalizeSortParams(queryParams || {}, this.allowedSortFields, 'createdAt', 'DESC');

            // Construir filtros
            const where: any = {};

            // Filtro por usuário
            if (queryParams?.userId) {
                where.userId = queryParams.userId;
            }

            // Filtro por status
            if (queryParams?.status) {
                where.status = queryParams.status;
            }

            // Filtro por valor mínimo
            if (queryParams?.minTotal) {
                where.total = { ...where.total, [Op.gte]: Number(queryParams.minTotal) };
            }

            // Filtro por valor máximo
            if (queryParams?.maxTotal) {
                where.total = { ...where.total, [Op.lte]: Number(queryParams.maxTotal) };
            }

            // Contar total
            const total = await this.orderModel.count({ where });

            // Buscar dados paginados
            const orders = await this.orderModel.findAll({
                where,
                order: [[sortBy, sortOrder]],
                limit,
                offset,
            });

            return createPaginationResponse(orders, total, page, limit);
        } catch (error: any) {
            throw error;
        }
    }

    async update(id: number, orderData: Partial<OrderAttributes>): Promise<Order | null> {
        try {
            const order = await this.findById(id);

            if (!order) {
                return null;
            }

            await order.update(orderData);
            return await order.reload();
        } catch (error: any) {
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const deletedRows = await this.orderModel.destroy({
                where: { id }
            });

            return deletedRows > 0;
        } catch (error: any) {
            throw error;
        }
    }
}

