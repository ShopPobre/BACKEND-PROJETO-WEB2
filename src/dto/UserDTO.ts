export interface UserRequestDTO {

    name: string;
    email: string;
    password: string;
    cpf: string;
    telefone: string;

}

export interface UserResponseDTO {

    id: string;
    name: string;
    email: string;
    cpf: string;
    telefone: string;
    
}