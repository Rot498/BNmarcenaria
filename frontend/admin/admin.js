document.getElementById("formAdminLogin").addEventListener("submit", function(e) {
  e.preventDefault();

  // LOGIN TEMPORÁRIO (apenas front-end)
  const email = e.target.querySelector("input[type=email]").value;
  const senha = e.target.querySelector("input[type=password]").value;

  if (email === "admin@admin.com" && senha === "123456") {
    window.location.href = "dashboard.html";
  } else {
    alert("Usuário ou senha inválidos");
  }
});
