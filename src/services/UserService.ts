import { ConflictError, NotFoundError } from './../errors/AppError';
import { 
    createUpdateUserSchema,
    validateID,
    validateWithZod
} from './../schemas/userSchema';
import { IUserRepository } from './../interfaces/IUserRepository';
import { UserRepository } from "../repository/UserRepository";
import { UserRequestDTO } from '../dto/UserDTO';
import { User } from '../models/User';

const userRepository = new UserRepository(); 

export class UserService {

    constructor(private userRepository: IUserRepository) {}

    async createUser(data: UserRequestDTO): Promise<User> {

        const validateData = validateWithZod(createUpdateUserSchema, data);
        
        const existingCPF = await this.userRepository.findByCpf(validateData.cpf);
        if (existingCPF) {
            throw new ConflictError('Usuario com este cpf já existe');
        }

        const existingEmail = await this.userRepository.findByEmail(validateData.email);
        if(existingEmail){
            throw new ConflictError('Usuario com este email já existe');
        }

        return await this.userRepository.create({
            name: validateData.name,
            email: validateData.email,
            password: validateData.password,
            cpf: validateData.cpf,
            telefone: validateData.telefone
        });
     }

    async getUsers(queryParams?: any) {
        const result = await this.userRepository.getAllUsers(queryParams);

        if (result.data.length === 0 && result.pagination.total === 0) {
            throw new NotFoundError("Nenhum usuário encontrado");
        }

        return result;
    }

    async getUserByID(id: string): Promise<User> {
        const validateId = validateID(id);
        const user = await userRepository.findByID(validateId);

        if(!user){
            throw new NotFoundError("Nenhum usuário encontrado");
        }

        return user;
    }

    async updateUserByID(id: string, data: UserRequestDTO): Promise<User> {
        const validateId = validateID(id);
        const validateData = validateWithZod(createUpdateUserSchema, data);
        
        const user = await this.userRepository.findByID(validateId);
         if(!user){
            throw new NotFoundError("Nenhum usuário encontrado");
        }

        const existingCPF = await this.userRepository.findByCpf(validateData.cpf);
        if(existingCPF){
            if(existingCPF.id !== validateId) {
                throw new ConflictError('Usuario com este cpf já existe');
            }
        } 

        const existingEmail = await this.userRepository.findByEmail(validateData.email);
        if(existingEmail){
            if(existingEmail.id !== validateId) {
                throw new ConflictError('Usuario com este email já existe');
            }
        } 

        const updateUser = await this.userRepository.update(validateId, validateData);

        if(!updateUser) {
            throw new NotFoundError('Erro ao atualizar usuario');
        }

        return updateUser;


    }

    async deleteUser(id: string) {

        const validateId = validateID(id);

        const user = await this.userRepository.findByID(validateId);

        if(!user){
             throw new NotFoundError('Nenhum usuário encontrado');
        }

        const deleted = await this.userRepository.delete(validateId);
        if(!deleted) {
            throw new NotFoundError('Erro ao deletar usuario');
        }

        return { message: "Usuário deletado com sucesso" };
    }
  
}
