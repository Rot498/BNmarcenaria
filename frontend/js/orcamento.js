document.getElementById('formOrcamento').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  if (!nome || !email || !mensagem) {
    alert('Preencha todos os campos.');
    return;
  }

  try {
    const response = await fetch('https://bnmarcenaria.onrender.com/api/orcamentos', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome, email, mensagem })
    });

    if (response.ok) {
      alert('Orçamento enviado com sucesso!');
      document.getElementById('formOrcamento').reset();
    } else {
      alert('Erro ao enviar orçamento.');
    }

  } catch (error) {
    alert('Erro de conexão com o servidor.');
  }
});
