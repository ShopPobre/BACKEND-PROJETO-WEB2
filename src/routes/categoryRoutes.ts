import { Router, Request, Response, NextFunction } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { CategoryService } from "../services/CategoryService";
import { CategoryRepository } from "../repository/CategoryRepository";
import { asyncHandler } from "../middleware/errorHandler";
import { ensureAuthenticated } from "../middleware/authMiddleware";
import { ensureRole } from "../middleware/ensureRole";

const router = Router();

// Dependency Injection
const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Criar uma nova categoria
 *     description: Cria uma nova categoria de produtos. Requer autenticação de administrador.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryDTO'
 *           examples:
 *             exemplo1:
 *               summary: Categoria básica
 *               value:
 *                 name: "Eletrônicos"
 *             exemplo2:
 *               summary: Categoria com descrição
 *               value:
 *                 name: "Roupas"
 *                 description: "Roupas e acessórios para todas as idades"
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponseDTO'
 *             example:
 *               id: 1
 *               name: "Eletrônicos"
 *               description: null
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
 *       409:
 *         description: Categoria com este nome já existe
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
router.post("/", ensureAuthenticated, ensureRole("ADMIN"), asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await categoryController.createCategory(req, res);
}));

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Listar todas as categorias
 *     description: Retorna uma lista de todas as categorias cadastradas, ordenadas por nome.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryResponseDTO'
 *             example:
 *               - id: 1
 *                 name: "Eletrônicos"
 *                 description: "Produtos eletrônicos"
 *                 isActive: true
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *               - id: 2
 *                 name: "Roupas"
 *                 description: "Roupas e acessórios"
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
router.get("/", ensureAuthenticated, ensureRole("ADMIN", "USER"), asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await categoryController.getCategories(req, res);
}));

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     description: Retorna os detalhes de uma categoria específica pelo seu ID.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da categoria
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponseDTO'
 *             example:
 *               id: 1
 *               name: "Eletrônicos"
 *               description: "Produtos eletrônicos em geral"
 *               isActive: true
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T10:30:00.000Z"
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
router.get("/:id", ensureAuthenticated, ensureRole("ADMIN", "USER"), asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await categoryController.getCategoryById(req, res);
}));

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Atualizar categoria
 *     description: Atualiza os dados de uma categoria existente. Requer autenticação de administrador.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da categoria
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryDTO'
 *           examples:
 *             exemplo1:
 *               summary: Atualizar apenas nome
 *               value:
 *                 name: "Eletrônicos Atualizados"
 *             exemplo2:
 *               summary: Atualizar múltiplos campos
 *               value:
 *                 name: "Eletrônicos"
 *                 description: "Nova descrição"
 *                 isActive: true
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponseDTO'
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
 *         description: Categoria com este nome já existe
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
router.put("/:id", ensureAuthenticated, ensureRole("ADMIN"), asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await categoryController.updateCategory(req, res);
}));

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Deletar categoria
 *     description: Remove uma categoria do sistema. Requer autenticação de administrador.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID da categoria
 *         example: 1
 *     responses:
 *       204:
 *         description: Categoria deletada com sucesso (sem conteúdo na resposta)
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
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
router.delete("/:id", ensureAuthenticated, ensureRole("ADMIN"), asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await categoryController.deleteCategory(req, res);
}));

export default router;
