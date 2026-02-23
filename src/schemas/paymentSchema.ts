import { z } from "zod";
import { ValidationError } from "../errors/AppError";

export const createPaymentSchema = z.object({
  orderId: z
    .number("orderId é obrigatório")
    .int("orderId deve ser um número inteiro")
    .positive("orderId deve ser um número positivo"),
  method: z.enum(["CREDIT_CARD", "PIX"], {
    message: "method deve ser CREDIT_CARD ou PIX",
  }),
});

export const paymentIdParamSchema = z
  .string()
  .refine(
    (val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num > 0;
    },
    { message: "ID do pagamento deve ser um número positivo válido" }
  )
  .transform((val) => parseInt(val, 10));

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export function validatePaymentId(id: unknown): number {
  if (typeof id === "number") {
    if (isNaN(id) || id <= 0) {
      throw new ValidationError("ID do pagamento deve ser um número positivo válido");
    }
    return id;
  }
  try {
    return paymentIdParamSchema.parse(String(id));
  } catch (error) {
    if (error instanceof z.ZodError) {
      const first = error.issues[0];
      throw new ValidationError(first?.message ?? "ID inválido");
    }
    throw error;
  }
}

export function validateCreatePayment(data: unknown): CreatePaymentInput {
  try {
    return createPaymentSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const first = error.issues[0];
      throw new ValidationError(first?.message ?? "Dados de pagamento inválidos");
    }
    throw error;
  }
}