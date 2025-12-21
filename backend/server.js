const express = require('express');
const cors = require('cors');

require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ROTAS
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orcamentos', require('./routes/orcamentos'));
app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

