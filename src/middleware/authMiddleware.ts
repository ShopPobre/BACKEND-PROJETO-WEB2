import { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../errors/AppError";
import { verifyToken } from "../utils/auth";

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {

    const token = extractTokenFromHeader(req);

    if(!token) {
        throw new UnauthorizedError('Access denied. No token provided.');
    }

    try {
        const decoded = verifyToken(token);
        (req as any).user = decoded; 
        next();
    } catch (err) {
        throw new BadRequestError('Invalid token.');
    }
    
}

export function extractTokenFromHeader(req: Request): string | undefined {
    const authorization = req.headers?.authorization;
    console.log(authorization)

    if (!authorization || typeof authorization !== 'string') {
        return;
    }

    return authorization.split(' ')[1];
}
