const express = require('express');
const validator = require('validator');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/orcamentos
 * Cria um novo orçamento (público - sem autenticação)
 * Body: { nome, email, mensagem }
 */
router.post('/', (req, res) => {
  try {
    const { nome, email, mensagem } = req.body;

    // Validação de entrada
    if (!nome || !email || !mensagem) {
      return res.status(400).json({
        erro: 'Nome, email e mensagem são obrigatórios'
      });
    }

    // Validar email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        erro: 'Email inválido'
      });
    }

    // Validar comprimento dos campos
    const nomeClean = validator.trim(String(nome)).substring(0, 255);
    const emailClean = validator.normalizeEmail(email);
    const mensagemClean = validator.trim(String(mensagem)).substring(0, 2000);

    if (!nomeClean || !mensagemClean) {
      return res.status(400).json({
        erro: 'Nome e mensagem não podem estar vazios'
      });
    }

    db.run(
      `INSERT INTO orcamentos (nome, email, mensagem) 
       VALUES (?, ?, ?)`,
      [nomeClean, emailClean, mensagemClean],
      function (err) {
        if (err) {
          console.error('Erro ao salvar orçamento:', err);
          return res.status(500).json({
            erro: 'Erro ao salvar orçamento'
          });
        }

        res.status(201).json({
          message: 'Orçamento recebido com sucesso',
          id: this.lastID
        });
      }
    );

  } catch (error) {
    console.error('Erro ao processar orçamento:', error);
    res.status(500).json({ erro: 'Erro ao processar orçamento' });
  }
});

/**
 * GET /api/orcamentos
 * Lista todos os orçamentos (apenas admin autenticado)
 */
router.get('/', auth, (req, res) => {
  try {
    db.all(
      `SELECT id, nome, email, mensagem, lido, data 
       FROM orcamentos 
       ORDER BY data DESC 
       LIMIT 1000`,
      [],
      (err, rows) => {
        if (err) {
          console.error('Erro ao buscar orçamentos:', err);
          return res.status(500).json({
            erro: 'Erro ao buscar orçamentos'
          });
        }

        res.json({
          total: rows.length,
          orcamentos: rows || []
        });
      }
    );

  } catch (error) {
    console.error('Erro ao listar orçamentos:', error);
    res.status(500).json({ erro: 'Erro ao listar orçamentos' });
  }
});

/**
 * GET /api/orcamentos/:id
 * Obtém um orçamento específico (apenas admin)
 */
router.get('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!validator.isInt(String(id))) {
      return res.status(400).json({
        erro: 'ID inválido'
      });
    }

    db.get(
      `SELECT * FROM orcamentos WHERE id = ?`,
      [id],
      (err, orcamento) => {
        if (err) {
          console.error('Erro ao buscar orçamento:', err);
          return res.status(500).json({
            erro: 'Erro ao buscar orçamento'
          });
        }

        if (!orcamento) {
          return res.status(404).json({
            erro: 'Orçamento não encontrado'
          });
        }

        res.json(orcamento);
      }
    );

  } catch (error) {
    console.error('Erro ao obter orçamento:', error);
    res.status(500).json({ erro: 'Erro ao obter orçamento' });
  }
});

/**
 * PATCH /api/orcamentos/:id/marcar-lido
 * Marca um orçamento como lido (apenas admin)
 */
router.patch('/:id/marcar-lido', auth, (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isInt(String(id))) {
      return res.status(400).json({
        erro: 'ID inválido'
      });
    }

    db.run(
      `UPDATE orcamentos SET lido = 1 WHERE id = ?`,
      [id],
      function (err) {
        if (err) {
          console.error('Erro ao atualizar orçamento:', err);
          return res.status(500).json({
            erro: 'Erro ao atualizar orçamento'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            erro: 'Orçamento não encontrado'
          });
        }

        res.json({
          message: 'Orçamento marcado como lido'
        });
      }
    );

  } catch (error) {
    console.error('Erro ao atualizar orçamento:', error);
    res.status(500).json({ erro: 'Erro ao atualizar orçamento' });
  }
});

/**
 * DELETE /api/orcamentos/:id
 * Deleta um orçamento (apenas admin)
 */
router.delete('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isInt(String(id))) {
      return res.status(400).json({
        erro: 'ID inválido'
      });
    }

    db.run(
      `DELETE FROM orcamentos WHERE id = ?`,
      [id],
      function (err) {
        if (err) {
          console.error('Erro ao deletar orçamento:', err);
          return res.status(500).json({
            erro: 'Erro ao deletar orçamento'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            erro: 'Orçamento não encontrado'
          });
        }

        res.json({
          message: 'Orçamento deletado com sucesso'
        });
      }
    );

  } catch (error) {
    console.error('Erro ao deletar orçamento:', error);
    res.status(500).json({ erro: 'Erro ao deletar orçamento' });
  }
});

module.exports = router;

