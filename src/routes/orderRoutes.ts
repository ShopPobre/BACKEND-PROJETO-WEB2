import { Router, Request, Response, NextFunction } from "express";
import { OrderController } from "../controllers/OrderController";
import { OrderService } from "../services/OrderService";
import { OrderRepository } from "../repository/OrderRepository";
import { OrderItemRepository } from "../repository/OrderItemRepository";
import { UserRepository } from "../repository/UserRepository";
import { AddressRepository } from "../repository/AddressRepository";
import { ProductRepository } from "../repository/ProductRepository";
import { InventoryRepository } from "../repository/InventoryRepository";
import { asyncHandler } from "../middleware/errorHandler";
import { ensureAuthenticated } from "../middleware/authMiddleware";
import { ensureRole } from "../middleware/ensureRole";

const router = Router();

// Dependency Injection
const orderRepository = new OrderRepository();
const orderItemRepository = new OrderItemRepository();
const userRepository = new UserRepository();
const addressRepository = new AddressRepository();
const productRepository = new ProductRepository();
const inventoryRepository = new InventoryRepository();
const orderService = new OrderService(
    orderRepository,
    orderItemRepository,
    userRepository,
    addressRepository,
    productRepository,
    inventoryRepository
);
const orderController = new OrderController(orderService);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Criar um novo pedido
 *     description: Cria um novo pedido no sistema. Valida produtos, estoque e endereço. Requer autenticação de cliente.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderDTO'
 *           examples:
 *             exemplo1:
 *               summary: Pedido com um produto
 *               value:
 *                 userId: "123e4567-e89b-12d3-a456-426614174000"
 *                 addressId: "123e4567-e89b-12d3-a456-426614174001"
 *                 items:
 *                   - productId: 1
 *                     quantity: 2
 *             exemplo2:
 *               summary: Pedido com múltiplos produtos
 *               value:
 *                 userId: "123e4567-e89b-12d3-a456-426614174000"
 *                 addressId: "123e4567-e89b-12d3-a456-426614174001"
 *                 items:
 *                   - productId: 1
 *                     quantity: 2
 *                   - productId: 2
 *                     quantity: 1
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponseDTO'
 *       400:
 *         description: Requisição inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Usuário, endereço ou produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       422:
 *         description: Erro de validação ou estoque insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post("/", ensureAuthenticated, ensureRole("USER"), asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await orderController.createOrder(req, res);
}));

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     description: Retorna os detalhes de um pedido específico pelo seu ID.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do pedido
 *         example: 1
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponseDTO'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       422:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.get("/:id", ensureAuthenticated, ensureRole("ADMIN", "USER"), asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await orderController.getOrderById(req, res);
}));

/**
 * @swagger
 * /api/orders/user/{userId}:
 *   get:
 *     summary: Listar pedidos de um usuário
 *     description: Retorna uma lista de todos os pedidos de um usuário específico, ordenados por data de criação (mais recentes primeiro).
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário (UUID)
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderResponseDTO'
 *       404:
 *         description: Usuário não encontrado ou nenhum pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       422:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.get("/user/:userId", ensureAuthenticated, ensureRole("USER"), asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await orderController.getOrdersByUserId(req, res);
}));

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Atualizar pedido
 *     description: Atualiza o status ou endereço de um pedido existente. Ao cancelar, o estoque é devolvido automaticamente.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do pedido
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderDTO'
 *           examples:
 *             exemplo1:
 *               summary: Atualizar status
 *               value:
 *                 status: "CONFIRMADO"
 *             exemplo2:
 *               summary: Cancelar pedido
 *               value:
 *                 status: "CANCELADO"
 *             exemplo3:
 *               summary: Atualizar endereço
 *               value:
 *                 addressId: "123e4567-e89b-12d3-a456-426614174002"
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponseDTO'
 *       400:
 *         description: Requisição inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Pedido ou endereço não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       422:
 *         description: Erro de validação ou transição de status inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.put("/:id", ensureAuthenticated, ensureRole("ADMIN"), asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await orderController.updateOrder(req, res);
}));

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Deletar pedido
 *     description: Remove um pedido do sistema. Não permite deletar pedidos enviados ou entregues. Devolve o estoque automaticamente.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do pedido
 *         example: 1
 *     responses:
 *       204:
 *         description: Pedido deletado com sucesso (sem conteúdo na resposta)
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       422:
 *         description: Não é possível deletar pedidos enviados ou entregues
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.delete("/:id", ensureAuthenticated, ensureRole("ADMIN"), asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await orderController.deleteOrder(req, res);
}));

export default router;

