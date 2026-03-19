import { AddressRepository } from "../repository/AddressRepository";
import { AddressService } from "../services/AddressService";
import { AddressController } from "../controllers/AddressController";
import { UserRepository } from "../repository/UserRepository";
import { asyncHandler } from "../middleware/errorHandler";
import { Request, Response, NextFunction, Router } from "express"
import { ensureAuthenticated } from "../middleware/authMiddleware";
import { ensureRole } from "../middleware/ensureRole";


const router = Router({ mergeParams: true }); 

const userRepository = new UserRepository();
const addressRepository = new AddressRepository();
const addressService = new AddressService(addressRepository, userRepository);
const addressController = new AddressController(addressService);

router.use(ensureAuthenticated);
router.use(ensureRole("USER"));

/**
 * @swagger
 * /api/users/{userId}/addresses:
 *   post:
 *     summary: Criar um novo endereço
 *     description: Cria um novo endereço para um usuário específico.
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: userId
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
 *             $ref: '#/components/schemas/CreateAddressDTO'
 *           examples:
 *             exemplo1:
 *               summary: Endereço residencial
 *               value:
 *                 rua: "Rua das Flores"
 *                 numero: 123
 *                 cep: "12345-678"
 *                 cidade: "São Paulo"
 *                 estado: "SP"
 *                 tipo: "CASA"
 *     responses:
 *       201:
 *         description: Endereço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressResponseDTO'
 *       404:
 *         description: Usuário não encontrado
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
router.post("/", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await addressController.createAddress(req, res);
}));

/**
 * @swagger
 * /api/users/{userId}/addresses:
 *   get:
 *     summary: Listar endereços de um usuário
 *     description: Retorna uma lista de todos os endereços cadastrados para um usuário específico.
 *     tags: [Addresses]
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
 *         description: Lista de endereços retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AddressResponseDTO'
 *       404:
 *         description: Usuário não encontrado ou nenhum endereço encontrado
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
    await addressController.getAddresses(req, res);
}));

/**
 * @swagger
 * /api/users/{userId}/addresses/{addressId}:
 *   put:
 *     summary: Atualizar endereço
 *     description: Atualiza os dados de um endereço existente de um usuário.
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário (UUID)
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do endereço (UUID)
 *         example: "123e4567-e89b-12d3-a456-426614174001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAddressDTO'
 *           examples:
 *             exemplo1:
 *               summary: Atualizar apenas número
 *               value:
 *                 numero: 456
 *             exemplo2:
 *               summary: Atualizar múltiplos campos
 *               value:
 *                 rua: "Avenida Paulista"
 *                 numero: 1000
 *                 cep: "01310-100"
 *                 cidade: "São Paulo"
 *                 estado: "SP"
 *                 tipo: "TRABALHO"
 *     responses:
 *       200:
 *         description: Endereço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressResponseDTO'
 *       404:
 *         description: Usuário ou endereço não encontrado
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
router.put("/:addressId", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await addressController.updateAddress(req, res);
}));

/**
 * @swagger
 * /api/users/{userId}/addresses/{addressId}:
 *   delete:
 *     summary: Deletar endereço
 *     description: Remove um endereço de um usuário.
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário (UUID)
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do endereço (UUID)
 *         example: "123e4567-e89b-12d3-a456-426614174001"
 *     responses:
 *       204:
 *         description: Endereço deletado com sucesso (sem conteúdo na resposta)
 *       404:
 *         description: Usuário ou endereço não encontrado
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
router.delete("/:addressId", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await addressController.deleteAddress(req, res);
}));


export default router;