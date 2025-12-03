import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import userRoutes from "./routes/userRoutes";


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

app.use("/api/users", userRoutes);

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
            console.log(`📍 Users API: http://localhost:${PORT}/api/categories`);
        });
    } catch (error) {
        console.error("❌ Erro ao iniciar servidor:", error);
        process.exit(1);
    }
};

startServer();

export default app;
