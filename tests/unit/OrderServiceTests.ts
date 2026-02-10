import { expect } from "chai";
import crypto from "crypto";
import { OrderService } from "../../src/services/OrderService";
import {
    NotFoundError,
    ValidationError,
    BadRequestError
} from "../../src/errors/AppError";
import { CreateOrderDTO } from "../../src/dto/OrderDTO";

describe("OrderService", () => {
    let orderRepositoryMock: any;
    let orderItemRepositoryMock: any;
    let userRepositoryMock: any;
    let addressRepositoryMock: any;
    let productRepositoryMock: any;
    let inventoryRepositoryMock: any;

    let orderService: OrderService;

    const userId = crypto.randomUUID();
    const orderId = 1;
    const addressId = crypto.randomUUID();

    const fakeUser = { id: userId };

    const fakeAddress = {
        id: addressId,
        userID: userId
    };

    const fakeProduct = {
        id: 1,
        name: "Notebook",
        price: 3000,
        isActive: true
    };

    const inactiveProduct = {
        ...fakeProduct,
        isActive: false
    };

    const fakeInventory = {
        productId: 1,
        quantity: 10
    };

    const fakeOrder = {
        id: orderId,
        userId,
        addressId,
        status: "PENDENTE",
        total: 6000
    };

    const createOrderPayload: CreateOrderDTO = {
        userId,
        addressId,
        items: [{ productId: 1, quantity: 2 }]
    };

    beforeEach(() => {
        orderRepositoryMock = {
            create: async () => fakeOrder,
            findById: async () => fakeOrder,
            update: async () => fakeOrder,
            delete: async () => true,
            getAllOrders: async () => ({
                data: [fakeOrder],
                pagination: { total: 1 }
            }),
            findByUserId: async () => ({
                data: [fakeOrder],
                pagination: { total: 1 }
            })
        };

        orderItemRepositoryMock = {
            create: async () => ({}),
            findByOrderId: async () => [
                { productId: 1, quantity: 2 }
            ],
            deleteByOrderId: async () => true
        };

        userRepositoryMock = {
            findByID: async () => fakeUser
        };

        addressRepositoryMock = {
            findByID: async () => fakeAddress
        };

        productRepositoryMock = {
            findById: async () => fakeProduct
        };

        inventoryRepositoryMock = {
            findByProductId: async () => fakeInventory,
            updateQuantity: async () => ({})
        };

        orderService = new OrderService(
            orderRepositoryMock,
            orderItemRepositoryMock,
            userRepositoryMock,
            addressRepositoryMock,
            productRepositoryMock,
            inventoryRepositoryMock
        );
    });

    it("CT-ORD-01 - deve criar pedido com produtos válidos", async () => {
        const order = await orderService.createOrder(createOrderPayload);
        expect(order).to.deep.equal(fakeOrder);
    });

    it("CT-ORD-02 - deve falhar ao criar pedido com usuário inexistente", async () => {
        userRepositoryMock.findByID = async () => null;

        try {
            await orderService.createOrder(createOrderPayload);
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
        }
    });

    it("CT-ORD-03 - deve falhar com endereço inexistente", async () => {
        addressRepositoryMock.findByID = async () => null;

        try {
            await orderService.createOrder(createOrderPayload);
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
        }
    });

    it("CT-ORD-04 - endereço não pertence ao usuário", async () => {
        addressRepositoryMock.findByID = async () => ({
            id: addressId,
            userID: crypto.randomUUID()
        });

        try {
            await orderService.createOrder(createOrderPayload);
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(ValidationError);
        }
    });

    it("CT-ORD-05 - produto não encontrado", async () => {
        productRepositoryMock.findById = async () => null;

        try {
            await orderService.createOrder(createOrderPayload);
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
        }
    });

    it("CT-ORD-06 - produto inativo", async () => {
        productRepositoryMock.findById = async () => inactiveProduct;

        try {
            await orderService.createOrder(createOrderPayload);
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(BadRequestError);
        }
    });

    it("CT-ORD-07 - estoque insuficiente", async () => {
        inventoryRepositoryMock.findByProductId = async () => ({
            ...fakeInventory,
            quantity: 1
        });

        try {
            await orderService.createOrder(createOrderPayload);
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(ValidationError);
        }
    });

    it("CT-ORD-08 - listar pedidos", async () => {
        const result = await orderService.getOrders();
        expect(result.data.length).to.equal(1);
    });

    it("CT-ORD-09 - nenhum pedido encontrado", async () => {
        orderRepositoryMock.getAllOrders = async () => ({
            data: [],
            pagination: { total: 0 }
        });

        try {
            await orderService.getOrders();
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
        }
    });

    it("CT-ORD-10 - buscar pedido por ID", async () => {
        const order = await orderService.getOrderById(orderId);
        expect(order).to.deep.equal(fakeOrder);
    });

    it("CT-ORD-11 - pedido não encontrado", async () => {
        orderRepositoryMock.findById = async () => null;

        try {
            await orderService.getOrderById(orderId);
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
        }
    });

    it("CT-ORD-12 - listar pedidos por usuário", async () => {
        const result = await orderService.getOrdersByUserId(userId);
        expect(result.data.length).to.equal(1);
    });

    it("CT-ORD-13 - usuário sem pedidos", async () => {
        orderRepositoryMock.findByUserId = async () => ({
            data: [],
            pagination: { total: 0 }
        });

        try {
            await orderService.getOrdersByUserId(userId);
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
        }
    });

    it("CT-ORD-14 - atualizar status do pedido", async () => {
        const updated = await orderService.updateOrder(orderId, {
            status: "CONFIRMADO"
        });
        expect(updated).to.exist;
    });

    it("CT-ORD-15 - cancelar pedido", async () => {
        const updated = await orderService.updateOrder(orderId, {
            status: "CANCELADO"
        });
        expect(updated.status).to.equal("PENDENTE");
    });

    it("CT-ORD-16 - transição de status inválida", async () => {
        orderRepositoryMock.findById = async () => ({
            ...fakeOrder,
            status: "ENTREGUE"
        });

        try {
            await orderService.updateOrder(orderId, { status: "CONFIRMADO" });
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(ValidationError);
        }
    });

    it("CT-ORD-17 - deletar pedido com sucesso", async () => {
        await orderService.deleteOrder(orderId);
    });

    it("CT-ORD-18 - bloquear exclusão de pedido enviado", async () => {
        orderRepositoryMock.findById = async () => ({
            ...fakeOrder,
            status: "ENVIADO"
        });

        try {
            await orderService.deleteOrder(orderId);
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(ValidationError);
        }
    });

    it("CT-ORD-19 - dados inválidos (Zod)", async () => {
        try {
            await orderService.createOrder({} as any);
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(ValidationError);
        }
    });

    it("CT-ORD-20 - atualizar endereço do pedido", async () => {
        const newAddressId = crypto.randomUUID();

        addressRepositoryMock.findByID = async () => ({
            id: newAddressId,
            userID: userId
        });

        const updated = await orderService.updateOrder(orderId, {
            addressId: newAddressId
        });

        expect(updated).to.exist;
    });

    it("CT-ORD-21 - endereço não pertence ao usuário do pedido", async () => {
        addressRepositoryMock.findByID = async () => ({
            id: crypto.randomUUID(),
            userID: crypto.randomUUID()
        });

        try {
            await orderService.updateOrder(orderId, {
                addressId: crypto.randomUUID()
            });
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(ValidationError);
        }
    });

    it("CT-ORD-22 - erro ao atualizar pedido", async () => {
        orderRepositoryMock.update = async () => null;

        try {
            await orderService.updateOrder(orderId, { status: "CONFIRMADO" });
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
        }
    });

    it("CT-ORD-23 - erro ao deletar pedido", async () => {
        orderRepositoryMock.delete = async () => false;

        try {
            await orderService.deleteOrder(orderId);
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
        }
    });

    it("CT-ORD-24 - usuário inexistente ao buscar pedidos", async () => {
        userRepositoryMock.findByID = async () => null;

        try {
            await orderService.getOrdersByUserId(userId);
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
        }
    });

    it("CT-ORD-25 - pedido inexistente ao atualizar", async () => {
        orderRepositoryMock.findById = async () => null;

        try {
            await orderService.updateOrder(orderId, { status: "CONFIRMADO" });
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
        }
    });

    it("CT-ORD-26 - pedido inexistente ao deletar", async () => {
        orderRepositoryMock.findById = async () => null;

        try {
            await orderService.deleteOrder(orderId);
            throw new Error();
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
        }
    });
});
