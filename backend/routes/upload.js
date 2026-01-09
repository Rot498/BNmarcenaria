const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

const router = express.Router();

// Configuração de upload
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Gerar nome seguro: timestamp + hash + extensão original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `upload-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Validar tipo MIME
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return cb(new Error('Tipo de arquivo não permitido'));
  }

  // Validar extensão
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new Error('Extensão de arquivo não permitida'));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

/**
 * POST /api/upload
 * Faz upload de uma imagem (apenas admin autenticado)
 * Retorna: { arquivo: "filename", url: "/uploads/filename" }
 */
router.post('/', auth, upload.single('imagem'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        erro: 'Nenhum arquivo foi enviado'
      });
    }

    res.status(201).json({
      message: 'Arquivo enviado com sucesso',
      arquivo: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      size: req.file.size
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({
      erro: error.message || 'Erro ao fazer upload'
    });
  }
});

// Error handler para multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        erro: 'Arquivo muito grande (máximo 5MB)'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        erro: 'Campo de arquivo inválido'
      });
    }
  }

  if (error) {
    return res.status(400).json({
      erro: error.message || 'Erro ao fazer upload'
    });
  }

  next();
});

module.exports = router;

