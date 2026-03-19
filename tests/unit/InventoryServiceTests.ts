import { expect } from "chai";
import { InventoryService } from "../../src/services/InventoryService";
import { NotFoundError, ValidationError } from "../../src/errors/AppError";

describe("InventoryService", () => {
    let inventoryRepositoryMock: any;
    let productRepositoryMock: any;
    let inventoryService: InventoryService;


    const fakeProduct = {
        id: 1,
        name: "Notebook"
    };

    const fakeInventory = {
        id: 1,
        productId: 1,
        quantity: 10,
        minQuantity: 0,
        maxQuantity: 20,
        isActive: true
    };

    beforeEach(() => {
        inventoryRepositoryMock = {
            create: async () => fakeInventory,
            findByProductId: async () => fakeInventory,
            updateQuantity: async (_id: number, quantity: number) => ({
                ...fakeInventory,
                quantity
            }),
            delete: async () => true
        };

        productRepositoryMock = {
            findById: async () => fakeProduct
        };

        inventoryService = new InventoryService(
            inventoryRepositoryMock,
            productRepositoryMock
        );
    });

    it("CT-INV-01 - deve criar inventário com valores padrão", async () => {
        const inventory = await inventoryService.createInventory(1);

        expect(inventory.productId).to.equal(1);
        expect(inventory.quantity).to.equal(10);
    });


    it("CT-INV-02 - deve retornar inventário por productId", async () => {
        const inventory = await inventoryService.getInventoryByProductId(1);

        expect(inventory).to.deep.equal(fakeInventory);
    });


    it("CT-INV-03 - deve lançar erro se produto não existir", async () => {
        productRepositoryMock.findById = async () => null;

        try {
            await inventoryService.getInventoryByProductId(1);
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.message).to.equal("Produto não encontrado");
        }
    });


    it("CT-INV-04 - deve lançar erro se inventário não existir", async () => {
        inventoryRepositoryMock.findByProductId = async () => null;

        try {
            await inventoryService.getInventoryByProductId(1);
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.message).to.equal("Estoque não encontrado");
        }
    });


    it("CT-INV-05 - deve aumentar o estoque com sucesso", async () => {
        const updated = await inventoryService.increaseInventory(1, {
            quantity: 5
        });

        expect(updated.quantity).to.equal(15);
    });


    it("CT-INV-06 - deve lançar erro se quantidade for menor ou igual a zero (increase)", async () => {
        try {
            await inventoryService.increaseInventory(1, { quantity: 0 });
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(ValidationError);
            expect(error.message).to.equal("A quantidade precisa ser maior que zero");
        }
    });


    it("CT-INV-07 - deve lançar erro ao aumentar estoque inexistente", async () => {
        inventoryRepositoryMock.findByProductId = async () => null;

        try {
            await inventoryService.increaseInventory(1, { quantity: 5 });
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.message).to.equal("Estoque não encontrado");
        }
    });


    it("CT-INV-08 - deve lançar erro se exceder quantidade máxima", async () => {
        try {
            await inventoryService.increaseInventory(1, { quantity: 20 });
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(ValidationError);
            expect(error.message).to.equal(
                "A quantidade excede a quantidade maxima do produto"
            );
        }
    });


    it("CT-INV-09 - deve diminuir o estoque com sucesso", async () => {
        const updated = await inventoryService.decreaseInventory(1, {
            quantity: 5
        });

        expect(updated.quantity).to.equal(5);
    });


    it("CT-INV-10 - deve lançar erro se quantidade for menor ou igual a zero (decrease)", async () => {
        try {
            await inventoryService.decreaseInventory(1, { quantity: -1 });
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(ValidationError);
            expect(error.message).to.equal("A quantidade precisa ser maior que zero");
        }
    });


    it("CT-INV-11 - deve lançar erro ao diminuir estoque inexistente", async () => {
        inventoryRepositoryMock.findByProductId = async () => null;

        try {
            await inventoryService.decreaseInventory(1, { quantity: 5 });
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.message).to.equal("Estoque não encontrado");
        }
    });


    it("CT-INV-12 - deve lançar erro se quantidade ficar abaixo do mínimo", async () => {
        inventoryRepositoryMock.findByProductId = async () => ({
            ...fakeInventory,
            quantity: 2,
            minQuantity: 2
        });

        try {
            await inventoryService.decreaseInventory(1, { quantity: 1 });
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(ValidationError);
            expect(error.message).to.equal(
                "A quantidade não atinge a quantidade minima do produto"
            );
        }
    });


    it("CT-INV-13 - deve deletar inventário com sucesso", async () => {
        await inventoryService.deleteInventory(1);
    });


    it("CT-INV-14 - deve lançar erro se inventário não existir ao deletar", async () => {
        inventoryRepositoryMock.findByProductId = async () => null;

        try {
            await inventoryService.deleteInventory(1);
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.message).to.equal("Estoque não encontrado");
        }
    });


    it("CT-INV-15 - deve lançar erro se falhar ao deletar estoque no repositório", async () => {
        inventoryRepositoryMock.delete = async () => false;

        try {
            await inventoryService.deleteInventory(1);
            throw new Error("Teste falhou");
        } catch (error: any) {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.message).to.equal("Erro ao deletar estoque");
        }
    });

})