const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const db = require('../db');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_seguro';
const TOKEN_EXPIRY = '2h';

/**
 * POST /api/auth/login
 * Autentica um admin e retorna um JWT
 */
router.post('/login', (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação de entrada
    if (!email || !senha) {
      return res.status(400).json({ 
        erro: 'Email e senha são obrigatórios' 
      });
    }

    // Validar email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        erro: 'Email inválido' 
      });
    }

    // Validar tamanho da senha
    if (senha.length < 3) {
      return res.status(400).json({ 
        erro: 'Senha inválida' 
      });
    }

    db.get(
      'SELECT * FROM admins WHERE email = ?',
      [email.toLowerCase()],
      async (err, admin) => {
        if (err) {
          console.error('Erro ao buscar admin:', err);
          return res.status(500).json({ erro: 'Erro no servidor' });
        }

        if (!admin) {
          return res.status(401).json({ 
            erro: 'Email ou senha incorretos' 
          });
        }

        // Comparar senha com hash
        const senhaValida = await bcrypt.compare(senha, admin.senha);
        
        if (!senhaValida) {
          return res.status(401).json({ 
            erro: 'Email ou senha incorretos' 
          });
        }

        // Gerar JWT
        const token = jwt.sign(
          { 
            id: admin.id, 
            email: admin.email,
            iat: Math.floor(Date.now() / 1000)
          },
          JWT_SECRET,
          { expiresIn: TOKEN_EXPIRY }
        );

        res.json({ 
          token,
          expiresIn: TOKEN_EXPIRY
        });
      }
    );

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

module.exports = router;

