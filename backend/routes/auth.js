const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

const JWT_SECRET = 'segredo_super_seguro'; // depois pode ir para .env

router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha obrigatórios' });
  }

  db.get(
    'SELECT * FROM admins WHERE email = ? AND senha = ?',
    [email, senha],
    (err, admin) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro no servidor' });
      }

      if (!admin) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email },
        JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.json({ token });
    }
  );
});

module.exports = router;
