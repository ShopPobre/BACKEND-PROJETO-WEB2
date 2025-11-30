import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserRequestDTO {
    
  @IsString()
  @IsNotEmpty({ message: "O nome é um campo obrigatório." })
  public name!: string;

  @IsEmail({}, { message: "O email deve ter um formato válido (ex: seu@dominio.com)." })
  public email!: string;

  @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres." })
  @IsNotEmpty({ message: "A senha é obrigatória." })
  public password!: string;
}
