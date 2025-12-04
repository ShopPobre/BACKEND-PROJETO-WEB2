import { asyncHandler } from "../middleware/errorHandler";
import { Request, Response, NextFunction, Router } from "express"
import { InventoryRepository } from "../repository/InventoryRepository";
import { InventoryService } from "../services/InventoryService";
import { ProductRepository } from "../repository/ProductRepository";
import { InventoryController } from "../controllers/InventoryController";


const router = Router({ mergeParams: true }); 

const productRepository = new ProductRepository();
const inventoryRepository = new InventoryRepository();
const inventoryService = new InventoryService(inventoryRepository,productRepository);
const inventoryController = new InventoryController(inventoryService);

router.get("/", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await inventoryController.getInvetoryByProductId(req, res);
}));

router.patch("/increase", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await inventoryController.increaseInvetory(req, res);
}));

router.patch("/decrease", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await inventoryController.decreaseInvetory(req, res);
}));


export default router;