import { Request, Response } from "express";
import { OrderService } from "../services/OrderService";
import { CreateOrderDTO, UpdateOrderDTO } from "../dto/OrderDTO";
import { OrderMapper } from "../mappers/OrderMapper";
import { validateId } from "../schemas/orderSchema";
import { validateID } from "../schemas/userSchema";

export class OrderController {
    constructor(private orderService: OrderService) {}

    async createOrder(req: Request, res: Response) {
        try {
            const orderData: CreateOrderDTO = req.body;
            const order = await this.orderService.createOrder(orderData);
            const response = OrderMapper.toDTO(order);
            return res.status(201).json(response);   
        } catch (error: any) {
            return res
            .status(error.statusCode || 500)
            .json({ message: "Erro ao criar pedido", error: error.message });
        }
    }

    async getOrders(req: Request, res: Response) {
        try {
            const orders = await this.orderService.getOrders();
            const response = OrderMapper.toDTOArray(orders);
            return res.status(200).json(response);
        } catch (error: any) {
            return res
            .status(error.statusCode || 500)
            .json({ message: "Erro ao buscar pedidos", error: error.message });
        }
    }

    async getOrderById(req: Request, res: Response) {
        try {
            const id = validateId(req.params.id);
            const order = await this.orderService.getOrderById(id);
            const response = OrderMapper.toDTO(order);
            return res.status(200).json(response);
        } catch (error: any) {
            return res
            .status(error.statusCode || 500)
            .json({ message: "Erro ao buscar pedido", error: error.message });
        }
    }

    async getOrdersByUserId(req: Request, res: Response) {
        try {
            const userId = validateID(req.params.userId);
            const orders = await this.orderService.getOrdersByUserId(userId);
            const response = OrderMapper.toDTOArray(orders);
            return res.status(200).json(response);
        } catch (error: any) {
            return res
            .status(error.statusCode || 500)
            .json({ message: "Erro ao buscar pedidos", error: error.message });
        }
    }

    async updateOrder(req: Request, res: Response) {
        try {
            const id = validateId(req.params.id);
            const orderData: UpdateOrderDTO = req.body;
            const order = await this.orderService.updateOrder(id, orderData);
            const response = OrderMapper.toDTO(order);
            return res.status(200).json(response);
        } catch (error: any) {
            return res
            .status(error.statusCode || 500)
            .json({ message: "Erro ao atualizar pedido", error: error.message });
        }
    }

    async deleteOrder(req: Request, res: Response) {
        try {
            const id = validateId(req.params.id);
            await this.orderService.deleteOrder(id);
            return res.status(204).send();
        } catch (error: any) {
            return res
            .status(error.statusCode || 500)
            .json({ message: "Erro ao deletar pedido", error: error.message });
        }
    }
}

