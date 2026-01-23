import jwtConfig from '../config/jwt';
import jwt from "jsonwebtoken";
import { AuthRequestDTO } from '../dto/AuthDTO';
import { NotFoundError, UnauthorizedError } from '../errors/AppError';
import { IHashingService } from '../interfaces/hashing/IHashingService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { 
    validateWithZod,
    loginSchema 
} from '../schemas/authSchema';



export class AuthService {

    constructor(
        private userRepository: IUserRepository,
        private hashingService: IHashingService
    ) {}

    //TROCAR RETORNO
    async login(data: AuthRequestDTO) {
        const validateData = validateWithZod(loginSchema, data);
        const user = await this.userRepository.findByEmail(validateData.email)
        if(!user){
            throw new NotFoundError("Nenhum usuário encontrado com esse email");
        }

        
        const passwordIsValid = await this.hashingService.compare(validateData.password, user.passwordHash);
        if(!passwordIsValid) {
            throw new UnauthorizedError('Senha Inválida');
        }

        //ADD ROLE
        const accessToken = jwt.sign(
            {
                sub: user.id,
                name: user.name
            },
            jwtConfig.secret as string,
            {
                audience: jwtConfig.audience,
                issuer: jwtConfig.issuer,
                expiresIn: jwtConfig.jwtTtl
            }
        );

        return accessToken;
    }

}