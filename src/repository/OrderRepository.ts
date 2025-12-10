import { Order, OrderAttributes } from "../models/Order";
import { IOrderRepository } from "../interfaces/IOrderRepository";

export class OrderRepository implements IOrderRepository {
    private orderModel = Order;    

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

    async findByUserId(userId: string): Promise<Order[]> {
        try {
            return await this.orderModel.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']]
            });
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

