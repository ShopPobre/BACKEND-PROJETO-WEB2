import { AddressRequestDTO } from "../dto/AddressDTO";
import { AddressMapper } from "../mappers/AddressMapper";
import { validateID } from "../schemas/userSchema";
import { AddressService } from "../services/AddressService";
import { Request, Response } from "express"

export class AddressController {

    constructor(private addressService: AddressService) {}

    async createAddress(req: Request, res: Response) {
        try {
            const userId = validateID(req.params.userId);
            const addressData: AddressRequestDTO = req.body;
            const address = await this.addressService.createAddress(userId, addressData);
            const response = AddressMapper.toDTO(address);
            return res.status(201).json(response);
        }  catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao cadastrar o endereço", error: error.message });
        }
    }

    async updateAddress(req: Request, res: Response) {
        try {
            const userId = validateID(req.params.userId);
            const addressId = validateID(req.params.addressId);
            const addressData: AddressRequestDTO = req.body;
            const address = await this.addressService.updateAddress(userId, addressId, addressData);
            const response = AddressMapper.toDTO(address);
            return res.status(200).json(response);
        }  catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao atualizar o endereço", error: error.message });
        }
    }

    async getAddresses(req: Request, res: Response) {
        try {
            const userId = validateID(req.params.userId);
            const queryParams = req.query;
            const result = await this.addressService.getAddresses(userId, queryParams);
            const response = {
                data: AddressMapper.toDTOArray(result.data),
                pagination: result.pagination
            };
            return res.status(200).json(response);
        }  catch (error: any) {
            return res
            .status(error.statusCode || 500)
            .json({ message: "Erro ao retornar os endereços", error: error.message });
        }
    }

    async deleteAddress(req: Request, res: Response) {
        try {
            const userId = validateID(req.params.userId);
            const addressId = validateID(req.params.addressId);
            const response = await this.addressService.deleteAddress(userId, addressId);
            return res.status(204).json(response);
        }  catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao deletar o endereço", error: error.message });
        }
    }
}