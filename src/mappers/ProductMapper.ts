import { Product } from "../models/Product";
import { ProductResponseDTO } from "../dto/ProductDTO";

export class ProductMapper {
    static toDTO(product: Product): ProductResponseDTO {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.categoryId,
            isActive: product.isActive,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };
    }

    static toDTOArray(products: Product[]): ProductResponseDTO[] {
        return products.map(product => this.toDTO(product));
    }
}

