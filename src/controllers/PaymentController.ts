import { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService";
import { validateCreatePayment, validatePaymentId } from "../schemas/paymentSchema";

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
}
