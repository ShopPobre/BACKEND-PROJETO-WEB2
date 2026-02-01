import { InventoryResponseDTO } from "../dto/InventoryDTO";
import { Inventory } from "../models/Inventory";

export class InventoryMapper {

    static toDTO(invetory: Inventory): InventoryResponseDTO {
        return {
            id: invetory.id,
            productId: invetory.productId,
            quantity: invetory.quantity,
            minQuantity: invetory.minQuantity,
            maxQuantity: invetory.maxQuantity, 
            isActive: invetory.isActive,
            createdAt: invetory.createdAt,
            updatedAt: invetory.updatedAt
        };
    }

}