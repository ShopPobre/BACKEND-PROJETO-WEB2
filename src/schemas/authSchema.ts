import { z } from "zod";
import { ValidationError } from "../errors/AppError";


const MIN_PASSWORD_LENGTH = 6;


export const loginSchema = z.object({
    email: z
        .string({ message: "O email deve ser uma string." })
        .email({ message: "O email deve ter um formato válido (ex: seu@dominio.com)." }),
     password: z
            .string({ message: "A senha é obrigatória." })
            .min(MIN_PASSWORD_LENGTH, {
                message: `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`
            })
});

export function validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new ValidationError(formatZodError(error));
        }
        throw error;
    }
}

export function formatZodError(error: z.ZodError): string {
    const firstError = error.issues[0];
    return firstError?.message || "Erro de validação";
}