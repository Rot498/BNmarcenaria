const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

// Usa .env ou valor padrão
const dbPath = process.env.DATABASE_PATH || './db.sqlite';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err.message);
  } else {
    console.log('✅ Banco de dados conectado');
  }
});

db.serialize(async () => {
  // Tabela de orçamentos
  db.run(`
    CREATE TABLE IF NOT EXISTS orcamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      mensagem TEXT NOT NULL,
      lido INTEGER DEFAULT 0,
      data DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela orcamentos:', err);
    else console.log('✅ Tabela orcamentos pronta');
  });

  // Tabela de admins com hash de senha
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, async (err) => {
    if (err) {
      console.error('Erro ao criar tabela admins:', err);
      return;
    }
    console.log('✅ Tabela admins pronta');

    // Cria admin padrão (apenas uma vez)
    const senhaHash = await bcrypt.hash('admin123', 10);
    db.run(
      `INSERT OR IGNORE INTO admins (email, senha) VALUES (?, ?)`,
      ['admin@bnmarcenaria.com', senhaHash],
      (err) => {
        if (err) {
          console.error('Erro ao inserir admin:', err);
        } else {
          console.log('✅ Admin padrão criado (admin@bnmarcenaria.com / admin123)');
        }
      }
    );
  });
});

module.exports = db;

