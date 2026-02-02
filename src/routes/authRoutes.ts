import { AuthService } from './../services/AuthService';
import { Request, Response, NextFunction, Router } from "express"
import { AuthController } from "../controllers/AuthController";
import { asyncHandler } from '../middleware/errorHandler';
import { UserRepository } from '../repository/UserRepository';
import { BcryptService } from '../services/hashing/BcryptService';



const router = Router();

const userRepository = new UserRepository();
const hashingService = new BcryptService();
const authService = new AuthService(userRepository, hashingService);
const authController = new AuthController(authService);

router.post("/login", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await authController.login(req, res);
}));


export default router;