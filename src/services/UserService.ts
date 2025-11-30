import { plainToInstance } from "class-transformer";
import { UserRequestDTO } from "../Dto/UserDTO/UserRequestDTO";
import { UserRepository } from "../repository/UserRepository";
import { validate } from "class-validator";
import { NotFoundUsersException } from "../exceptions/NotFoundUsersException";

const userRepository = new UserRepository(); 

export class UserService {

     async createUser(data: UserRequestDTO) {

        const dto = plainToInstance(UserRequestDTO, data);

        const errors = await validate(dto);

         if (errors.length > 0) {
            const errorMessages = errors
            .map(err => Object.values(err.constraints || {}))
            .flat();

            const validationError: any = new Error("Erros de validação");
            validationError.status = 400;
            validationError.errors = errorMessages;
            throw validationError;
        }

        const { name, email, password } = dto;

        const user = await userRepository.create(
            name,
            email,
            password,
        );
 
        return user;


     }

     async getAll() {
        const users = await userRepository.getAllUsers();

        if (!users || users.length === 0) {
            throw new NotFoundUsersException("Nenhum usuário encontrado");
        }

        return users;
    }

  
}
