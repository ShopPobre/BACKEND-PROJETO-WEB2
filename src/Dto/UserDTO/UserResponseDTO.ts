import { Expose, Type } from "class-transformer";

export class UserResponseDTO {
    @Expose()
    public id!: string;
    @Expose()
    public name!: string;
    @Expose()
    public email!: string
    @Expose()
    public telefone!: string;
}