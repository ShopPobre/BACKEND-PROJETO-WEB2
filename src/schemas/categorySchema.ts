import { z } from "zod";
import { ValidationError } from "../errors/AppError";

// Constantes de validação
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

// Schema para criação de categoria
export const createCategorySchema = z.object({
    name: z
        .string("Nome da categoria é obrigatório")
        .min(MIN_NAME_LENGTH, `Nome deve ter pelo menos ${MIN_NAME_LENGTH} caracteres`)
        .max(MAX_NAME_LENGTH, `Nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres`)
        .trim(),
    description: z
        .string("Descrição deve ser uma string")
        .max(MAX_DESCRIPTION_LENGTH, `Descrição deve ter no máximo ${MAX_DESCRIPTION_LENGTH} caracteres`)
        .trim()
        .optional()
});

// Schema para atualização de categoria
export const updateCategorySchema = z.object({
    name: z
        .string("Nome deve ser uma string")
        .min(MIN_NAME_LENGTH, `Nome deve ter pelo menos ${MIN_NAME_LENGTH} caracteres`)
        .max(MAX_NAME_LENGTH, `Nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres`)
        .trim()
        .optional(),
    description: z
        .union([
            z.string("Descrição deve ser uma string ou null")
                .max(MAX_DESCRIPTION_LENGTH, `Descrição deve ter no máximo ${MAX_DESCRIPTION_LENGTH} caracteres`)
                .trim(),
            z.null()
        ])
        .optional()
        .transform((val) => val === undefined ? undefined : val),
    isActive: z
        .boolean("isActive deve ser um valor booleano")
        .optional()
});

// Schema para validação de ID (string)
export const idParamSchema = z
    .string()
    .refine(
        (val) => {
            const num = parseInt(val, 10);
            return !isNaN(num) && num > 0;
        },
        {
            message: "ID deve ser um número positivo válido"
        }
    )
    .transform((val) => parseInt(val, 10));

// Função helper para validar ID (pode ser string ou number)
export function validateId(id: unknown): number {
    // Se já for number, valida diretamente
    if (typeof id === 'number') {
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('ID deve ser um número positivo válido');
        }
        return id;
    }

    // Se for string, usa o schema Zod
    return validateWithZod(idParamSchema, String(id));
}

// Função helper para formatar erros do Zod
export function formatZodError(error: z.ZodError): string {
    const firstError = error.issues[0];
    return firstError?.message || "Erro de validação";
}

// Função helper para validar e lançar ValidationError se necessário
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

// Tipos inferidos dos schemas
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

