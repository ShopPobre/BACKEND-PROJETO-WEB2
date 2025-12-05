import { User, UserAttributes } from './../models/User';
export interface IUserRepository{
    create(userData: Omit<UserAttributes, 'id'>): Promise<User>;
    findByCpf(cpf: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByID(id: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    update(id: string, userData: Partial<UserAttributes>): Promise<User | null>;
    delete(id: string): Promise<boolean>;
}