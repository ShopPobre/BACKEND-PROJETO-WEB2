import { expect } from 'chai';
const { UserService } = require("../../src/services/UserService");
const { ConflictError, NotFoundError } = require("../../src/errors/AppError");

describe("UserService", () => {

  let userRepositoryMock: any;
  let userService: any;

  const validUUID = "550e8400-e29b-41d4-a716-446655440000";

  const fakeUser = {
    id: validUUID,
    name: "João",
    email: "joao@email.com",
    cpf: "12345678900",
    telefone: "999999999"
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
        pagination: {
          total: 1
        }
      })
    };

    userService = new UserService(userRepositoryMock);
  });

  it("deve criar um usuário com sucesso", async () => {
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
    userRepositoryMock.findByCpf = async () => fakeUser;

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
    userRepositoryMock.findByEmail = async () => fakeUser;

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
    const result = await userService.getUsers();

    expect(result).to.have.property("data");
    expect(result.data).to.be.an("array");
    expect(result.data.length).to.equal(1);
  });

  it("deve lançar erro se não houver usuários", async () => {
    userRepositoryMock.getAllUsers = async () => ({
      data: [],
      pagination: { total: 0 }
    });

    try {
      await userService.getUsers();
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(NotFoundError);
    }
  });

  it("deve retornar usuário por ID", async () => {
    const user = await userService.getUserByID(validUUID);
    expect(user).to.deep.equal(fakeUser);
  });

  it("deve lançar erro se usuário não existir", async () => {
    userRepositoryMock.findByID = async () => null;

    try {
      await userService.getUserByID(validUUID);
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(NotFoundError);
    }
  });

  it("deve atualizar usuário com sucesso", async () => {
    const updated = await userService.updateUserByID(validUUID, {
      name: "João Atualizado",
      email: "joao@email.com",
      password: "123456",
      cpf: "12345678900",
      telefone: "999999999"
    });

    expect(updated).to.deep.equal(fakeUser);
  });

  it("deve deletar usuário com sucesso", async () => {
    const result = await userService.deleteUser(validUUID);
    expect(result.message).to.equal("Usuário deletado com sucesso");
  });

  it("deve lançar erro ao deletar usuário inexistente", async () => {
    userRepositoryMock.findByID = async () => null;

    try {
      await userService.deleteUser(validUUID);
      throw new Error("Teste falhou");
    } catch (error: any) {
      expect(error).to.be.instanceOf(NotFoundError);
    }
  });

});
