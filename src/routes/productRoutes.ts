import { Router, Request, Response, NextFunction } from "express";
import { ProductController } from "../controllers/ProductController";
import { ProductService } from "../services/ProductService";
import { ProductRepository } from "../repository/ProductRepository";
import { CategoryRepository } from "../repository/CategoryRepository";
import { asyncHandler } from "../middleware/errorHandler";
import { InventoryService } from "../services/InventoryService";
import { InventoryRepository } from "../repository/InventoryRepository";

const router = Router();

// Dependency Injection
const productRepository = new ProductRepository();
const categoryRepository = new CategoryRepository();
const inventoryRepository = new InventoryRepository()
const inventoryService = new InventoryService(inventoryRepository, productRepository);
const productService = new ProductService(productRepository, categoryRepository, inventoryService);
const productController = new ProductController(productService);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Criar um novo produto
 *     description: Cria um novo produto no sistema. Requer autenticação de administrador.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductDTO'
 *           examples:
 *             exemplo1:
 *               summary: Produto básico
 *               value:
 *                 name: "Notebook Dell"
 *                 price: 2999.99
 *                 categoryId: 1
 *             exemplo2:
 *               summary: Produto com descrição
 *               value:
 *                 name: "Smartphone Samsung"
 *                 description: "Smartphone com 128GB de armazenamento"
 *                 price: 1599.99
 *                 categoryId: 1
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponseDTO'
 *             example:
 *               id: 1
 *               name: "Notebook Dell"
 *               description: null
 *               price: 2999.99
 *               categoryId: 1
 *               isActive: true
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Requisição inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Categoria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       409:
 *         description: Produto com este nome já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 *       422:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post("/", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await productController.createProduct(req, res);
}));

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar todos os produtos
 *     description: Retorna uma lista de todos os produtos cadastrados, ordenados por nome.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductResponseDTO'
 *             example:
 *               - id: 1
 *                 name: "Notebook Dell"
 *                 description: "Notebook com 8GB RAM"
 *                 price: 2999.99
 *                 categoryId: 1
 *                 isActive: true
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *               - id: 2
 *                 name: "Smartphone Samsung"
 *                 description: "Smartphone com 128GB"
 *                 price: 1599.99
 *                 categoryId: 1
 *                 isActive: true
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await productController.getProducts(req, res);
}));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     description: Retorna os detalhes de um produto específico pelo seu ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do produto
 *         example: 1
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponseDTO'
 *             example:
 *               id: 1
 *               name: "Notebook Dell"
 *               description: "Notebook com 8GB RAM e SSD 256GB"
 *               price: 2999.99
 *               categoryId: 1
 *               isActive: true
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T10:30:00.000Z"
 *       404:
 *         description: Produto não encontrado
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
router.get("/:id", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await productController.getProductById(req, res);
}));

/**
 * @swagger
 * /api/products/category/{categoryId}:
 *   get:
 *     summary: Listar produtos por categoria
 *     description: Retorna uma lista de produtos filtrados por categoria.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da categoria
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de produtos da categoria retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductResponseDTO'
 *       404:
 *         description: Categoria não encontrada
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
router.get("/category/:categoryId", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await productController.getProductsByCategory(req, res);
}));

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualizar produto
 *     description: Atualiza os dados de um produto existente. Requer autenticação de administrador.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             $ref: '#/components/schemas/UpdateProductDTO'
 *           examples:
 *             exemplo1:
 *               summary: Atualizar apenas preço
 *               value:
 *                 price: 2799.99
 *             exemplo2:
 *               summary: Atualizar múltiplos campos
 *               value:
 *                 name: "Notebook Dell Atualizado"
 *                 description: "Nova descrição"
 *                 price: 2999.99
 *                 categoryId: 2
 *                 isActive: true
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponseDTO'
 *       400:
 *         description: Requisição inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Produto ou categoria não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       409:
 *         description: Produto com este nome já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 *       422:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.put("/:id", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await productController.updateProduct(req, res);
}));

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Deletar produto
 *     description: Remove um produto do sistema. Requer autenticação de administrador.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do produto
 *         example: 1
 *     responses:
 *       204:
 *         description: Produto deletado com sucesso (sem conteúdo na resposta)
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Produto não encontrado
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
router.delete("/:id", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await productController.deleteProduct(req, res);
}));

export default router;

