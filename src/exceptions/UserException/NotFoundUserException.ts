import { HttpError } from "../HttpError";

export class NotFoundUserException extends HttpError {

    constructor(message: string){
        super(message)
    }
}