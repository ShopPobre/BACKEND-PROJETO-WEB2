import { UserController } from './../controllers/UserController';
import { UserService } from './../services/UserService';
import { UserRepository } from './../repository/UserRepository';
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { asyncHandler } from "../middleware/errorHandler";


const router = Router();


const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);


router.post("/", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await userController.createUser(req, res);
}));

router.get("/", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await userController.getUsers(req, res);
}));
router.get("/:id", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await userController.getUserByID(req, res);
}));
router.put("/:id", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await userController.updateUser(req, res);
}));

router.delete("/:id", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await userController.deleteUser(req, res);
}));

export default router;