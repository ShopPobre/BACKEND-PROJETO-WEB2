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


}