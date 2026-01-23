import { NextFunction, Request } from "express";
import { UnauthorizedError } from "../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwtConfig from "../config/jwt";

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {

    const token = extractTokenFromHeader(req);

    if(!token) {
        throw new UnauthorizedError('Não logado!');
    }

    try {
        console.log('JWT SECRET:', jwtConfig.secret);
        const payload = await jwt.verify(token, jwtConfig.secret, {
            algorithms: ['HS512']
        });
        
        console.log(payload);
            
    } catch (error) {
        console.log(error);
    }

    return true;
}

export function extractTokenFromHeader(req: Request): string | undefined {
    const authorization = req.headers?.authorization;
    console.log(authorization)

    if (!authorization || typeof authorization !== 'string') {
        return;
    }

    return authorization.split(' ')[1];
}
