const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const ADMIN = {
  email: 'admin@admin.com',
  senha: '123456'
};

const JWT_SECRET = 'segredo_super_seguro';

router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (email !== ADMIN.email || senha !== ADMIN.senha) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { email },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({ token });
});

module.exports = router;
