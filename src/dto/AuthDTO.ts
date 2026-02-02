export interface AuthRequestDTO {
    email: string;
    password: string;
}

export interface AuthResponseDTO {
    accessToken: string;
}