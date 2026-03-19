import { Inventory, InventoryAttributes } from "../models/Inventory";

export interface IInventoryRepository {
    create(invetoryData: Omit<InventoryAttributes, 'id'>): Promise<Inventory>;
    findByProductId(productId: number): Promise<Inventory | null>;
    updateQuantity(productId: number, newQuantity: number): Promise<Inventory>;
    delete(productId: number): Promise<boolean>;
}