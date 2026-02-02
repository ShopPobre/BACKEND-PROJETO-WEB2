import { Address, AddressAttributes } from "../models/Address";
import { PaginationResult, QueryParams } from "../types/pagination";

export interface IAddressRepository {
    create(addressData: Omit<AddressAttributes, 'id'>): Promise<Address>;
    findByID(id: string): Promise<Address | null>;
    getAllAddresses(id: string, queryParams?: QueryParams): Promise<PaginationResult<Address>>;
    update(id: string, addressData: Partial<AddressAttributes>): Promise<Address>;
    delete(id: string): Promise<boolean>;
}