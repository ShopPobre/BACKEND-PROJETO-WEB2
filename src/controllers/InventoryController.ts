import { validateId } from "../schemas/productSchema";
import { Request, Response } from "express";
import { InventoryService } from "../services/InventoryService";
import { InventoryMapper } from "../mappers/InventoryMapper";
import { InvetoryUpdateDTO } from "../dto/InventoryDTO";

export class InventoryController {

    constructor(
        private invetoryService: InventoryService
    ) {}

    async getInvetoryByProductId(req: Request, res: Response) {
        try{
            const productId = validateId(req.params.productId);
            const inventory = await this.invetoryService.getInventoryByProductId(productId);
            const response = InventoryMapper.toDTO(inventory);
            return res.status(200).json(response);
        } catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao buscar o estoque do produto", error: error.message });
        }
    }

    async increaseInvetory(req: Request, res: Response) {
        try{
            const productId = validateId(req.params.productId);
            const invetoryData: InvetoryUpdateDTO = req.body;
            const inventory = await this.invetoryService.increaseInventory(productId, invetoryData);
            const response = InventoryMapper.toDTO(inventory);
            return res.status(200).json(response);
        } catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao incrementar o estoque do produto", error: error.message });
        }
    }

    async decreaseInvetory(req: Request, res: Response) {
        try{
            const productId = validateId(req.params.productId);
            const invetoryData: InvetoryUpdateDTO = req.body;
            const inventory = await this.invetoryService.decreaseInventory(productId, invetoryData);
            const response = InventoryMapper.toDTO(inventory);
            return res.status(200).json(response);
        } catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao decrementar o estoque do produto", error: error.message });
        }
    }
    
}