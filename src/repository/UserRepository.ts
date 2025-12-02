import { User } from "../models/User";

export class UserRepository {

  async create(userData: any) {
    return await User.create(
      {
        ...userData
      }
    );
  }

  async getAllUsers() {
    return await User.findAll()
  }

  async findByEmail(email: string){
    const user = await User.findOne({ where: { email } });
    return user;
  }

  async findByCPF(cpf: string){
    const user = await User.findOne({ where: { cpf } });
    return user;
  }

  async findByID(id: string){
    const user = await User.findByPk(id);
    return user;
  }

  async update(id: string, data: any) {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.update(data);
    return user;
  }

  async delete(id: string) {
    const deleted = await User.destroy({ where: { id } });
    return deleted > 0;
  }



}