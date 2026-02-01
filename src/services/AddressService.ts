
import { AddressRequestDTO } from "../dto/AddressDTO";
import { NotFoundError } from "../errors/AppError";
import { IAddressRepository } from "../interfaces/IAddressRepository";
import { IUserRepository } from "../interfaces/IUserRepository";
import { Address } from "../models/Address";
import { addressSchema, validateWithZod } from "../schemas/addressSchema";
import { validateID } from "../schemas/userSchema";

export class AddressService {

    constructor (
        private addressRepository: IAddressRepository,
        private userRepository: IUserRepository
    ) {}

    async createAddress(userID: string, data: AddressRequestDTO): Promise<Address> {
        const validateId = validateID(userID);
        const validateData = validateWithZod(addressSchema, data);
        const user = await this.userRepository.findByID(validateId);
        if(!user){
            throw new NotFoundError("Nenhum usuário encontrado");
        }

        return await this.addressRepository.create(
            {
                rua: validateData.rua,
                numero: validateData.numero,
                cep: validateData.cep,
                cidade: validateData.cidade,
                estado: validateData.estado,
                tipo: validateData.tipo,
                userID: validateId
        });
    }
    async getAddresses(userID: string): Promise<Address[]>{
        const validateId = validateID(userID);
        const user = await this.userRepository.findByID(validateId);
         if(!user){
            throw new NotFoundError("Nenhum usuário encontrado");
        }

        const addresses = await this.addressRepository.getAllAddresses(user.id);

        if(!addresses){
             throw new NotFoundError("Nenhum endereço encontrado");
        }

        return addresses;
    }
    async updateAddress(userID: string, addressID: string, data: AddressRequestDTO): Promise<Address> {
        const validateUserId = validateID(userID);
        const validateAddressId = validateID(addressID);
        const validateData = validateWithZod(addressSchema, data);

        const user = await this.userRepository.findByID(validateUserId);
        if(!user){
            throw new NotFoundError("Nenhum usuário encontrado");
        }

        const address = await this.addressRepository.findByID(validateAddressId);

        if(!address){
             throw new NotFoundError("Nenhum endereço encontrado");
        }

        const updateAdress = await this.addressRepository.update(validateAddressId, validateData);

        return updateAdress;

    }
    async deleteAddress(userID: string, addressID: string) {
        
        const validateUserId = validateID(userID);
        const validateAddressId = validateID(addressID);

        const user = await this.userRepository.findByID(validateUserId);
        if(!user){
            throw new NotFoundError("Nenhum usuário encontrado");
        }

        const address = await this.addressRepository.findByID(validateAddressId);

        if(!address){
             throw new NotFoundError("Nenhum endereço encontrado");
        }

        const deleted = await this.addressRepository.delete(addressID);
         if(!deleted) {
            throw new NotFoundError('Erro ao deletar endereço');
        }

         return { message: "Usuário deletado com sucesso" };
    }

}