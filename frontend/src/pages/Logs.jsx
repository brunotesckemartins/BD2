import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Estilos simples para a tabela
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thTdStyle = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' };

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega os logs da API quando o componente monta
  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await api.get('/logs');
        // Ordena os logs do mais recente para o mais antigo
        const sortedLogs = response.data.sort((a, b) => new Date(b.data) - new Date(a.data));
        setLogs(sortedLogs);
      } catch (error) {
        console.error("Erro ao buscar logs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) {
    return <p>Carregando logs do sistema...</p>;
  }

  return (
    <div>
      <h1>Logs do Sistema</h1>
      <p>Exibe os registros de eventos importantes do sistema.</p>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>ID Log</th>
            <th style={thTdStyle}>Data e Hora</th>
            <th style={thTdStyle}>ID Produto Associado</th>
            <th style={thTdStyle}>Mensagem</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id_log}>
              <td style={thTdStyle}>{log.id_log}</td>
              <td style={thTdStyle}>{new Date(log.data).toLocaleString('pt-BR')}</td>
              <td style={thTdStyle}>{log.id_produto}</td>
              <td style={thTdStyle}>{log.mensagem}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Logs;
