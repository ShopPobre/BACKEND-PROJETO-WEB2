import { AddressResponseDTO } from '../dto/AddressDTO';
import { Address } from '../models';

export class AddressMapper {

    static toDTO(address: Address): AddressResponseDTO {
        return {
            id: address.id,
            rua: address.rua,
            numero: address.numero,
            cep: address.cep,
            cidade: address.cidade,
            estado: address.estado,
            tipo: address.tipo
        }
    }

    static toDTOArray(addresses: Address[]): AddressResponseDTO[] {
        return addresses.map(address => this.toDTO(address));
    } 
}