import { UserService } from "../services/UserService"
import { Request, Response } from "express"

const userService = new UserService();

export class UserController {

    static async create(req: Request, res: Response) {
         try {
            const user = await userService.createUser(req.body);
            return res.status(201).json(user);
         } catch (error: any) {
            return res.status(error.status || 500).json({
            message: error.message,
            errors: error.errors || null,
            });
        }

    }

}


