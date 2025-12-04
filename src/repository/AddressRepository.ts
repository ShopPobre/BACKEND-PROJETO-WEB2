import { IAddressRepository } from "../interfaces/IAddressRepository";
import { Address } from "../models";

export class AddressRepository implements IAddressRepository{

    async create(data: any): Promise<Address> {
        const address = await Address.create(data);
        return address;
    }

    async getAllAddresses(userID: string): Promise<Address[]> {
        const addresses = await Address.findAll({
        where: { userID }
        });

        return addresses;
    }

    async findByID(id: string): Promise<Address | null> {
        return await Address.findByPk(id);
    }

    async update(id: string, data: any): Promise<Address> {
        const address = await Address.findByPk(id);

        if (!address) {
        throw new Error("Address not found");
        }

        await address.update(data);
        return address;
    }

    async delete(id: string): Promise<boolean> {
        const deletedCount = await Address.destroy({
        where: { id }
        });

        return deletedCount > 0;
    }
    

    
}