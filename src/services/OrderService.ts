import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { IOrderItemRepository } from "../interfaces/IOrderItemRepository";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IAddressRepository } from "../interfaces/IAddressRepository";
import { IProductRepository } from "../interfaces/IProductRepository";
import { IInventoryRepository } from "../interfaces/IInventoryRepository";
import { CreateOrderDTO, UpdateOrderDTO } from "../dto/OrderDTO";
import { NotFoundError, ValidationError, BadRequestError } from "../errors/AppError";
import {
    createOrderSchema,
    updateOrderSchema,
    validateWithZod,
    validateId
} from "../schemas/orderSchema";
import { validateID } from "../schemas/userSchema";
import { Product } from "../models/Product";
import { Inventory } from "../models/Inventory";
import sequelize from "../config/database";

export class OrderService {
    constructor(
        private orderRepository: IOrderRepository,
        private orderItemRepository: IOrderItemRepository,
        private userRepository: IUserRepository,
        private addressRepository: IAddressRepository,
        private productRepository: IProductRepository,
        private inventoryRepository: IInventoryRepository
    ) {}

    async createOrder(data: CreateOrderDTO): Promise<Order> {
        // Validar dados com Zod
        const validatedData = validateWithZod(createOrderSchema, data);

        // Verificar se o usuário existe
        const user = await this.userRepository.findByID(validatedData.userId);
        if (!user) {
            throw new NotFoundError('Usuário não encontrado');
        }

        // Verificar se o endereço existe e pertence ao usuário
        const address = await this.addressRepository.findByID(validatedData.addressId);
        if (!address) {
            throw new NotFoundError('Endereço não encontrado');
        }
        if (address.userID !== validatedData.userId) {
            throw new ValidationError('Endereço não pertence ao usuário informado');
        }

        // Validar produtos e estoque
        const products: Product[] = [];
        const inventories: Inventory[] = [];
        let total = 0;

        for (const item of validatedData.items) {
            // Verificar se o produto existe e está ativo
            const product = await this.productRepository.findById(item.productId);
            if (!product) {
                throw new NotFoundError(`Produto com ID ${item.productId} não encontrado`);
            }
            if (!product.isActive) {
                throw new BadRequestError(`Produto com ID ${item.productId} está inativo`);
            }

            // Verificar estoque
            const inventory = await this.inventoryRepository.findByProductId(item.productId);
            if (!inventory) {
                throw new NotFoundError(`Estoque do produto com ID ${item.productId} não encontrado`);
            }
            if (inventory.quantity < item.quantity) {
                throw new ValidationError(`Estoque insuficiente para o produto ${product.name}. Disponível: ${inventory.quantity}, Solicitado: ${item.quantity}`);
            }

            products.push(product);
            inventories.push(inventory);

            // Calcular subtotal
            const subtotal = Number(product.price) * item.quantity;
            total += subtotal;
        }

        // Criar pedido e itens em transação
        const transaction = await sequelize.transaction();

        try {
            // Criar pedido
            const order = await this.orderRepository.create({
                userId: validatedData.userId,
                addressId: validatedData.addressId,
                status: 'PENDENTE',
                total: total
            });

            // Criar itens e atualizar estoque
            for (let i = 0; i < validatedData.items.length; i++) {
                const item = validatedData.items[i];
                const product = products[i];
                const inventory = inventories[i];

                // Criar item do pedido
                await this.orderItemRepository.create({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: Number(product.price),
                    subtotal: Number(product.price) * item.quantity
                });

                // Atualizar estoque (decrementar)
                const newQuantity = inventory.quantity - item.quantity;
                await this.inventoryRepository.updateQuantity(item.productId, newQuantity);
            }

            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getOrders(queryParams?: any) {
        const result = await this.orderRepository.getAllOrders(queryParams);
        if(result.data.length === 0 && result.pagination.total === 0) {
            throw new NotFoundError('Nenhum pedido encontrado');
        }
        return result;
    }

    async getOrderById(id: number): Promise<Order> {
        const validatedId = validateId(id);
        const order = await this.orderRepository.findById(validatedId);
        
        if (!order) {
            throw new NotFoundError('Pedido não encontrado');
        }

        return order;
    }

    async getOrdersByUserId(userId: string, queryParams?: any) {
        const validatedUserId = validateID(userId);
        
        // Verificar se o usuário existe
        const user = await this.userRepository.findByID(validatedUserId);
        if (!user) {
            throw new NotFoundError('Usuário não encontrado');
        }

        const result = await this.orderRepository.findByUserId(validatedUserId, queryParams);
        if (result.data.length === 0 && result.pagination.total === 0) {
            throw new NotFoundError('Nenhum pedido encontrado para este usuário');
        }

        return result;
    }

    async updateOrder(id: number, orderData: UpdateOrderDTO): Promise<Order> {
        const validatedId = validateId(id);
        const validatedData = validateWithZod(updateOrderSchema, orderData);

        const order = await this.orderRepository.findById(validatedId);
        if (!order) {
            throw new NotFoundError('Pedido não encontrado');
        }

        const updateData: Partial<Order> = {};

        // Se mudando status para CANCELADO, devolver estoque
        if (validatedData.status === 'CANCELADO' && order.status !== 'CANCELADO') {
            const transaction = await sequelize.transaction();
            try {
                // Buscar itens do pedido
                const orderItems = await this.orderItemRepository.findByOrderId(order.id);
                
                // Devolver estoque para cada item
                for (const item of orderItems) {
                    const inventory = await this.inventoryRepository.findByProductId(item.productId);
                    if (inventory) {
                        const newQuantity = inventory.quantity + item.quantity;
                        await this.inventoryRepository.updateQuantity(item.productId, newQuantity);
                    }
                }

                updateData.status = 'CANCELADO';
                const updatedOrder = await this.orderRepository.update(validatedId, updateData);
                
                await transaction.commit();
                return updatedOrder!;
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        }

        if (validatedData.status !== undefined) {
            // Validar transição de status
            const validTransitions: Record<string, string[]> = {
                'PENDENTE': ['CONFIRMADO', 'CANCELADO'],
                'CONFIRMADO': ['EM_PREPARACAO', 'CANCELADO'],
                'EM_PREPARACAO': ['ENVIADO', 'CANCELADO'],
                'ENVIADO': ['ENTREGUE', 'CANCELADO'],
                'ENTREGUE': [],
                'CANCELADO': []
            };

            const allowedStatuses = validTransitions[order.status] || [];
            if (!allowedStatuses.includes(validatedData.status)) {
                throw new ValidationError(`Não é possível alterar o status de ${order.status} para ${validatedData.status}`);
            }

            updateData.status = validatedData.status;
        }

        if (validatedData.addressId !== undefined) {
            // Verificar se o endereço existe e pertence ao usuário
            const address = await this.addressRepository.findByID(validatedData.addressId);
            if (!address) {
                throw new NotFoundError('Endereço não encontrado');
            }
            if (address.userID !== order.userId) {
                throw new ValidationError('Endereço não pertence ao usuário do pedido');
            }
            updateData.addressId = validatedData.addressId;
        }

        const updatedOrder = await this.orderRepository.update(validatedId, updateData);

        if (!updatedOrder) {
            throw new NotFoundError('Erro ao atualizar pedido');
        }

        return updatedOrder;
    }

    async deleteOrder(id: number): Promise<void> {
        const validatedId = validateId(id);
        
        const order = await this.orderRepository.findById(validatedId);
        if (!order) {
            throw new NotFoundError('Pedido não encontrado');
        }

        // Não permitir deletar pedidos que já foram enviados ou entregues
        if (order.status === 'ENVIADO' || order.status === 'ENTREGUE') {
            throw new ValidationError('Não é possível deletar pedidos que foram enviados ou entregues');
        }

        // Se o pedido não foi cancelado, devolver estoque
        if (order.status !== 'CANCELADO') {
            const transaction = await sequelize.transaction();
            try {
                const orderItems = await this.orderItemRepository.findByOrderId(order.id);
                
                for (const item of orderItems) {
                    const inventory = await this.inventoryRepository.findByProductId(item.productId);
                    if (inventory) {
                        const newQuantity = inventory.quantity + item.quantity;
                        await this.inventoryRepository.updateQuantity(item.productId, newQuantity);
                    }
                }

                // Deletar itens do pedido
                await this.orderItemRepository.deleteByOrderId(order.id);
                
                // Deletar pedido
                const deleted = await this.orderRepository.delete(validatedId);
                if (!deleted) {
                    throw new NotFoundError('Erro ao deletar pedido');
                }

                await transaction.commit();
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        } else {
            // Se já estava cancelado, apenas deletar
            await this.orderItemRepository.deleteByOrderId(order.id);
            const deleted = await this.orderRepository.delete(validatedId);
            if (!deleted) {
                throw new NotFoundError('Erro ao deletar pedido');
            }
        }
    }
}

