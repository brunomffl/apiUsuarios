import express from "express";

//teste de servidor:
const PORT = 3333;

const app = express();

app.use(express.json());

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))