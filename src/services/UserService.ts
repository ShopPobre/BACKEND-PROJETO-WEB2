import { plainToInstance } from "class-transformer";
import { UserRequestDTO } from "../Dto/UserDTO/UserRequestDTO";
import { UserResponseDTO } from "../Dto/UserDTO/UserResponseDTO";
import { UserRepository } from "../repository/UserRepository";
import { validate } from "class-validator";
import { NotFoundUserException } from "../exceptions/UserException/NotFoundUserException";
import { UserAlreadyExistsException } from "../exceptions/UserException/UserAlreadyExistsException";

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

        const { name, email, password, cpf, telefone } = dto;

        if(await userRepository.findByEmail(email)){
            throw new UserAlreadyExistsException("O email informado já pertence ao um usuário")
        }
        if(await userRepository.findByCPF(cpf)){
            throw new UserAlreadyExistsException("O cpf informado já pertence ao um usuário")
        }

        const user = await userRepository.create(
            name,
            email,
            password,
            cpf,
            telefone
        );
 
        const plainUser = user.get({ plain: true });
        return plainToInstance(UserResponseDTO, plainUser, {
            excludeExtraneousValues: true,
        });
     }

     async getAll() {
        const users = await userRepository.getAllUsers();

        if (!users) {
            throw new NotFoundUserException("Nenhum usuário encontrado");
        }

        return users.map(user =>
            plainToInstance(
                UserResponseDTO,
                user.get({ plain: true }),
                { excludeExtraneousValues: true }
            )
        );
    }

    async getByCPF(cpf: string) {
        const user = await userRepository.findByCPF(cpf);

        if(!user){
            throw new NotFoundUserException("Nenhum usuário encontrado");
        }

        const plainUser = user.get({ plain: true });
        return plainToInstance(UserResponseDTO, plainUser, {
            excludeExtraneousValues: true,
        }); 
    }

  
}
