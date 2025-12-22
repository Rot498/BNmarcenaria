const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'login.html';
}

fetch('https://bnmarcenaria.onrender.com/api/orcamentos', {
  headers: {
    Authorization: 'Bearer ' + token
  }
})
.then(res => {
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
  return res.json();
})
.then(dados => {
  const tbody = document.querySelector('#tabelaOrcamentos tbody');

  if (dados.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center">Nenhum orçamento</td></tr>`;
    return;
  }

  dados.forEach(o => {
    tbody.innerHTML += `
      <tr>
        <td>${o.nome}</td>
        <td>${o.email}</td>
        <td>${o.mensagem}</td>
        <td>${new Date(o.data).toLocaleString()}</td>
      </tr>
    `;
  });
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});
