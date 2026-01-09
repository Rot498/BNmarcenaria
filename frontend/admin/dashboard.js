/**
 * Admin Dashboard Script
 * Carrega e exibe orçamentos recebidos
 */

// Verificar autenticação
function verificarAutenticacao() {
  const token = localStorage.getItem(CONFIG.TOKEN_KEY);
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Carregar orçamentos
async function carregarOrcamentos() {
  try {
    const result = await apiFetch('/api/orcamentos');

    if (result.status === 401) {
      // Token expirou
      localStorage.removeItem(CONFIG.TOKEN_KEY);
      window.location.href = 'login.html';
      return;
    }

    if (!result.ok) {
      const errorMsg = result.error?.erro || "Erro ao carregar orçamentos";
      console.error(errorMsg);
      document.querySelector('#tabelaOrcamentos tbody').innerHTML = 
        `<tr><td colspan="5" class="text-center text-danger">❌ ${errorMsg}</td></tr>`;
      return;
    }

    const tbody = document.querySelector('#tabelaOrcamentos tbody');
    const orcamentos = result.data?.orcamentos || [];

    if (orcamentos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted">
            Nenhum orçamento recebido ainda
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = '';

    orcamentos.forEach(o => {
      const data = new Date(o.data);
      const dataFormatada = data.toLocaleString('pt-BR');
      
      const tr = document.createElement('tr');
      tr.className = o.lido ? '' : 'table-warning';
      tr.innerHTML = `
        <td><strong>${escapeHtml(o.nome)}</strong></td>
        <td><a href="mailto:${escapeHtml(o.email)}">${escapeHtml(o.email)}</a></td>
        <td>${escapeHtml(o.mensagem.substring(0, 50))}...</td>
        <td>${dataFormatada}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="verDetalhes(${o.id})">Detalhes</button>
          <button class="btn btn-sm btn-danger" onclick="deletarOrcamento(${o.id})">Deletar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error('Erro ao carregar orçamentos:', error);
    document.querySelector('#tabelaOrcamentos tbody').innerHTML = 
      `<tr><td colspan="5" class="text-center text-danger">❌ Erro ao carregar dados</td></tr>`;
  }
}

// Função auxiliar para escapar HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Ver detalhes de um orçamento
async function verDetalhes(id) {
  try {
    const result = await apiFetch(`/api/orcamentos/${id}`);

    if (!result.ok) {
      alert("Erro ao carregar detalhes");
      return;
    }

    const o = result.data;
    const data = new Date(o.data);
    const dataFormatada = data.toLocaleString('pt-BR');

    alert(`
📋 DETALHES DO ORÇAMENTO

👤 Nome: ${o.nome}
📧 Email: ${o.email}
📅 Data: ${dataFormatada}

💬 Mensagem:
${o.mensagem}
    `.trim());

    // Marcar como lido
    if (!o.lido) {
      await apiFetch(`/api/orcamentos/${id}/marcar-lido`, { method: 'PATCH' });
      carregarOrcamentos();
    }

  } catch (error) {
    console.error('Erro ao carregar detalhes:', error);
    alert("Erro ao carregar detalhes do orçamento");
  }
}

// Deletar orçamento
async function deletarOrcamento(id) {
  if (!confirm("Tem certeza que deseja deletar este orçamento?")) {
    return;
  }

  try {
    const result = await apiFetch(`/api/orcamentos/${id}`, { method: 'DELETE' });

    if (result.ok) {
      alert("✅ Orçamento deletado com sucesso");
      carregarOrcamentos();
    } else {
      const errorMsg = result.error?.erro || "Erro ao deletar";
      alert(`❌ ${errorMsg}`);
    }

  } catch (error) {
    console.error('Erro ao deletar orçamento:', error);
    alert("Erro ao deletar orçamento");
  }
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  if (confirm("Tem certeza que deseja sair?")) {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    window.location.href = 'login.html';
  }
});

// Inicializar ao carregar a página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (verificarAutenticacao()) {
      carregarOrcamentos();
      // Recarregar a cada 30 segundos
      setInterval(carregarOrcamentos, 30000);
    }
  });
} else {
  if (verificarAutenticacao()) {
    carregarOrcamentos();
    setInterval(carregarOrcamentos, 30000);
  }
}

