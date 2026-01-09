/**
 * Script para formulário de orçamento
 * Requer: config.js
 */

document.getElementById('formOrcamento')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const mensagem = document.getElementById('mensagem')?.value.trim();

  // Validação
  if (!nome || !email || !mensagem) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Email inválido');
    return;
  }

  // Validar tamanho
  if (mensagem.length > 2000) {
    alert('Mensagem muito longa (máximo 2000 caracteres)');
    return;
  }

  const button = this.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Enviando...";

  try {
    const result = await apiFetch('/api/orcamentos', {
      method: 'POST',
      body: JSON.stringify({ nome, email, mensagem })
    });

    if (result.ok) {
      alert('✅ Orçamento enviado com sucesso! Entraremos em contato em breve.');
      this.reset();
    } else {
      const errorMsg = result.error?.erro || 'Erro ao enviar orçamento';
      alert(`❌ ${errorMsg}`);
    }

  } catch (error) {
    console.error('Erro ao enviar orçamento:', error);
    alert('❌ Erro de conexão com o servidor. Tente novamente.');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});

