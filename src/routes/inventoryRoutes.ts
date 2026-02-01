import { asyncHandler } from "../middleware/errorHandler";
import { Request, Response, NextFunction, Router } from "express"
import { InventoryRepository } from "../repository/InventoryRepository";
import { InventoryService } from "../services/InventoryService";
import { ProductRepository } from "../repository/ProductRepository";
import { InventoryController } from "../controllers/InventoryController";
import { ensureAuthenticated } from "../middleware/authMiddleware";
import { ensureRole } from "../middleware/ensureRole";


const router = Router({ mergeParams: true }); 

const productRepository = new ProductRepository();
const inventoryRepository = new InventoryRepository();
const inventoryService = new InventoryService(inventoryRepository,productRepository);
const inventoryController = new InventoryController(inventoryService);

router.use(ensureAuthenticated);
router.use(ensureRole("ADMIN"));

/**
 * @swagger
 * /api/inventory/{productId}:
 *   get:
 *     summary: Buscar estoque de um produto
 *     description: Retorna as informações de estoque de um produto específico pelo seu ID.
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do produto
 *         example: 1
 *     responses:
 *       200:
 *         description: Estoque encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryResponseDTO'
 *             example:
 *               id: 1
 *               productId: 1
 *               quantity: 50
 *               minQuantity: 10
 *               maxQuantity: 1000
 *               isActive: true
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T10:30:00.000Z"
 *       404:
 *         description: Produto ou estoque não encontrado
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
router.get("/", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await inventoryController.getInvetoryByProductId(req, res);
}));

/**
 * @swagger
 * /api/inventory/{productId}/increase:
 *   patch:
 *     summary: Aumentar estoque de um produto
 *     description: Incrementa a quantidade disponível em estoque de um produto.
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do produto
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryUpdateDTO'
 *           examples:
 *             exemplo1:
 *               summary: Adicionar 10 unidades
 *               value:
 *                 quantity: 10
 *     responses:
 *       200:
 *         description: Estoque atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryResponseDTO'
 *       400:
 *         description: Quantidade inválida ou excede o máximo permitido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Produto ou estoque não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       422:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.patch("/increase", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await inventoryController.increaseInvetory(req, res);
}));

/**
 * @swagger
 * /api/inventory/{productId}/decrease:
 *   patch:
 *     summary: Diminuir estoque de um produto
 *     description: Decrementa a quantidade disponível em estoque de um produto. Usado quando produtos são vendidos.
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do produto
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryUpdateDTO'
 *           examples:
 *             exemplo1:
 *               summary: Remover 5 unidades
 *               value:
 *                 quantity: 5
 *     responses:
 *       200:
 *         description: Estoque atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryResponseDTO'
 *       400:
 *         description: Quantidade inválida ou abaixo do mínimo permitido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Produto ou estoque não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       422:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.patch("/decrease", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await inventoryController.decreaseInvetory(req, res);
}));


export default router;