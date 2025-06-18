import React, { useState, useEffect } from 'react';
import api from '../../services/api';

// Estilos
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
const thTdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
const errorStyle = { color: 'red', backgroundColor: '#fff0f0', border: '1px solid red', padding: '15px', borderRadius: '5px' };

function RelatorioVendas() {
  const [dadosVendas, setDadosVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRelatorioVendas() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/relatorios/vendas-mensal');
        setDadosVendas(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar relatório de vendas:", err);
        // Se o erro for 404 (Not Found), não é um erro fatal. Apenas não há dados.
        if (err.response && err.response.status === 404) {
          setDadosVendas([]); // Garante que os dados estão vazios
        } else {
          // Para outros erros (500, etc.), mostramos uma mensagem de erro real.
          setError("Ocorreu um erro inesperado ao carregar o relatório. Tente novamente mais tarde.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchRelatorioVendas();
  }, []);

  if (loading) {
    return <p>Carregando relatório de vendas...</p>;
  }

  return (
    <div>
      <h1>Relatório de Vendas Mensal</h1>
      <p>Este relatório apresenta um resumo do total de pedidos finalizados e o valor total vendido em cada mês.</p>

      {error && <p style={errorStyle}>{error}</p>}

      {!error && (
        dadosVendas.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>Mês</th>
                <th style={thTdStyle}>Total de Pedidos</th>
                <th style={thTdStyle}>Total Vendido</th>
              </tr>
            </thead>
            <tbody>
              {dadosVendas.map((item) => (
                <tr key={item.mes}>
                  <td style={thTdStyle}>
                    {new Date(item.mes).toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
                  </td>
                  <td style={thTdStyle}>{item.total_pedidos}</td>
                  <td style={thTdStyle}>
                    {parseFloat(item.total_vendido).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum dado de venda finalizada encontrado para exibir no relatório.</p>
        )
      )}
    </div>
  );
}

export default RelatorioVendas;
