import { HttpError } from "../HttpError";

export class UserAlreadyExistsException extends HttpError {

    constructor(message: string){
        super(message, 409)
    }
}