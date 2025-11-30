import { UserRequestDTO } from "../Dto/UserDTO/UserRequestDTO";
import { User } from "../models/User";

export class UserRepository {


  async create(name: string, email: string, password: string, cpf: string, telefone: string) {
    const user = await User.create({
      name,
      email,
      password,
      cpf,
      telefone
    });

    return user;
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