import { z } from "zod";
import { ValidationError } from "../errors/AppError";

export const idParamSchema = z.string().uuid({
    message: "ID deve ser um UUID válido"
});


const MIN_PASSWORD_LENGTH = 6;
const CPF_LENGTH = 11;

export const createUserSchema = z.object({
    name: z
        .string({ message: "O nome é um campo obrigatório." })
        .min(1, { message: "O nome é um campo obrigatório." }),

    email: z
        .string({ message: "O email deve ser uma string." })
        .email({ message: "O email deve ter um formato válido (ex: seu@dominio.com)." }),

    password: z
        .string({ message: "A senha é obrigatória." })
        .min(MIN_PASSWORD_LENGTH, {
            message: `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`
        }),

    cpf: z
        .string({ message: "O cpf é obrigatóriao." })
        .length(CPF_LENGTH, {
            message: `O cpf deve ter ${CPF_LENGTH} caracteres.`
        }),

    telefone: z
        .string({ message: "O telefone deve ser uma string." })
        .refine(
            (value) => /^(\+?55)?\s?(?:\(?\d{2}\)?\s?)?(?:9\d{4}|\d{4})-?\d{4}$/.test(value),
            { message: "O telefone deve ser válido no formato brasileiro." }
        )
});


export const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(MIN_PASSWORD_LENGTH).optional(),
    cpf: z.string().length(CPF_LENGTH).optional(),
    telefone: z
        .string()
        .refine(
            (value) =>
                /^(\+?55)?\s?(?:\(?\d{2}\)?\s?)?(?:9\d{4}|\d{4})-?\d{4}$/.test(value),
            { message: "O telefone deve ser válido no formato brasileiro." }
        )
        .optional(),
});


export function validateID(id: unknown): string {
    if (id == null) {
        throw new ValidationError("ID não pode ser nulo ou indefinido");
    }

    return validateWithZod(idParamSchema, String(id));
}

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