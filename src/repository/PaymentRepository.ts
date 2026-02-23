import { Payment, PaymentAttributes } from "../models/Payment";
import { IPaymentRepository } from "../interfaces/IPaymentRepository";

export class PaymentRepository implements IPaymentRepository {
  private paymentModel = Payment;

  async create(
    data: Omit<PaymentAttributes, "id" | "createdAt" | "updatedAt">
  ): Promise<Payment> {
    return this.paymentModel.create(data);
  }

  async findById(id: number): Promise<Payment | null> {
    return this.paymentModel.findByPk(id);
  }

  async findByTransactionId(transactionId: string): Promise<Payment | null> {
    return this.paymentModel.findOne({ where: { transactionId } });
  }

  async update(
    id: number,
    data: Partial<PaymentAttributes>
  ): Promise<Payment | null> {
    const payment = await this.findById(id);
    if (!payment) return null;

    await payment.update(data);
    return payment.reload();
  }
}
