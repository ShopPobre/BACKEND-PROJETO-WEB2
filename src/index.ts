import "./config/env";
import express, { Express, NextFunction, Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import addressRoutes from "./routes/addressRoutes";
import swaggerUi from "swagger-ui-express";
import sequelize from "./config/database";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { swaggerSpec } from "./config/swagger";
import inventoryRoutes from "./routes/inventoryRoutes";
import orderRoutes from "./routes/orderRoutes";
import { defaultRateLimiter } from "./middleware/rateLimiter";
import authRoutes from "./routes/authRoutes";
import { ensureBucket } from "./config/minio";
import "./models/index";
import { ensureAdminExists } from "./config/ensureAdmin";
import paymentRoutes from "./routes/paymentRoutes";
import { PaymentService } from "./services/PaymentService";
import { StripeGateway } from "./services/gateways/StripeGateway";

import { PaymentRepository } from "./repository/PaymentRepository";
import { OrderRepository } from "./repository/OrderRepository";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      console.error("❌ Stripe webhook: signature ou STRIPE_WEBHOOK_SECRET ausente");
      res.status(400).send("Webhook configuration error");
      return;
    }

    const paymentRepository = new PaymentRepository();
    const orderRepository = new OrderRepository();
    const stripeGateway = new StripeGateway();
    const paymentService = new PaymentService(
      paymentRepository,
      orderRepository,
      stripeGateway
    );

    try {
      const event = stripeGateway.constructWebhookEvent(
        req.body,
        signature,
        webhookSecret
      );

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as { id: string };
        await paymentService.confirmPayment(paymentIntent.id);
      }

      res.status(200).json({ received: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Stripe webhook error:", message);
      res.status(400).send(`Webhook error: ${message}`);
    }
  }
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS básico para permitir o frontend em localhost:4200
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Rate Limiting - aplicar globalmente
app.use(defaultRateLimiter.middleware());

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check do servidor
 *     description: Verifica se o servidor está funcionando corretamente
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor está funcionando
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *             example:
 *               status: "OK"
 *               message: "Server is running"
 */
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "ShopPobre API Documentation",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        tryItOutEnabled: true
    }
}));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/users/:userId/addresses", addressRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory/:productId", inventoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
// Error handler middleware (deve ser o último)
app.use(errorHandler);



// Inicializar servidor
const startServer = async () => {
    try {
        // Testar conexão com banco de dados
        await sequelize.authenticate();
        console.log("✅ Conexão com banco de dados estabelecida com sucesso.");

        // Sincronizar modelos (apenas em desenvolvimento)
        if (process.env.NODE_ENV !== "production") {
            await sequelize.sync({ alter: true });
            console.log("✅ Modelos sincronizados com o banco de dados.");
        }

        await ensureAdminExists();
        await ensureBucket();

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📍 Health check: http://localhost:${PORT}/health`);
            console.log(`📍 AUTH API: http://localhost:${PORT}/api/login`);
            console.log(`📍 Users API: http://localhost:${PORT}/api/users`);
            console.log(`📍 Addresses API: http://localhost:${PORT}/api/users/:userId/addresses`);
            console.log(`📍 Categories API: http://localhost:${PORT}/api/categories`);
            console.log(`📍 Products API: http://localhost:${PORT}/api/products`);
            console.log(`📍 Orders API: http://localhost:${PORT}/api/orders`);
            console.log(`📍 Payments API: http://localhost:${PORT}/api/payments`);
            console.log(`📍 Stripe Webhook: http://localhost:${PORT}/webhook/stripe`);
            console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error("❌ Erro ao iniciar servidor:", error);
        process.exit(1);
    }
};

startServer();

export default app;