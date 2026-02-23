import { Payment, PaymentAttributes } from "../models/Payment";

export interface IPaymentRepository {
  create(
    data: Omit<PaymentAttributes, "id" | "createdAt" | "updatedAt">
  ): Promise<Payment>;

  findById(id: number): Promise<Payment | null>;

  findByTransactionId(transactionId: string): Promise<Payment | null>;

  update(
    id: number,
    data: Partial<PaymentAttributes>
  ): Promise<Payment | null>;
}
