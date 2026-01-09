const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_seguro';

/**
 * Middleware de autenticação
 * Valida JWT do header Authorization
 */
module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        erro: 'Token não fornecido' 
      });
    }

    // Extrair token do formato "Bearer <token>"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ 
        erro: 'Formato de token inválido' 
      });
    }

    const token = parts[1];

    // Verificar e decodificar JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        erro: 'Token expirado' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        erro: 'Token inválido' 
      });
    }

    return res.status(401).json({ 
      erro: 'Não autorizado' 
    });
  }
};

