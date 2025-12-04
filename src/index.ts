import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { swaggerSpec } from "./config/swagger";
import inventoryRoutes from "./routes/inventoryRoutes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory/:productId", inventoryRoutes);

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

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📍 Health check: http://localhost:${PORT}/health`);
            console.log(`📍 Categories API: http://localhost:${PORT}/api/categories`);
            console.log(`📍 Products API: http://localhost:${PORT}/api/products`);
            console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error("❌ Erro ao iniciar servidor:", error);
        process.exit(1);
    }
};

startServer();

export default app;

