const { expect } = require("chai");
const { UserService } = require("../../src/services/UserService");
const { ConflictError, NotFoundError } = require("../../src/errors/AppError");

describe("UserService", () => {
  let userRepositoryMock: any;
  let userService: any;

  const validUUID = "550e8400-e29b-41d4-a716-446655440000";
  const anotherUUID = "660e8400-e29b-41d4-a716-446655440001";

  const fakeUser = {
    id: validUUID,
    name: "João",
    email: "joao@email.com",
    cpf: "12345678900",
    telefone: "999999999"
  };

  const fakeUser2 = {
    id: anotherUUID,
    name: "Maria",
    email: "maria@email.com",
    cpf: "98765432100",
    telefone: "888888888"
  };

  const mockConfigurations = {
    mockCreateSuccess: () => {
      userRepositoryMock.findByCpf = async () => null;
      userRepositoryMock.findByEmail = async () => null;
      userRepositoryMock.create = async () => fakeUser;
    },

    mockCpfConflict: () => {
      userRepositoryMock.findByCpf = async () => fakeUser;
      userRepositoryMock.findByEmail = async () => null;
    },

    mockEmailConflict: () => {
      userRepositoryMock.findByCpf = async () => null;
      userRepositoryMock.findByEmail = async () => fakeUser;
    },

    mockGetUsersSuccess: () => {
      userRepositoryMock.getAllUsers = async () => ({
        data: [fakeUser],
        pagination: { total: 1 }
      });
    },

    mockGetUsersEmpty: () => {
      userRepositoryMock.getAllUsers = async () => ({
        data: [],
        pagination: { total: 0 }
      });
    },

    mockGetUserByIdSuccess: () => {
      userRepositoryMock.findByID = async () => fakeUser;
    },

    mockGetUserByIdNotFound: () => {
      userRepositoryMock.findByID = async () => null;
    },

    mockUpdateSuccess: () => {
      userRepositoryMock.findByID = async () => fakeUser;
      userRepositoryMock.findByCpf = async () => null;
      userRepositoryMock.findByEmail = async () => null;
      userRepositoryMock.update = async () => fakeUser;
    },

    mockUpdateCpfConflict: () => {
      userRepositoryMock.findByID = async () => ({ 
        ...fakeUser, 
        cpf: "11111111111" // CPF original diferente
      });
      userRepositoryMock.findByCpf = async (cpf: string) => {
        if (cpf === "12345678900") return fakeUser2; // Retorna outro usuário com mesmo CPF
        return null;
      };
      userRepositoryMock.findByEmail = async () => null;
    },

    mockDeleteSuccess: () => {
      userRepositoryMock.findByID = async () => fakeUser;
      userRepositoryMock.delete = async () => true;
    },

    mockDeleteNotFound: () => {
      userRepositoryMock.findByID = async () => null;
    }
  };

  beforeEach(() => {
    userRepositoryMock = {
      findByCpf: async () => null,
      findByEmail: async () => null,
      create: async () => fakeUser,
      findByID: async () => fakeUser,
      update: async () => fakeUser,
      delete: async () => true,
      getAllUsers: async () => ({
        data: [fakeUser],
        pagination: { total: 1 }
      })
    };

    userService = new UserService(userRepositoryMock);
  });

  it("deve criar um usuário com sucesso", async () => {
    mockConfigurations.mockCreateSuccess();
    
    const result = await userService.createUser({
      name: "João",
      email: "joao@email.com",
      password: "123456",
      cpf: "12345678900",
      telefone: "999999999"
    });

    expect(result).to.deep.equal(fakeUser);
  });

  it("deve lançar erro se CPF já existir", async () => {
    mockConfigurations.mockCpfConflict();

    try {
      await userService.createUser({
        name: "João",
        email: "joao@email.com",
        password: "123456",
        cpf: "12345678900",
        telefone: "999999999"
      });
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(ConflictError);
    }
  });

  it("deve lançar erro se email já existir", async () => {
    mockConfigurations.mockEmailConflict();

    try {
      await userService.createUser({
        name: "João",
        email: "joao@email.com",
        password: "123456",
        cpf: "12345678900",
        telefone: "999999999"
      });
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(ConflictError);
    }
  });

  it("deve retornar lista de usuários", async () => {
    mockConfigurations.mockGetUsersSuccess();

    const result = await userService.getUsers();

    expect(result).to.have.property("data");
    expect(result.data).to.be.an("array");
    expect(result.data.length).to.equal(1);
  });

  it("deve lançar erro se não houver usuários", async () => {
    mockConfigurations.mockGetUsersEmpty();

    try {
      await userService.getUsers();
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(NotFoundError);
    }
  });

  it("deve retornar usuário por ID", async () => {
    mockConfigurations.mockGetUserByIdSuccess();

    const user = await userService.getUserByID(validUUID);
    expect(user).to.deep.equal(fakeUser);
  });

  it("deve lançar erro se usuário não existir", async () => {
    mockConfigurations.mockGetUserByIdNotFound();

    try {
      await userService.getUserByID(validUUID);
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(NotFoundError);
    }
  });

  it("deve atualizar usuário com sucesso", async () => {
    mockConfigurations.mockUpdateSuccess();

    const updated = await userService.updateUserByID(validUUID, {
      name: "João Atualizado",
      email: "joao@email.com",
      password: "123456",
      cpf: "12345678900",
      telefone: "999999999"
    });

    expect(updated).to.deep.equal(fakeUser);
  });

  it("deve lançar erro ao atualizar usuário com cpf existente", async () => {
    mockConfigurations.mockUpdateCpfConflict();

    try {
      await userService.updateUserByID(validUUID, {
        name: "João Atualizado",
        email: "joao1@email.com",
        password: "123456",
        cpf: "12345678900", // Tenta mudar para CPF que já existe
        telefone: "999999999"
      });
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(ConflictError);
    }
  });

  it("deve deletar usuário com sucesso", async () => {
    mockConfigurations.mockDeleteSuccess();

    const result = await userService.deleteUser(validUUID);
    expect(result.message).to.equal("Usuário deletado com sucesso");
  });

  it("deve lançar erro ao deletar usuário inexistente", async () => {
    mockConfigurations.mockDeleteNotFound();

    try {
      await userService.deleteUser(validUUID);
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(NotFoundError);
    }
  });
});