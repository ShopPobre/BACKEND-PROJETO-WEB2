"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const swagger_1 = require("./config/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
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
app.use("/api/categories", categoryRoutes_1.default);
// Error handler middleware (deve ser o último)
app.use(errorHandler_1.errorHandler);
// Inicializar servidor
const startServer = async () => {
    try {
        // Testar conexão com banco de dados
        await database_1.default.authenticate();
        console.log("✅ Conexão com banco de dados estabelecida com sucesso.");
        // Sincronizar modelos (apenas em desenvolvimento)
        if (process.env.NODE_ENV !== "production") {
            await database_1.default.sync({ alter: true });
            console.log("✅ Modelos sincronizados com o banco de dados.");
        }
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📍 Health check: http://localhost:${PORT}/health`);
            console.log(`📍 Categories API: http://localhost:${PORT}/api/categories`);
            console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
        });
    }
    catch (error) {
        console.error("❌ Erro ao iniciar servidor:", error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
