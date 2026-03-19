import { User, UserAttributes } from './../models/User';
import { PaginationResult, QueryParams } from "../types/pagination";

export interface IUserRepository{
    create(userData: Omit<UserAttributes, 'id'>): Promise<User>;
    findByCpf(cpf: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByID(id: string): Promise<User | null>;
    getAllUsers(queryParams?: QueryParams): Promise<PaginationResult<User>>;
    update(id: string, userData: Partial<UserAttributes>): Promise<User | null>;
    delete(id: string): Promise<boolean>;
}