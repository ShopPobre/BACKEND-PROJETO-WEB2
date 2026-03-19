import { AddressType } from "../models/Address";

export interface AddressRequestDTO {

        rua: string,
        numero: number,
        cep: string,
        cidade: string,
        estado: string,
        tipo: AddressType
        
}

export interface AddressResponseDTO {
    
    id: string,
    rua: string,
    numero: number,
    cep: string,
    cidade: string,
    estado: string,
    tipo: AddressType

}