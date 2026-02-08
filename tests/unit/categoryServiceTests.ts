import { expect } from 'chai';
const { CategoryService } = require("../../src/services/CategoryService");
const { ConflictError, NotFoundError } = require("../../src/errors/AppError");

describe("CategoryService", () => {
  let categoryRepositoryMock: any;
  let categoryService: any;

  const validUUID = "550e8400-e29b-41d4-a716-446655440000";
  const anotherUUID = "660e8400-e29b-41d4-a716-446655440001";

  const fakeCategory = {
    id: validUUID,
    name: "Eletrônicos",
    description: "Produtos eletrônicos em geral",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const fakeCategory2 = {
    id: anotherUUID,
    name: "Roupas",
    description: "Roupas e acessórios",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockConfigurations = {
    mockCreateSuccess: () => {
      categoryRepositoryMock.findByName = async () => null;
      categoryRepositoryMock.create = async () => fakeCategory;
    },

    mockCreateNameConflict: () => {
      categoryRepositoryMock.findByName = async () => fakeCategory;
    },

    mockGetCategoriesSuccess: () => {
      categoryRepositoryMock.getAllCategories = async () => ({
        data: [fakeCategory, fakeCategory2],
        pagination: { total: 2, page: 1, limit: 10, totalPages: 1 }
      });
    },

    mockGetCategoriesEmpty: () => {
      categoryRepositoryMock.getAllCategories = async () => ({
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
      });
    },

    mockGetCategoryByIdSuccess: () => {
      categoryRepositoryMock.findById = async () => fakeCategory;
    },

    mockGetCategoryByIdNotFound: () => {
      categoryRepositoryMock.findById = async () => null;
    },

    mockUpdateSuccess: () => {
      categoryRepositoryMock.findById = async () => fakeCategory;
      categoryRepositoryMock.findByName = async () => null;
      categoryRepositoryMock.update = async () => ({
        ...fakeCategory,
        name: "Eletrônicos Atualizado",
        description: "Descrição atualizada"
      });
    },

    mockUpdateNameConflict: () => {
      categoryRepositoryMock.findById = async () => fakeCategory;
      categoryRepositoryMock.findByName = async (name: string) => {
        if (name === "Roupas") return fakeCategory2;
        return null;
      };
    },

    mockUpdateNotFound: () => {
      categoryRepositoryMock.findById = async () => null;
    },

    mockDeleteSuccess: () => {
      categoryRepositoryMock.findById = async () => fakeCategory;
      categoryRepositoryMock.delete = async () => true;
    },

    mockDeleteNotFound: () => {
      categoryRepositoryMock.findById = async () => null;
    }
  };

    beforeEach(() => {
        categoryRepositoryMock = {
        findByName: async () => null,
        create: async () => fakeCategory,
        findById: async () => fakeCategory,
        update: async () => fakeCategory,
        delete: async () => true,
        getAllCategories: async () => ({
            data: [fakeCategory, fakeCategory2],
            pagination: { total: 2, page: 1, limit: 10, totalPages: 1 }
        })
        };

        categoryService = new CategoryService(categoryRepositoryMock);
    });

    it("CT-CAT-01: deve criar uma categoria com sucesso", async () => {
        mockConfigurations.mockCreateSuccess();
        
        const result = await categoryService.createCategory({
        name: "Eletrônicos",
        description: "Produtos eletrônicos em geral"
        });

        expect(result).to.deep.equal(fakeCategory);
    });

    it("CT-CAT-02: deve lançar erro se nome da categoria já existir", async () => {
        mockConfigurations.mockCreateNameConflict();

        try {
        await categoryService.createCategory({
            name: "Eletrônicos",
            description: "Produtos eletrônicos em geral"
        });
        throw new Error("Teste falhou");
        } catch (error: any) {
        expect(error).to.be.instanceOf(ConflictError);
        expect(error.message).to.equal('Categoria com este nome já existe');
        }
    });

    it("CT-CAT-03: deve retornar lista de categorias", async () => {
        mockConfigurations.mockGetCategoriesSuccess();

        const result = await categoryService.getCategories({});

        expect(result).to.have.property("data");
        expect(result.data).to.be.an("array");
        expect(result.data.length).to.equal(2);
        expect(result).to.have.property("pagination");
        expect(result.pagination.total).to.equal(2);
    });

    it("CT-CAT-04: deve lançar erro se não houver categorias", async () => {
        mockConfigurations.mockGetCategoriesEmpty();

        try {
        await categoryService.getCategories({});
        throw new Error("Teste falhou");
        } catch (error: any) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal("Nenhuma categoria encontrada");
        }
    });

    it("CT-CAT-05: deve retornar categoria por ID", async () => {
        mockConfigurations.mockGetCategoryByIdSuccess();

        const category = await categoryService.getCategoryById(validUUID);
        expect(category).to.deep.equal(fakeCategory);
    });

    it("CT-CAT-06: deve lançar erro se categoria não existir", async () => {
        mockConfigurations.mockGetCategoryByIdNotFound();

        try {
        await categoryService.getCategoryById(validUUID);
        throw new Error("Teste falhou");
        } catch (error: any) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal("Categoria não encontrada");
        }
    });

    it("CT-CAT-07: deve atualizar categoria com sucesso", async () => {
        mockConfigurations.mockUpdateSuccess();

        const updated = await categoryService.updateCategoryById(validUUID, {
        name: "Eletrônicos Atualizado",
        description: "Descrição atualizada"
        });

        expect(updated.name).to.equal("Eletrônicos Atualizado");
        expect(updated.description).to.equal("Descrição atualizada");
    });

    it("CT-CAT-08: deve lançar erro ao atualizar categoria com nome existente", async () => {
        mockConfigurations.mockUpdateNameConflict();

        try {
        await categoryService.updateCategoryById(validUUID, {
            name: "Roupas", 
            description: "Descrição qualquer"
        });
        throw new Error("Teste falhou");
        } catch (error: any) {
        expect(error).to.be.instanceOf(ConflictError);
        expect(error.message).to.equal('Categoria com este nome já existe');
        }
    });

    it("CT-CAT-09: deve lançar erro ao atualizar categoria inexistente", async () => {
        mockConfigurations.mockUpdateNotFound();

        try {
        await categoryService.updateCategoryById(validUUID, {
            name: "Categoria Atualizada",
            description: "Descrição atualizada"
        });
        throw new Error("Teste falhou");
        } catch (error: any) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal('Categoria não encontrada');
        }
    });

    it("CT-CAT-10: deve deletar categoria com sucesso", async () => {
        mockConfigurations.mockDeleteSuccess();

        await expect(categoryService.deleteCategory(validUUID)).to.not.throw;
    
    });


    it("CT-CAT-11: deve lançar erro ao deletar categoria inexistente", async () => {
        mockConfigurations.mockDeleteNotFound();

        try {
        await categoryService.deleteCategory(validUUID);
        throw new Error("Teste falhou");
        } catch (error: any) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal('Categoria não encontrada');
        }
    });

});