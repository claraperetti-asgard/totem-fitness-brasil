const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
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

// ================================
// SALVAR RESPOSTA
// ================================
app.post("/respostas", (req, res) => {
    const {
        name,
        gym_name,
        email,
        phone,
        is_client
    } = req.body;

    try {
        const stmt = db.prepare(`
            INSERT INTO respostas (
                name,
                gym_name,
                email,
                phone,
                is_client
            )
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

// ================================
// LISTAR RESPOSTAS
// ================================
app.get("/respostas", (req, res) => {
    try {
        const respostas = db
            .prepare(`
                SELECT *
                FROM respostas
                ORDER BY id DESC
            `)
            .all();

        res.json(respostas);

    } catch (error) {
        console.error("Erro ao buscar respostas:", error);

        res.status(500).json({
            mensagem: "Erro ao buscar respostas."
        });
    }
});

// ================================
// EXPORTAR PARA EXCEL
// ================================
app.get("/respostas/exportar", (req, res) => {
    try {
        const respostas = db
            .prepare(`
                SELECT
                    id,
                    name,
                    gym_name,
                    email,
                    phone,
                    is_client,
                    criado_em
                FROM respostas
                ORDER BY id ASC
            `)
            .all();

        if (respostas.length === 0) {
            return res.status(404).json({
                mensagem: "Nenhuma resposta cadastrada para exportar.",
            });
        }

        const dadosExcel = respostas.map((resposta) => ({
            ID: resposta.id,
            Nome: resposta.name,
            "Nome da Academia": resposta.gym_name,
            Email: resposta.email,
            Telefone: resposta.phone,
            "É cliente?":
                resposta.is_client === 1
                    ? "SIM"
                    : resposta.is_client === 0
                        ? "NÃO"
                        : "",
            "Data de cadastro": resposta.criado_em,
        }));

        // Cria a planilha
        const worksheet = XLSX.utils.json_to_sheet(dadosExcel);

        // Cria o arquivo Excel
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Participantes"
        );

        // Gera o arquivo XLSX em memória
        const arquivo = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });

        // Define o download
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="participantes.xlsx"'
        );

        res.send(arquivo);

    } catch (error) {
        console.error("Erro ao exportar respostas:", error);

        res.status(500).json({
            mensagem: "Erro ao exportar respostas.",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});