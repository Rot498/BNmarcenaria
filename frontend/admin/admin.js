/**
 * Admin Login Script
 * Autentica o admin e armazena token JWT
 */

document.getElementById("formAdminLogin")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = this.querySelector("input[type=email]")?.value.trim();
  const senha = this.querySelector("input[type=password]")?.value.trim();

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos");
    return;
  }

  // Desabilitar formulário durante requisição
  const button = this.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Autenticando...";

  try {
    const result = await apiFetch('/api/auth/login', {
      method: "POST",
      body: JSON.stringify({ email, senha })
    });

    if (!result.ok) {
      const errorMsg = result.error?.erro || "Falha na autenticação";
      alert(`❌ ${errorMsg}`);
      return;
    }

    // Salvar token
    localStorage.setItem(CONFIG.TOKEN_KEY, result.data.token);

    // Redirecionar para dashboard
    alert("✅ Login realizado com sucesso!");
    window.location.href = "dashboard.html";

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert("❌ Erro ao conectar com o servidor. Verifique sua conexão.");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});

