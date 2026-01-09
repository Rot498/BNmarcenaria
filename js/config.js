/**
 * Configurações do Frontend
 * Não inclua dados sensíveis aqui (como chaves de API)
 */

const CONFIG = {
  // URL base da API
  API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://bnmarcenaria.onrender.com',

  // Email.js
  EMAILJS: {
    SERVICE_ID: 'service_rac6pwb',
    TEMPLATE_ID: 'template_um6qlpu',
    PUBLIC_KEY: 'dr71B8m72SYL17nde'
  },

  // Timeouts
  FETCH_TIMEOUT: 10000, // 10 segundos
  
  // Token
  TOKEN_KEY: 'token',
  
  // WhatsApp
  WHATSAPP: '+5511933258278'
};

// Função auxiliar para fazer requisições
async function apiFetch(endpoint, options = {}) {
  const url = `${CONFIG.API_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: CONFIG.FETCH_TIMEOUT
  };

  // Adicionar token se existir
  const token = localStorage.getItem(CONFIG.TOKEN_KEY);
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT);

    const response = await fetch(url, {
      ...finalOptions,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    return {
      ok: response.ok,
      status: response.status,
      data: response.ok ? await response.json() : null,
      error: !response.ok ? await response.json().catch(() => ({ erro: 'Erro desconhecido' })) : null
    };

  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        ok: false,
        status: 0,
        data: null,
        error: { erro: 'Timeout na requisição' }
      };
    }
    return {
      ok: false,
      status: 0,
      data: null,
      error: { erro: error.message }
    };
  }
}

// Inicializar Email.js
emailjs.init(CONFIG.EMAILJS.PUBLIC_KEY);
