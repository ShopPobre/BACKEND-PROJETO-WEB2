import { ConflictError, NotFoundError } from './../errors/AppError';
import { 
    updateUserSchema,
    createUserSchema,
    validateID,
    validateWithZod
} from './../schemas/userSchema';
import { IUserRepository } from './../interfaces/IUserRepository';
import { UserRepository } from "../repository/UserRepository";
import { UserRequestDTO, UserUpdateRequestDTO } from '../dto/UserDTO';
import { User } from '../models/User';
import { IHashingService } from '../interfaces/hashing/IHashingService';

const userRepository = new UserRepository(); 

export class UserService {

    constructor(
        private userRepository: IUserRepository,
        private hashingService: IHashingService
    ) {}

    async createUser(data: UserRequestDTO): Promise<User> {

        const validateData = validateWithZod(createUserSchema, data);
        
        const existingCPF = await this.userRepository.findByCpf(validateData.cpf);
        if (existingCPF) {
            throw new ConflictError('Usuario com este cpf já existe');
        }

        const existingEmail = await this.userRepository.findByEmail(validateData.email);
        if(existingEmail){
            throw new ConflictError('Usuario com este email já existe');
        }

        const passwordHash = await this.hashingService.hash(validateData.password);

        return await this.userRepository.create({
            name: validateData.name,
            email: validateData.email,
            passwordHash,
            cpf: validateData.cpf,
            telefone: validateData.telefone,
            role: 'USER'
        });
     }

    async getUsers(): Promise<User[]> {

        const users = await userRepository.getAllUsers();

        if (users.length == 0) {
            throw new NotFoundError("Nenhum usuário encontrado");
        }

        return users;
    }

    async getUserByID(id: string): Promise<User> {
        const validateId = validateID(id);
        const user = await userRepository.findByID(validateId);

        if(!user){
            throw new NotFoundError("Nenhum usuário encontrado");
        }

        return user;
    }

    async updateUserByID(id: string, data: UserUpdateRequestDTO): Promise<User> {
        const validateId = validateID(id);
        const validateData = validateWithZod(updateUserSchema, data);
        
        const user = await this.userRepository.findByID(validateId);
         if(!user){
            throw new NotFoundError("Nenhum usuário encontrado");
        }

        if(validateData?.cpf) {
            const existingCPF = await this.userRepository.findByCpf(validateData.cpf);
            if(existingCPF){
                if(existingCPF.id !== validateId) {
                    throw new ConflictError('Usuario com este cpf já existe');
                }
            }
        }

        if(validateData?.email){
            const existingEmail = await this.userRepository.findByEmail(validateData.email);
            if(existingEmail){
                if(existingEmail.id !== validateId) {
                    throw new ConflictError('Usuario com este email já existe');
                }
            } 
        }

        if (validateData?.password){
            const passwordHash = await this.hashingService.hash(validateData.password);
            validateData.password = passwordHash;
        }

        const updateUser = await this.userRepository.update(validateId, {
            name: validateData?.name,
            email: validateData?.email,
            passwordHash: validateData?.password,
            cpf: validateData?.cpf,
            telefone: validateData?.telefone
        });

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
