import { z } from "zod";
import { ValidationError } from "../errors/AppError";

// Constantes de validação
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 200;
const MIN_PRICE = 0;
const MAX_PRICE = 99999999.99;

// Schema para criação de produto
export const createProductSchema = z.object({
    name: z
        .string("Nome do produto é obrigatório")
        .min(MIN_NAME_LENGTH, `Nome deve ter pelo menos ${MIN_NAME_LENGTH} caracteres`)
        .max(MAX_NAME_LENGTH, `Nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres`)
        .trim(),
    description: z
        .string("Descrição deve ser uma string")
        .trim()
        .optional(),
    price: z
        .number("Preço é obrigatório")
        .positive("Preço deve ser um valor positivo")
        .max(MAX_PRICE, `Preço deve ser no máximo ${MAX_PRICE}`)
        .refine((val) => {
            // Valida se tem no máximo 2 casas decimais
            const decimalPlaces = (val.toString().split('.')[1] || '').length;
            return decimalPlaces <= 2;
        }, {
            message: "Preço deve ter no máximo 2 casas decimais"
        }),
    categoryId: z
        .number("ID da categoria é obrigatório")
        .int("ID da categoria deve ser um número inteiro")
        .positive("ID da categoria deve ser um número positivo")
});

// Schema para atualização de produto
export const updateProductSchema = z.object({
    name: z
        .string("Nome deve ser uma string")
        .min(MIN_NAME_LENGTH, `Nome deve ter pelo menos ${MIN_NAME_LENGTH} caracteres`)
        .max(MAX_NAME_LENGTH, `Nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres`)
        .trim()
        .optional(),
    description: z
        .union([
            z.string("Descrição deve ser uma string ou null")
                .trim(),
            z.null()
        ])
        .optional()
        .transform((val) => val === undefined ? undefined : val),
    price: z
        .number("Preço deve ser um número")
        .positive("Preço deve ser um valor positivo")
        .max(MAX_PRICE, `Preço deve ser no máximo ${MAX_PRICE}`)
        .refine((val) => {
            const decimalPlaces = (val.toString().split('.')[1] || '').length;
            return decimalPlaces <= 2;
        }, {
            message: "Preço deve ter no máximo 2 casas decimais"
        })
        .optional(),
    categoryId: z
        .number("ID da categoria deve ser um número")
        .int("ID da categoria deve ser um número inteiro")
        .positive("ID da categoria deve ser um número positivo")
        .optional(),
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
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

