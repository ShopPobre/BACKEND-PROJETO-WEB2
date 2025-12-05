import { z } from "zod";
import { ValidationError } from "../errors/AppError";

export const idParamSchema = z.string().uuid({
    message: "ID deve ser um UUID válido"
});

export const addressSchema = z.object({
    rua: z
        .string({ message: "A rua é obrigatória." })
        .min(1, { message: "A rua é obrigatória." }),

    numero: z
        .number({ message: "O número deve ser um número." })
        .int({ message: "O número deve ser inteiro." })
        .positive({ message: "O número deve ser positivo." }),

    cep: z
        .string({ message: "O CEP é obrigatório." })
        .regex(/^\d{5}-?\d{3}$/, { message: "O CEP deve estar no formato 00000-000." }),

    cidade: z
        .string({ message: "A cidade é obrigatória." })
        .min(1, { message: "A cidade é obrigatória." }),

    estado: z
        .string({ message: "O estado é obrigatório." })
        .min(2, { message: "O estado deve ter no mínimo 2 caracteres." }),

    tipo: z.enum(["CASA", "TRABALHO", "OUTRO"], {
        message: "O tipo deve ser CASA, TRABALHO ou OUTRO."
    })
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