const fetchData = async () => {
  try {
    const [resumo, tipos, incidentes] = await Promise.all([
      fetch('http://localhost:3000/resumo_geral').then(res => res.json()),
      fetch('http://localhost:3000/tipos_ataques').then(res => res.json()),
      fetch('http://localhost:3000/incidentes_recentes').then(res => res.json())
    ]);

    document.getElementById('totalAtaques').textContent = resumo.total_ataques;
    document.getElementById('alertasCriticos').textContent = resumo.alertas_criticos;
    document.getElementById('ultimaAtualizacao').textContent = new Date(resumo.ultima_atualizacao).toLocaleString('pt-BR');

    const tabela = document.getElementById('tabelaIncidentes');
    incidentes.forEach(incidente => {
      const row = `
        <tr>
          <td>${incidente.data}</td>
          <td>${incidente.tipo}</td>
          <td>${incidente.status}</td>
        </tr>
      `;
      tabela.innerHTML += row;
    });

    const ctx = document.getElementById('graficoAtaques').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: tipos.map(t => t.tipo),
        datasets: [{
          data: tipos.map(t => t.quantidade),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

  } catch (error) {
    console.error('Erro ao carregar os dados:', error);
  }
};

fetchData();
  