import { InvetoryUpdateDTO } from "../dto/InventoryDTO";
import { NotFoundError, ValidationError } from "../errors/AppError";
import { IInventoryRepository } from "../interfaces/IInventoryRepository";
import { IProductRepository } from "../interfaces/IProductRepository";
import { Inventory } from "../models/Inventory";
import { Product } from "../models/Product";
import { validateId } from "../schemas/productSchema";

export class InventoryService {


    constructor (
        private inventoryRepository: IInventoryRepository,
        private productRepository: IProductRepository
    ) {}


    async createInventory(id: number) {
        return await this.inventoryRepository.create({
            productId: id,
            quantity: 0,
            minQuantity: 0,
            maxQuantity: 9999,
            isActive: true
        });

    }

    async getInventoryByProductId(productId: number): Promise<Inventory> {
        const validatedId = validateId(productId);

        const product = await this.productRepository.findById(validatedId);
        if(!product) {
            throw new NotFoundError('Produto não encontrado');
        }

        const inventory = await this.inventoryRepository.findByProductId(validatedId);

        if(!inventory){
            throw new NotFoundError('Estoque não encontrado');
        }

        return inventory;
    }

    async increaseInventory(productId: number, inventoryData: InvetoryUpdateDTO): Promise<Inventory> {
        const validatedId = validateId(productId);

        if(inventoryData.quantity <= 0) {
            throw new ValidationError('A quantidade precisa ser maior que zero');
        }

        const inventory = await this.inventoryRepository.findByProductId(validatedId);

        if(!inventory){
            throw new NotFoundError('Estoque não encontrado');
        }

        const updatedQuantity = inventory.quantity + inventoryData.quantity;

        if(inventory.maxQuantity){
            if (updatedQuantity > inventory.maxQuantity){
                 throw new ValidationError('A quantidade excede a quantidade maxima do produto');
            }
        }

        const updated = await this.inventoryRepository.updateQuantity(validatedId, updatedQuantity);

        return updated;
    }

    async decreaseInventory(productId: number, inventoryData: InvetoryUpdateDTO): Promise<Inventory> {
        const validatedId = validateId(productId);

        if(inventoryData.quantity <= 0) {
            throw new ValidationError('A quantidade precisa ser maior que zero');
        }

        const inventory = await this.inventoryRepository.findByProductId(validatedId);

        if(!inventory){
            throw new NotFoundError('Estoque não encontrado');
        }

        const updatedQuantity = inventory.quantity - inventoryData.quantity;

        if(inventory.minQuantity){
            if (updatedQuantity < inventory.minQuantity){
                 throw new ValidationError('A quantidade não atinge a quantidade minima do produto');
            }
        }

        const updated = await this.inventoryRepository.updateQuantity(validatedId, updatedQuantity);

        return updated;
    }


    async deleteInventory(productId:number){
        const inventory = await this.inventoryRepository.findByProductId(productId);

        if(!inventory){
            throw new NotFoundError('Estoque não encontrado');
        }

        const deleted = await this.inventoryRepository.delete(productId);
         if (!deleted) {
            throw new NotFoundError('Erro ao deletar estoque');
        }
    }
}