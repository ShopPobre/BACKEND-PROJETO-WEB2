import { IPaymentRepository } from "../interfaces/IPaymentRepository";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { StripeGateway } from "./gateways/StripeGateway";
import { AppError, NotFoundError } from "../errors/AppError";
import { CreatePaymentDTO } from "../dto/PaymentDTO";

export class PaymentService {
  constructor(
    private paymentRepository: IPaymentRepository,
    private orderRepository: IOrderRepository,
    private stripeGateway: StripeGateway
  ) {}

  async createPayment(data: CreatePaymentDTO) {
    const { orderId, method } = data;

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundError("Pedido não encontrado");
    }

    if (order.status !== "PENDENTE") {
      throw new AppError("Pedido já processado", 400);
    }

    const amountInCents = Math.round(Number(order.total) * 100);

    const paymentIntent =
      await this.stripeGateway.createPaymentIntent(
        amountInCents,
        method
      );

    await this.paymentRepository.create({
      orderId,
      amount: amountInCents,
      currency: "brl",
      method,
      status: "PENDING",
      transactionId: paymentIntent.id,
      gateway: "stripe",
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async confirmPayment(transactionId: string) {
    const payment =
      await this.paymentRepository.findByTransactionId(transactionId);

    if (!payment) return;

    await this.paymentRepository.update(payment.id, {
      status: "APPROVED",
    });

    await this.orderRepository.update(payment.orderId, {
      status: "CONFIRMADO",
    });
  }

  async getPaymentById(id: number) {
    const payment = await this.paymentRepository.findById(id);

    if (!payment) {
      throw new NotFoundError("Pagamento não encontrado");
    }

    return payment;
  }

  /** Retorna clientSecret para um pedido PENDING do usuário (para recuperar na tela de checkout) */
  async getClientSecretByOrderId(
    orderId: number,
    userId: string
  ): Promise<{ clientSecret: string; orderTotal: number } | null> {
    const order = await this.orderRepository.findById(orderId);
    if (!order || order.userId !== userId) {
      return null;
    }
    const payment = await this.paymentRepository.findByOrderId(orderId);
    if (
      !payment ||
      payment.status !== "PENDING" ||
      !payment.transactionId
    ) {
      return null;
    }
    const pi = await this.stripeGateway.retrievePaymentIntent(
      payment.transactionId
    );
    if (!pi?.client_secret) return null;
    return {
      clientSecret: pi.client_secret,
      orderTotal: Number(order.total),
    };
  }
}
