import { AuthResponseDTO } from "../dto/AuthDTO";

export class AuthMapper {

    static toDTO(token: any): AuthResponseDTO {
        return {
            accessToken: token
        }
    }
}