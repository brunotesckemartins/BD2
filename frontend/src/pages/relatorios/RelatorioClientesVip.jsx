import React, { useState, useEffect } from 'react';
import api from '../../services/api';

// Estilos
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
const thTdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
const errorStyle = { color: 'red', backgroundColor: '#fff0f0', border: '1px solid red', padding: '15px', borderRadius: '5px' };

function RelatorioClientesVip() {
  const [clientesVip, setClientesVip] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRelatorioClientesVip() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/relatorios/clientes-vip');
        setClientesVip(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar relatório de clientes VIP:", err);
        if (err.response && err.response.status === 404) {
          setClientesVip([]);
        } else {
          setError("Ocorreu um erro inesperado ao carregar o relatório. Tente novamente mais tarde.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchRelatorioClientesVip();
  }, []);

  if (loading) {
    return <p>Carregando relatório de clientes VIP...</p>;
  }

  return (
    <div>
      <h1>Relatório de Clientes VIP</h1>
      <p>Este relatório classifica os clientes pelo valor total de compras finalizadas.</p>

      {error && <p style={errorStyle}>{error}</p>}

      {!error && (
        clientesVip.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>ID Cliente</th>
                <th style={thTdStyle}>Nome</th>
                <th style={thTdStyle}>Total de Pedidos</th>
                <th style={thTdStyle}>Valor Total Gasto</th>
                <th style={thTdStyle}>Ticket Médio</th>
                <th style={thTdStyle}>Última Compra</th>
              </tr>
            </thead>
            <tbody>
              {clientesVip.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td style={thTdStyle}>{cliente.id_cliente}</td>
                  <td style={thTdStyle}>{cliente.nome}</td>
                  <td style={thTdStyle}>{cliente.total_pedidos}</td>
                  <td style={thTdStyle}>
                    {parseFloat(cliente.valor_total_compras).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td style={thTdStyle}>
                    {parseFloat(cliente.ticket_medio).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td style={thTdStyle}>
                    {new Date(cliente.ultima_compra).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum cliente com compras finalizadas foi encontrado para exibir no relatório.</p>
        )
      )}
    </div>
  );
}

export default RelatorioClientesVip;
