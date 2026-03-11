import { Product } from "../models/Product";
import { ProductResponseDTO } from "../dto/ProductDTO";
import { ProductImageMapper } from "./ProductImageMapper";

export class ProductMapper {
    static toDTO(product: Product): ProductResponseDTO {
        const dto: ProductResponseDTO = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.categoryId,
            isActive: product.isActive,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };
        const images = (product as any).images;
        const mainImageAssoc = (product as any).mainImage;

        if (Array.isArray(images) && images.length > 0) {
            dto.images = ProductImageMapper.toDTOArray(images, product.id);
        }

        const mainImageSource =
            mainImageAssoc ??
            (Array.isArray(images) && images.length > 0 ? images[0] : null);

        if (mainImageSource) {
            dto.mainImage = ProductImageMapper.toDTO(mainImageSource, product.id);
        } else {
            dto.mainImage = null;
        }
        return dto;
    }

    static toDTOArray(products: Product[]): ProductResponseDTO[] {
        return products.map((product) => this.toDTO(product));
    }
}

