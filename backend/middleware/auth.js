const jwt = require('jsonwebtoken');

const JWT_SECRET = 'segredo_super_seguro';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};
