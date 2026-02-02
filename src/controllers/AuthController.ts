import { AuthRequestDTO } from './../dto/AuthDTO';
import { AuthService } from "../services/AuthService";
import { Request, Response } from "express"
import { AuthMapper } from '../mappers/AuthMapper';

export class AuthController {


    constructor(private authService: AuthService) {}

    async login(req: Request, res: Response){
        try {
            const authData: AuthRequestDTO = req.body
            const token = await this.authService.login(authData);
            const response = AuthMapper.toDTO(token);
            return res.status(200).json(response);
        } catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao fazer login", error: error.message });
        }
        
    }
}