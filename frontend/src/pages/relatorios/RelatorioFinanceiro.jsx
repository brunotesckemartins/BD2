import React, { useState, useEffect } from 'react';
import api from '../../services/api';

// Estilos
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
const thTdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
const formStyle = { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' };
const inputStyle = { padding: '8px' };
const buttonStyle = { padding: '8px 12px', cursor: 'pointer' };
const errorStyle = { color: 'red', backgroundColor: '#fff0f0', border: '1px solid red', padding: '15px', borderRadius: '5px' };

const getISODate = (date) => date.toISOString().split('T')[0];

function RelatorioFinanceiro() {
  const [dadosRelatorio, setDadosRelatorio] = useState([]);
  const [loading, setLoading] = useState(false); // Inicia como false
  const [error, setError] = useState(null);
  const [dataInicio, setDataInicio] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return getISODate(date);
  });
  const [dataFim, setDataFim] = useState(getISODate(new Date()));

  const fetchRelatorio = async () => {
    setLoading(true);
    setError(null);
    setDadosRelatorio([]);
    try {
      const response = await api.get('/relatorios/financeiro', {
        params: { data_inicio: dataInicio, data_fim: dataFim },
      });
      setDadosRelatorio(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar relatório financeiro:", err);
      if (err.response && err.response.status === 404) {
        setDadosRelatorio([]);
      } else {
        setError("Ocorreu um erro inesperado ao carregar o relatório. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Roda ao carregar o componente para buscar os dados iniciais
  useEffect(() => {
    fetchRelatorio();
  }, []);

  const handleGerarRelatorio = (e) => {
    e.preventDefault();
    fetchRelatorio();
  };

  return (
    <div>
      <h1>Relatório Financeiro por Cliente</h1>
      <p>Resumo financeiro por cliente, incluindo totais de pedidos, valores pagos, pendentes e contagem de atrasos em um período.</p>
      
      <form onSubmit={handleGerarRelatorio} style={formStyle}>
        <div>
          <label htmlFor="dataInicio">Data Início: </label>
          <input type="date" id="dataInicio" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="dataFim">Data Fim: </label>
          <input type="date" id="dataFim" value={dataFim} onChange={(e) => setDataFim(e.target.value)} style={inputStyle} />
        </div>
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Gerando...' : 'Gerar Relatório'}
        </button>
      </form>

      {loading && <p>Carregando dados...</p>}

      {error && <p style={errorStyle}>{error}</p>}

      {!loading && !error && (
        dadosRelatorio.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>ID Cliente</th>
                <th style={thTdStyle}>Nome</th>
                <th style={thTdStyle}>Total Pedidos</th>
                <th style={thTdStyle}>Total Pago</th>
                <th style={thTdStyle}>Total Pendente</th>
                <th style={thTdStyle}>Atrasos</th>
              </tr>
            </thead>
            <tbody>
              {dadosRelatorio.map((item) => (
                <tr key={item.cliente_id}>
                  <td style={thTdStyle}>{item.cliente_id}</td>
                  <td style={thTdStyle}>{item.cliente_nome}</td>
                  <td style={thTdStyle}>{parseFloat(item.total_pedidos).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td style={thTdStyle}>{parseFloat(item.total_pago).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td style={thTdStyle}>{parseFloat(item.total_pendente).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td style={thTdStyle}>{item.pedidos_em_atraso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum dado financeiro encontrado para o período selecionado.</p>
        )
      )}
    </div>
  );
}

export default RelatorioFinanceiro;
