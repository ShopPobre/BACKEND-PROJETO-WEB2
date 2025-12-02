import "reflect-metadata";
import express from 'express';
import userRouter from './routes/UserRouter';
import sequelize from "./config/database";

const app = express();

app.use(express.json());
app.use(userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express está rodando na porta ${PORT}`);
});

//sequelize.sync({ alter: true })
    //.then(() => console.log("Tabelas sincronizadas"))
    //.catch(err => console.error("Erro ao sincronizar:", err));

sequelize.sync({ force: true })
    .then(() => console.log("Tabelas sincronizadas"))
    .catch(err => console.error("Erro ao sincronizar:", err));