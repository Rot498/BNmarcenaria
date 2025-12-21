const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// 🔓 rota pública (cliente envia orçamento)
router.post('/', (req, res) => {
  const { nome, email, mensagem } = req.body;

  db.run(
    'INSERT INTO orcamentos (nome, email, mensagem) VALUES (?, ?, ?)',
    [nome, email, mensagem],
    function (err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao salvar orçamento' });
      }
      res.sendStatus(201);
    }
  );
});

// 🔒 rota protegida (admin lista orçamentos)
router.get('/', auth, (req, res) => {
  db.all(
    'SELECT * FROM orcamentos ORDER BY data DESC',
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao buscar orçamentos' });
      }
      res.json(rows);
    }
  );
});

module.exports = router;
