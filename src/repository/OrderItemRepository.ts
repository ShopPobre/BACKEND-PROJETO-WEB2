import { OrderItem, OrderItemAttributes } from "../models/OrderItem";
import { IOrderItemRepository } from "../interfaces/IOrderItemRepository";

export class OrderItemRepository implements IOrderItemRepository {
    private orderItemModel = OrderItem;    

    async create(orderItemData: Omit<OrderItemAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrderItem> {
        try {
            return await this.orderItemModel.create(orderItemData);
        } catch (error: any) {
            throw error;
        }
    }

    async findById(id: number): Promise<OrderItem | null> {
        try {
            return await this.orderItemModel.findByPk(id);
        } catch (error: any) {
            throw error;
        }
    }

    async findByOrderId(orderId: number): Promise<OrderItem[]> {
        try {
            return await this.orderItemModel.findAll({
                where: { orderId },
                order: [['id', 'ASC']]
            });
        } catch (error: any) {
            throw error;
        }
    }

    async update(id: number, orderItemData: Partial<OrderItemAttributes>): Promise<OrderItem | null> {
        try {
            const orderItem = await this.findById(id);

            if (!orderItem) {
                return null;
            }

            await orderItem.update(orderItemData);
            return await orderItem.reload();
        } catch (error: any) {
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const deletedRows = await this.orderItemModel.destroy({
                where: { id }
            });

            return deletedRows > 0;
        } catch (error: any) {
            throw error;
        }
    }

    async deleteByOrderId(orderId: number): Promise<boolean> {
        try {
            const deletedRows = await this.orderItemModel.destroy({
                where: { orderId }
            });

            return deletedRows > 0;
        } catch (error: any) {
            throw error;
        }
    }
}

