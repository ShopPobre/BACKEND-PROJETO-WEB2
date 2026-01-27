import { AuthRequestDTO } from '../dto/AuthDTO';
import { NotFoundError, UnauthorizedError } from '../errors/AppError';
import { IHashingService } from '../interfaces/hashing/IHashingService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { 
    validateWithZod,
    loginSchema 
} from '../schemas/authSchema';
import { generateToken } from '../utils/auth';



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
        const accessToken = generateToken(user.id, user.name, user.role);

        return accessToken;
    }

}