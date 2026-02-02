import { IUserRepository } from './../interfaces/IUserRepository';
import { User } from "../models/User";
import { QueryParams, PaginationResult, normalizePaginationParams, normalizeSortParams, createPaginationResponse } from "../types/pagination";
import { Op } from "sequelize";

export class UserRepository implements IUserRepository {
  private readonly allowedSortFields = ['name', 'email', 'cpf', 'telefone'] as const;

  async create(userData: any) {
    try {
      return await User.create(
      {
        ...userData
      }
      );
    } catch (error: any){
      throw error;
    }

  }

  async getAllUsers(queryParams?: QueryParams): Promise<PaginationResult<User>> {
    try {
      const { page, limit, offset } = normalizePaginationParams(queryParams || {});
      const { sortBy, sortOrder } = normalizeSortParams(queryParams || {}, this.allowedSortFields, 'name');

      // Construir filtros
      const where: any = {};

      // Filtro por nome (busca parcial)
      if (queryParams?.name) {
        where.name = { [Op.like]: `%${queryParams.name}%` };
      }

      // Filtro por email (busca parcial)
      if (queryParams?.email) {
        where.email = { [Op.like]: `%${queryParams.email}%` };
      }

      // Filtro por CPF (busca parcial)
      if (queryParams?.cpf) {
        where.cpf = { [Op.like]: `%${queryParams.cpf}%` };
      }

      // Contar total
      const total = await User.count({ where });

      // Buscar dados paginados
      const users = await User.findAll({
        where,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      return createPaginationResponse(users, total, page, limit);
    } catch (error: any){
      throw error;
    }
  }

  async findByEmail(email: string){
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async findByCpf(cpf: string){
    try {
      const user = await User.findOne({ where: { cpf } });
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async findByID(id: string){
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async update(id: string, data: any) {
    try {
      const user = await User.findByPk(id);
      if (!user) return null;

      await user.update(data);
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const deleted = await User.destroy({ where: { id } });
      return deleted > 0;
    } catch (error: any) {
      throw error;
    }
  }



}