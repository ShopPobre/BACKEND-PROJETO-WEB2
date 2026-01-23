import dotenv from "dotenv";

dotenv.config();

const jwtConfig = {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    jwtTtl: Number(process.env.JWT_TTL ?? '3600')

};

export default jwtConfig;