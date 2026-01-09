/**
 * Script para envio de orçamentos via EmailJS
 * Complementa a requisição à API do backend
 */

// Usar a função apiFetch de config.js
document.getElementById("formOrcamento")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const mensagem = document.getElementById("mensagem")?.value.trim();

  // Validação básica
  if (!nome || !email || !mensagem) {
    alert("Por favor, preencha todos os campos");
    return;
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Email inválido");
    return;
  }

  // Desabilitar botão durante envio
  const button = this.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Enviando...";

  try {
    // Enviar para o backend
    const response = await apiFetch('/api/orcamentos', {
      method: 'POST',
      body: JSON.stringify({ nome, email, mensagem })
    });

    if (!response.ok) {
      const errorMsg = response.error?.erro || "Erro ao enviar orçamento";
      alert(errorMsg);
      return;
    }

    // Também enviar email via EmailJS
    try {
      await emailjs.send(
        CONFIG.EMAILJS.SERVICE_ID,
        CONFIG.EMAILJS.TEMPLATE_ID,
        {
          nome,
          email,
          mensagem
        }
      );
    } catch (emailError) {
      console.warn('Aviso: Orçamento salvo mas email não foi enviado', emailError);
    }

    alert("✅ Orçamento enviado com sucesso! Entraremos em contato em breve.");
    this.reset();

  } catch (error) {
    console.error('Erro ao enviar orçamento:', error);
    alert("Erro ao enviar orçamento. Tente novamente.");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});


