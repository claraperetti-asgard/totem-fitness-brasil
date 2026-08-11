const Database = require("better-sqlite3");

const db = new Database("./data/respostas.db");

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS respostas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        gym_name TEXT,
        email TEXT,
        phone TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

try {
    db.exec(`
        ALTER TABLE respostas
        ADD COLUMN is_client INTEGER
    `);
} catch (error) {
    // Coluna já existe
}

console.log("Banco SQLite conectado!");

module.exports = db;