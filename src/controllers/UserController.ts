import { UserResponseDTO } from './../Dto/UserDTO/UserResponseDTO';
import { UserMapper } from './../mappers/UserMapper';
import { UserRequestDTO } from './../Dto/UserDTO/UserRequestDTO';
import { UserService } from './../services/UserService';
import { validateID } from './../mappers/UserMapper'
import { Request, Response } from "express"

export class UserController {

    constructor(private userService: UserService) {}

    static async createUser(req: Request, res: Response): Promise<void>{

        const userData: UserRequestDTO = req.body;
        const user = await this.userService.createUser(userData);
        const response = UserMapper.toDTO(user);
        res.status(201).json(response);
    }

    static async getUSers(req: Request, res: Response): Promise<void> {
        const users = await this.userService.getUsers();
        const response = UserMapper.toDTOArray(users);
        res.status(200).json(response);
    }

    static async getUserByID(req: Request, res: Response): Promise<void> {
        const id = validateID(req.params.id);
        //DO VALIDATE ID
        const user = await this.userService.getUserByID(id);
        const response = UserMapper.toDTO(user);
        res.status(200).json(response);
    }

    static async updateUser(req: Request, res: Response): Promise<void> {
        const id = validateID(req.params.id);
        const userData: UserResponseDTO = req.body;
        const user = await this.userService.updateUserByID(id, userData);
        const response = UserMapper.toDTO(user);
        res.status(200).json(response);
    }

     static async deleteUser(req: Request, res: Response): Promise<void> {
        const id = validateID(req.params.id);
        await this.userService.deleteUser(id); //TROCAR PARA TER RETORNO
        res.status(204).send();
    }

}


