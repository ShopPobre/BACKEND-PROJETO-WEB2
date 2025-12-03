import { UserMapper } from './../mappers/UserMapper';
import { UserService } from './../services/UserService';
import { Request, Response } from "express"
import { UserRequestDTO } from '../dto/UserDTO/UserDTO';
import { validateID } from '../schemas/userSchema';

export class UserController {

    constructor(private userService: UserService) {}

    async createUser(req: Request, res: Response) {
        try {
            const userData: UserRequestDTO = req.body;
            const user = await this.userService.createUser(userData);
            const response = UserMapper.toDTO(user);
            return res.status(201).json(response);
        }  catch (error: any) {
            console.error(error);
            return res
            .status(500)
            .json({ message: "Erro ao retornar os usuários", error: error.message });
        }
      
    }

    async getUsers(req: Request, res: Response) {
        try {
            const users = await this.userService.getUsers();
            const response = UserMapper.toDTOArray(users);
            return res.status(200).json(response);
        } catch (error: any) {
            console.error(error);
            return res
            .status(500)
            .json({ message: "Erro ao retornar os usuários", error: error.message });
        }
    }

    async getUserByID(req: Request, res: Response) {
        try {
            const id = validateID(req.params.id);
            const user = await this.userService.getUserByID(id);
            const response = UserMapper.toDTO(user);
            return res.status(200).json(response);
        } catch (error: any) {
            console.error(error);
            return res
            .status(500)
            .json({ message: "Erro ao retornar o usuário", error: error.message });
        }

    }

    async updateUser(req: Request, res: Response) {
        try {
            const id = validateID(req.params.id);
            const userData: UserRequestDTO = req.body;
            const user = await this.userService.updateUserByID(id, userData);
            const response = UserMapper.toDTO(user);
            return res.status(200).json(response);
        } catch (error: any) {
            console.error(error);
            return res
            .status(500)
            .json({ message: "Erro ao atualizar o usuário", error: error.message });
        }

    }

    async deleteUser(req: Request, res: Response) {
        try {
            const id = validateID(req.params.id);
            await this.userService.deleteUser(id); 
            return res.status(204).send();
        } catch (error: any) {
            console.error(error);
            return res
            .status(500)
            .json({ message: "Erro ao deletar o usuário", error: error.message });
        }
       
    }

}


