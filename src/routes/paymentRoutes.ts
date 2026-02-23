import { Router, Request, Response, NextFunction } from "express";
import { PaymentController } from "../controllers/PaymentController";
import { PaymentService } from "../services/PaymentService";
import { PaymentRepository } from "../repository/PaymentRepository";
import { OrderRepository } from "../repository/OrderRepository";
import { StripeGateway } from "../services/gateways/StripeGateway";
import { asyncHandler } from "../middleware/errorHandler";
import { ensureAuthenticated } from "../middleware/authMiddleware";
import { ensureRole } from "../middleware/ensureRole";

const router = Router();

const paymentRepository = new PaymentRepository();
const orderRepository = new OrderRepository();
const stripeGateway = new StripeGateway();
const paymentService = new PaymentService(
  paymentRepository,
  orderRepository,
  stripeGateway
);
const controller = new PaymentController(paymentService);

router.post(
  "/",
  ensureAuthenticated,
  ensureRole("USER"),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await controller.create(req, res);
  })
);

router.get(
  "/:id",
  ensureAuthenticated,
  ensureRole("USER", "ADMIN"),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await controller.getById(req, res);
  })
);

export default router;
