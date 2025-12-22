document.getElementById("formAdminLogin").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = e.target.querySelector("input[type=email]").value.trim();
  const senha = e.target.querySelector("input[type=password]").value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos");
    return;
  }

  try {
    const response = await fetch("https://bnmarcenaria.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.erro || "Usuário ou senha inválidos");
      return;
    }

    // ✅ salva o token
    localStorage.setItem("token", data.token);

    // ✅ redireciona
    window.location.href = "dashboard.html";

  } catch (error) {
    alert("Erro ao conectar com o servidor");
  }
});
