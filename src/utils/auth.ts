import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import jwtConfig from '../config/jwt';

dotenv.config();

export const generateToken = (userId: string, username: string, role: string): string => {
  return jwt.sign(
            {
                sub: userId,
                name: username,
                role: role,
            },
            jwtConfig.secret as string,
            {
                audience: jwtConfig.audience,
                issuer: jwtConfig.issuer,
                expiresIn: jwtConfig.jwtTtl
            }
        );
};

// Função para verificar um token JWT

export const verifyToken = (token: string): any => {
  return jwt.verify(token, jwtConfig.secret);
};
