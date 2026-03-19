import { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService";
import {
  validateCreatePayment,
  validatePaymentId,
} from "../schemas/paymentSchema";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  async create(req: Request, res: Response) {
    const paymentData = validateCreatePayment(req.body);
    const result = await this.paymentService.createPayment(paymentData);
    return res.status(201).json(result);
  }

  async getById(req: Request, res: Response) {
    const id = validatePaymentId(req.params.id);
    const payment = await this.paymentService.getPaymentById(id);
    return res.status(200).json(payment);
  }

  async getClientSecretByOrderId(req: Request, res: Response) {
    const orderId = Number(req.params.orderId);
    if (!Number.isInteger(orderId) || orderId < 1) {
      return res.status(422).json({ error: "orderId inválido" });
    }
    const userId = (req as any).user?.sub;
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }
    const result =
      await this.paymentService.getClientSecretByOrderId(orderId, userId);
    if (!result) {
      return res.status(404).json({
        error: "Pagamento não encontrado ou pedido já processado",
      });
    }
    return res.status(200).json(result);
  }
}
