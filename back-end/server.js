const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensagem: "Backend Totem Fitness Brasil funcionando!",
    });
});

const PORT = 3000;

app.post("/respostas", (req, res) => {
const { name, gym_name, email, phone, is_client } = req.body;
    try {
        const stmt = db.prepare(`
            INSERT INTO respostas (name, gym_name, email, phone, is_client)
            VALUES (?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            name,
            gym_name,
            email,
            phone,
            is_client
        );

        res.status(201).json({
            mensagem: "Resposta salva com sucesso!",
            id: result.lastInsertRowid
        });
    } catch (error) {
        console.error("Erro ao salvar resposta:", error);

        res.status(500).json({
            mensagem: "Erro ao salvar resposta."
        });
    }
});

app.get("/respostas", (req, res) => {
    try {
        const respostas = db
            .prepare("SELECT * FROM respostas ORDER BY id DESC")
            .all();

        res.json(respostas);
    } catch (error) {
        console.error("Erro ao buscar respostas:", error);

        res.status(500).json({
            mensagem: "Erro ao buscar respostas."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});