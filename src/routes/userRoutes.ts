import { UserController } from './../controllers/UserController';
import { UserService } from './../services/UserService';
import { UserRepository } from './../repository/UserRepository';
import { asyncHandler } from "../middleware/errorHandler";
import { Request, Response, NextFunction, Router } from "express"
import { BcryptService } from '../services/hashing/BcryptService';

const router = Router();

const userRepository = new UserRepository();
const hashingService = new BcryptService();
const userService = new UserService(userRepository, hashingService);
const userController = new UserController(userService);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Criar um novo usuário
 *     description: Cria um novo usuário no sistema. O email e CPF devem ser únicos.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDTO'
 *           examples:
 *             exemplo1:
 *               summary: Usuário básico
 *               value:
 *                 name: "João Silva"
 *                 email: "joao.silva@example.com"
 *                 password: "senha123"
 *                 cpf: "12345678901"
 *                 telefone: "(11) 98765-4321"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseDTO'
 *       400:
 *         description: Requisição inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email ou CPF já cadastrado
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
    await userController.createUser(req, res);
}));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar todos os usuários
 *     description: Retorna uma lista de todos os usuários cadastrados no sistema.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponseDTO'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await userController.getUsers(req, res);
}));

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     description: Retorna os detalhes de um usuário específico pelo seu ID (UUID).
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário (UUID)
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseDTO'
 *       404:
 *         description: Usuário não encontrado
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
    await userController.getUserByID(req, res);
}));

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     description: Atualiza os dados de um usuário existente.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário (UUID)
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDTO'
 *           examples:
 *             exemplo1:
 *               summary: Atualizar apenas nome
 *               value:
 *                 name: "João Silva Santos"
 *             exemplo2:
 *               summary: Atualizar múltiplos campos
 *               value:
 *                 name: "João Silva Santos"
 *                 telefone: "(11) 99999-8888"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseDTO'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       409:
 *         description: Email já cadastrado
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
    await userController.updateUser(req, res);
}));

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Deletar usuário
 *     description: Remove um usuário do sistema.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário (UUID)
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso (sem conteúdo na resposta)
 *       404:
 *         description: Usuário não encontrado
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
    await userController.deleteUser(req, res);
}));

export default router;