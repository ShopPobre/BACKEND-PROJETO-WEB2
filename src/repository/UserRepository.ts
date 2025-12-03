import { IUserRepository } from './../interfaces/IUserRepository';
import { User } from "../models/User";

export class UserRepository implements IUserRepository {

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

  async getAllUsers() {
    try {
      return await User.findAll()
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