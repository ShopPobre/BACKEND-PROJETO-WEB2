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

    static async getAll(req: Request, res: Response){
        try {
            const users = await userService.getAll();
            return res.status(200).json(users);
        } catch (error: any) {
            return res.status(error.status || 500).json({
                message: error.message,
                errors: error.errors || null,
            });
        }
    }

    static async getByID(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const users = await userService.getByID(id);
            return res.status(200).json(users);
        } catch (error: any) {
            return res.status(error.status || 500).json({
                message: error.message,
                errors: error.errors || null,
            });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const users = await userService.update(id, req.body);
            return res.status(200).json(users);
        } catch (error: any) {
            return res.status(error.status || 500).json({
                message: error.message,
                errors: error.errors || null,
            });
        }
    }

     static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await userService.delete(id);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(error.status || 500).json({
                message: error.message,
                errors: error.errors || null,
            });
        }
    }

}


