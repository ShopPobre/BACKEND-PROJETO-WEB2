import { z } from "zod";
import { ValidationError } from "../errors/AppError";

// Constantes de validação
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 9999;

// Schema para criação de item do pedido
export const createOrderItemSchema = z.object({
    productId: z
        .number("ID do produto é obrigatório")
        .int("ID do produto deve ser um número inteiro")
        .positive("ID do produto deve ser um número positivo"),
    quantity: z
        .number("Quantidade é obrigatória")
        .int("Quantidade deve ser um número inteiro")
        .min(MIN_QUANTITY, `Quantidade deve ser no mínimo ${MIN_QUANTITY}`)
        .max(MAX_QUANTITY, `Quantidade deve ser no máximo ${MAX_QUANTITY}`)
});

// Schema para criação de pedido
export const createOrderSchema = z.object({
    userId: z
        .string("ID do usuário é obrigatório")
        .uuid("ID do usuário deve ser um UUID válido"),
    addressId: z
        .string("ID do endereço é obrigatório")
        .uuid("ID do endereço deve ser um UUID válido"),
    items: z
        .array(createOrderItemSchema, {
            message: "Items é obrigatório e deve ser um array"
        })
        .min(1, "O pedido deve ter pelo menos um item")
});

// Schema para atualização de pedido
export const updateOrderSchema = z.object({
    status: z
        .enum(["PENDENTE", "CONFIRMADO", "EM_PREPARACAO", "ENVIADO", "ENTREGUE", "CANCELADO"], {
            message: "Status deve ser um dos valores: PENDENTE, CONFIRMADO, EM_PREPARACAO, ENVIADO, ENTREGUE, CANCELADO"
        })
        .optional(),
    addressId: z
        .string("ID do endereço deve ser um UUID válido")
        .uuid("ID do endereço deve ser um UUID válido")
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
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;

