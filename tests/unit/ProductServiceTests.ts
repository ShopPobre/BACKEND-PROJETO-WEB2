import { expect } from "chai";
import { ProductService } from "../../src/services/ProductService";
import { ConflictError, NotFoundError } from "../../src/errors/AppError";

describe("ProductService", () => {
    let productRepositoryMock: any;
    let categoryRepositoryMock: any;
    let inventoryServiceMock: any;
    let productService: ProductService;

    const fakeCategory = {
        id: 1,
        name: "Eletrônicos"
    };

    const fakeProduct = {
        id: 1,
        name: "Notebook",
        description: "Notebook gamer",
        price: 5000,
        categoryId: 1,
        isActive: true
    };

    beforeEach(() => {
        productRepositoryMock = {
            findByName: async () => null,
            findById: async () => fakeProduct,
            create: async () => fakeProduct,
            update: async () => fakeProduct,
            delete: async () => true,
            getAllProducts: async () => ({
                data: [fakeProduct],
                pagination: { total: 1 }
            }),
            findByCategoryId: async () => ({
                data: [fakeProduct],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1,
                    hasNext: false,
                    hasPrev: false
                }
            })
        };

        categoryRepositoryMock = {
            findById: async () => fakeCategory
        };

        inventoryServiceMock = {
            createInventory: async (_id: number) => true,
            deleteInventory: async (_id: number) => true
        };

        productService = new ProductService(
            productRepositoryMock,
            categoryRepositoryMock,
            inventoryServiceMock
        );
    });


    it("CT-PROD-01 - deve criar produto e criar estoque automaticamente", async () => {
        const product = await productService.createProduct({
            name: "Notebook",
            description: "Notebook gamer",
            price: 5000,
            categoryId: 1
        });

        expect(product).to.deep.equal(fakeProduct);
    });


    it("CT-PROD-02 - deve lançar erro se categoria não existir", async () => {
        categoryRepositoryMock.findById = async () => null;

        try {
            await productService.createProduct({
                name: "Notebook",
                price: 5000,
                categoryId: 99
            });
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.message).to.equal("Categoria não encontrada");
        }
    });


    it("CT-PROD-03 - deve lançar erro se produto com mesmo nome existir", async () => {
        productRepositoryMock.findByName = async () => fakeProduct;

        try {
            await productService.createProduct({
                name: "Notebook",
                price: 5000,
                categoryId: 1
            });
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(ConflictError);
            expect(error.message).to.equal("Produto com este nome já existe");
        }
    });


    it("CT-PROD-04 - deve listar produtos existentes", async () => {
        const result = await productService.getProducts();

        expect(result.data).to.be.an("array");
        expect(result.data).to.have.length(1);
        expect(result.data[0]).to.deep.equal(fakeProduct);
    });


    it("CT-PROD-05 - deve lançar erro ao listar produtos inexistentes", async () => {
        productRepositoryMock.getAllProducts = async () => ({
            data: [],
            pagination: { total: 0 }
        });

        try {
            await productService.getProducts();
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.message).to.equal("Nenhuma produto encontrado");
        }
    });


    it("CT-PROD-06 - deve buscar produto por ID válido", async () => {
        const product = await productService.getProductById(1);

        expect(product).to.deep.equal(fakeProduct);
    });


    it("CT-PROD-07 - deve lançar erro ao buscar produto inexistente", async () => {
        productRepositoryMock.findById = async () => null;

        try {
            await productService.getProductById(99);
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.message).to.equal("Produto não encontrado");
        }
    });


    it("CT-PROD-08 - deve buscar produtos por categoria existente", async () => {
        const products = await productService.getProductsByCategory(1);

        expect(products.pagination.total).to.equal(1);
        expect(products.pagination.page).to.equal(1);
        expect(products.pagination.hasNext).to.be.false;
    });


    it("CT-PROD-09 - deve lançar erro ao buscar produtos de categoria inexistente", async () => {
        categoryRepositoryMock.findById = async () => null;

        try {
            await productService.getProductsByCategory(99);
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.message).to.equal("Categoria não encontrada");
        }
    });


    it("CT-PROD-10 - deve atualizar produto existente", async () => {
        const updatedProduct = await productService.updateProductById(1, {
            name: "Notebook Atualizado",
            price: 6000
        });

        expect(updatedProduct).to.deep.equal(fakeProduct);
    });


    it("CT-PROD-11 - deve lançar erro ao atualizar produto com nome duplicado", async () => {
        productRepositoryMock.findById = async () => ({
            ...fakeProduct,
            name: "Mouse"
        });

        productRepositoryMock.findByName = async () => ({
            id: 2,
            name: "Notebook"
        });

        try {
            await productService.updateProductById(1, {
                name: "Notebook"
            });
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(ConflictError);
            expect(error.message).to.equal("Produto com este nome já existe");
        }
    });


    it("CT-PROD-12 - deve lançar erro ao atualizar produto com categoria inexistente", async () => {
        categoryRepositoryMock.findById = async () => null;

        try {
            await productService.updateProductById(1, {
                categoryId: 99
            });
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.message).to.equal("Categoria não encontrada");
        }
    });


    it("CT-PROD-13 - deve deletar produto e estoque", async () => {
        await productService.deleteProduct(1);
    });


    it("CT-PROD-14 - deve lançar erro ao deletar produto inexistente", async () => {
        productRepositoryMock.findById = async () => null;

        try {
            await productService.deleteProduct(1);
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.message).to.equal("Produto não encontrado");
        }
    });

})