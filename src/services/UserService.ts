import { UserRepository } from './../repository/UserRepository';
import { ConflictError, NotFoundError } from './../errors/AppError';
import { 
    createUpdateUserSchema,
    validateWithZod
} from './../schemas/userSchema';
import { IUserRepository } from './../interfaces/IUserRepository';
import { plainToInstance } from "class-transformer";
import { UserRequestDTO } from "../Dto/UserDTO/UserRequestDTO";
import { UserResponseDTO } from "../Dto/UserDTO/UserResponseDTO";
import { UserRepository } from "../repository/UserRepository";
import { validate } from "class-validator";
import { NotFoundUserException } from "../exceptions/UserException/NotFoundUserException";
import { UserAlreadyExistsException } from "../exceptions/UserException/UserAlreadyExistsException";

const userRepository = new UserRepository(); 

export class UserService {

    constructor(private userRepository: IUserRepository) {}

    async createUser(data: UserRequestDTO): Promise<User> {

        const validateData = validateWithZod(createUpdateUserSchema, data);
        
        let existing = await this.userRepository.findByCPF(validateData.cpf);
        if (existing) {
            throw new ConflictError('Usuario com este cpf já existe');
        }

        existing = await this.userRepository.findByEmail(validateData.email);
        if(existing){
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

    async getUsers(): Promise<User[]> {

        const users = await userRepository.getAllUsers();

        if (users.length == 0) {
            throw new NotFoundError("Nenhum usuário encontrado");
        }

        return users;
    }

    async getUserByID(id: string): Promise<User> {
        const validateID = validateID(id);
        const user = await userRepository.findByID(validateID);

        if(!user){
            throw new NotFoundError("Nenhum usuário encontrado");
        }

        return user;
    }

    async updateUserByID(id: string, data: UserRequestDTO): Promise<User> {
        const validateID = validateID(id);
        const validateData = validateWithZod(createUpdateUserSchema, data);
        
        const user = await this.userRepository.findByID(validateID);
         if(!user){
            throw new NotFoundError("Nenhum usuário encontrado");
        }

        const existingCPF = await this.userRepository.findByCPF(validateData.cpf);
        if(existingCPF){
            if(existingCPF.id !== validateData.id) {
                throw new ConflictError('Usuario com este cpf já existe');
            }
        } 

        const existingEmail = await this.userRepository.findByCPF(validateData.email);
        if(existingEmail){
            if(existingEmail.id !== validateData.id) {
                throw new ConflictError('Usuario com este email já existe');
            }
        } 

        const updateUser = await this.userRepository.update(validateID, validateData);

        if(!updateUser) {
            throw new NotFoundError('Erro ao atualizar usuario');
        }

        return updateUser;


    }

    async delete(id: string) {

        const validateID = validateID(id);

        const user = await this.userRepository.findByID(validateID);

        if(!user){
             throw new NotFoundError('Nenhum usuário encontrado');
        }

        const deleted = await this.userRepository.delete(validateID);
        if(!deleted) {
            throw new NotFoundError('Erro ao deletar usuario');
        }
    }
  
}
