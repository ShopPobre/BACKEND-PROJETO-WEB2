import { expect } from "chai";
const { ProductService } = require("../../src/services/ProductService");
const { ConflictError, NotFoundError } = require("../../src/errors/AppError");

describe("ProductService", () => {
  let productRepositoryMock: any;
  let categoryRepositoryMock: any;
  let invetoryServiceMock: any;
  let productService: any;

  const fakeProduct = {
    id: 1,
    name: "Produto A",
    price: 100,
    categoryId: 1,
    isActive: true
  };

  const fakeProduct2 = {
    id: 2,
    name: "Produto B",
    price: 150,
    categoryId: 1,
    isActive: true
  };

  const mockConfigurations = {
    mockCreateSuccess: () => {
      categoryRepositoryMock.findById = async () => ({ id: 1 });
      productRepositoryMock.findByName = async () => null;
      productRepositoryMock.create = async () => fakeProduct;
      invetoryServiceMock.createInventory = async () => ({});
    },

    mockCategoryNotFound: () => {
      categoryRepositoryMock.findById = async () => null;
    },

    mockNameConflict: () => {
      categoryRepositoryMock.findById = async () => ({ id: 1 });
      productRepositoryMock.findByName = async () => fakeProduct;
    },

    mockGetProductsSuccess: () => {
      productRepositoryMock.getAllProducts = async () => ({
        data: [fakeProduct],
        pagination: { total: 1 }
      });
    },

    mockGetProductsEmpty: () => {
      productRepositoryMock.getAllProducts = async () => ({
        data: [],
        pagination: { total: 0 }
      });
    },

    mockGetByIdSuccess: () => {
      productRepositoryMock.findById = async () => fakeProduct;
    },

    mockGetByIdNotFound: () => {
      productRepositoryMock.findById = async () => null;
    },

    mockGetByCategorySuccess: () => {
      categoryRepositoryMock.findById = async () => ({ id: 1 });
      productRepositoryMock.findByCategoryId = async () => ({
        data: [fakeProduct],
        pagination: { total: 1 }
      });
    },

    mockGetByCategoryNotFound: () => {
      categoryRepositoryMock.findById = async () => null;
    },

    mockUpdateSuccess: () => {
      productRepositoryMock.findById = async () => fakeProduct;
      productRepositoryMock.findByName = async () => null;
      categoryRepositoryMock.findById = async () => ({ id: 1 });
      productRepositoryMock.update = async () => fakeProduct;
    },

    mockUpdateNameConflict: () => {
      productRepositoryMock.findById = async () => fakeProduct;
      productRepositoryMock.findByName = async () => fakeProduct2;
    },

    mockDeleteSuccess: () => {
      productRepositoryMock.findById = async () => fakeProduct;
      productRepositoryMock.delete = async () => true;
      invetoryServiceMock.deleteInventory = async () => true;
    },

    mockDeleteNotFound: () => {
      productRepositoryMock.findById = async () => null;
    }
  };

  beforeEach(() => {
    productRepositoryMock = {
      create: async () => fakeProduct,
      findByName: async () => null,
      findById: async () => fakeProduct,
      update: async () => fakeProduct,
      delete: async () => true,
      getAllProducts: async () => ({
        data: [fakeProduct],
        pagination: { total: 1 }
      }),
      findByCategoryId: async () => ({
        data: [fakeProduct],
        pagination: { total: 1 }
      })
    };

    categoryRepositoryMock = {
      findById: async () => ({ id: 1 })
    };

    invetoryServiceMock = {
      createInventory: async () => ({}),
      deleteInventory: async () => true
    };

    productService = new ProductService(
      productRepositoryMock,
      categoryRepositoryMock,
      invetoryServiceMock
    );
  });

  it("CT-PROD-01 - deve criar produto com sucesso", async () => {
    mockConfigurations.mockCreateSuccess();

    const result = await productService.createProduct({
      name: "Produto A",
      price: 100,
      categoryId: 1
    });

    expect(result).to.deep.equal(fakeProduct);
  });

  it("CT-PROD-02 - deve lançar erro se categoria não existir", async () => {
    mockConfigurations.mockCategoryNotFound();

    try {
      await productService.createProduct(fakeProduct);
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal("Categoria não encontrada");
    }
  });

  it("CT-PROD-03 - deve lançar erro se nome duplicado", async () => {
    mockConfigurations.mockNameConflict();

    try {
      await productService.createProduct(fakeProduct);
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(ConflictError);
      expect(error.message).to.equal("Produto com este nome já existe");
    }
  });

  it("CT-PROD-04 - deve listar produtos", async () => {
    mockConfigurations.mockGetProductsSuccess();

    const result = await productService.getProducts();

    expect(result.data.length).to.equal(1);
    expect(result.pagination.total).to.equal(1);
  });

  it("CT-PROD-05 - deve lançar erro se não houver produtos", async () => {
    mockConfigurations.mockGetProductsEmpty();

    try {
      await productService.getProducts();
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal("Nenhuma produto encontrado");
    }
  });

  it("CT-PROD-06 - deve buscar produto por ID", async () => {
    mockConfigurations.mockGetByIdSuccess();

    const result = await productService.getProductById(1);
    expect(result).to.deep.equal(fakeProduct);
  });

  it("CT-PROD-07 - deve lançar erro se produto não existir", async () => {
    mockConfigurations.mockGetByIdNotFound();

    try {
      await productService.getProductById(1);
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal("Produto não encontrado");
    }
  });

  it("CT-PROD-08 - deve buscar produtos por categoria", async () => {
    mockConfigurations.mockGetByCategorySuccess();

    const result = await productService.getProductsByCategory(1);

    expect(result.data.length).to.equal(1);
  });

  it("CT-PROD-09 - deve lançar erro se categoria não existir", async () => {
    mockConfigurations.mockGetByCategoryNotFound();

    try {
      await productService.getProductsByCategory(1);
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal("Categoria não encontrada");
    }
  });

  it("CT-PROD-10 - deve atualizar produto", async () => {
    mockConfigurations.mockUpdateSuccess();

    const result = await productService.updateProductById(1, {
      name: "Produto Atualizado"
    });

    expect(result).to.deep.equal(fakeProduct);
  });

  it("CT-PROD-11 - deve lançar erro ao atualizar com nome duplicado", async () => {
    mockConfigurations.mockUpdateNameConflict();

    try {
      await productService.updateProductById(1, { name: "Produto B" });
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(ConflictError);
      expect(error.message).to.equal("Produto com este nome já existe");
    }
  });

  it("CT-PROD-13 - deve deletar produto com sucesso", async () => {
    mockConfigurations.mockDeleteSuccess();

    //NÃO HÁ MENSAGENS
    await productService.deleteProduct(1);

  });

  it("CT-PROD-14 - deve lançar erro ao deletar produto inexistente", async () => {
    mockConfigurations.mockDeleteNotFound();

    try {
      await productService.deleteProduct(1);
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal("Produto não encontrado");
    }
  });
});
