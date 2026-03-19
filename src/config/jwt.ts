import dotenv from "dotenv";

dotenv.config();


if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não definido no .env");
}

if (!process.env.JWT_TOKEN_AUDIENCE) {
  throw new Error("JWT_TOKEN_AUDIENCE não definido no .env");
}

if (!process.env.JWT_TOKEN_ISSUER) {
  throw new Error("JWT_TOKEN_ISSUER não definido no .env");
}

const jwtConfig = {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    jwtTtl: Number(process.env.JWT_TTL ?? '3600')

};

export default jwtConfig;