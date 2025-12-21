(function(){
  emailjs.init("dr71B8m72SYL17nde");
})();

document.getElementById("formOrcamento").addEventListener("submit", function(e){
  e.preventDefault();

  emailjs.send("service_r9dq5iz", "template_5f5ya5v", {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    mensagem: document.getElementById("mensagem").value
  }).then(() => {
    alert("Orçamento enviado com sucesso!");
    this.reset();
  }).catch(() => {
    alert("Erro ao enviar. Tente novamente.");
  });
});

