import { IInventoryRepository } from "../interfaces/IInventoryRepository";
import { Inventory, InventoryAttributes } from "../models/Inventory";

export class InventoryRepository implements IInventoryRepository {
    async create(invetoryData: Omit<InventoryAttributes, "id">): Promise<Inventory> {
        const inventory = await Inventory.create(invetoryData);
        return inventory;
    }
   
    async findByProductId(productId: number): Promise<Inventory | null> {
        const inventory = await Inventory.findOne({ where: { productId } });
        return inventory;
    }

    async updateQuantity(productId: number, newQuantity: number): Promise<Inventory> {
        const inventory = await Inventory.findOne({ where: { productId } });

        if (!inventory) {
            throw new Error("Inventário não encontrado");
        }

        inventory.quantity = newQuantity;
        await inventory.save();

        return inventory;
    }

    async delete(productId: number): Promise<boolean> {
        const deletedCount = await Inventory.destroy({
            where: { productId }
        });

        return deletedCount > 0;
    }
    
}