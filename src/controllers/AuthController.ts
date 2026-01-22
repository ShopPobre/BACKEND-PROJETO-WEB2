import { AuthRequestDTO } from './../dto/AuthDTO';
import { AuthService } from "../services/AuthService";
import { Request, Response } from "express"

export class AuthController {


    constructor(private authService: AuthService) {}

    async login(req: Request, res: Response){
        try {
            const authData: AuthRequestDTO = req.body
            return this.authService.login(authData);
        } catch (error: any) {
            return res
            .status(500)
            .json({ message: "Erro ao fazer login", error: error.message });
        }
        
    }
}