import { HttpError } from "./HttpError";

export class NotFoundUsersException extends HttpError {

    constructor(message: string){
        super(message)
    }
}