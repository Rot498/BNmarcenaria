require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

require('./db');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// Rotas da API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orcamentos', require('./routes/orcamentos'));
app.use('/api/upload', require('./routes/upload'));

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err.message);
  res.status(err.status || 500).json({
    erro: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 API rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}\n`);
});


