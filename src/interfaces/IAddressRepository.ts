import { Address, AddressAttributes } from "../models/Address";

export interface IAddressRepository {
    create(addressData: Omit<AddressAttributes, 'id'>): Promise<Address>;
    findByID(id: string): Promise<Address | null>;
    getAllAddresses(id: string): Promise<Address[]>;
    update(id: string, addressData: Partial<AddressAttributes>): Promise<Address>;
    delete(id: string): Promise<boolean>;
}