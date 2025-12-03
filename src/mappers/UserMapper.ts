import { UserResponseDTO } from './../Dto/UserDTO/UserResponseDTO';
import { User } from './../models/User';
export class UserMapper {

    static toDTO(user: User): UserResponseDTO {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            telefone: user.telefone
        }
    }

    static toDTOArray(users: User[]): UserResponseDTO[] {
        return users.map(user => this.toDTO(user));
    } 
}