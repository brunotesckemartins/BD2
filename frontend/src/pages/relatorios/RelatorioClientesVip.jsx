// Importa o React e os hooks useState e useEffect
import React, { useState, useEffect } from 'react';

// Importa o serviço de API configurado para fazer requisições HTTP
import api from '../../services/api';

// Estilos inline para a tabela e mensagens de erro
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
};

const thTdStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  textAlign: 'left',
};

const errorStyle = {
  color: 'red',
  backgroundColor: '#fff0f0',
  border: '1px solid red',
  padding: '15px',
  borderRadius: '5px',
};

// Componente funcional que exibe o relatório de clientes VIP
function RelatorioClientesVip() {
  // Estado para armazenar os dados dos clientes VIP
  const [clientesVip, setClientesVip] = useState([]);
  
  // Estado para controle de carregamento
  const [loading, setLoading] = useState(true);
  
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState(null);

  // Hook useEffect que executa ao montar o componente
  useEffect(() => {
    // Função assíncrona para buscar os dados do relatório
    async function fetchRelatorioClientesVip() {
      setLoading(true); // Define carregando como true
      setError(null);   // Reseta o erro

      try {
        // Faz uma requisição GET para a rota do relatório
        const response = await api.get('/relatorios/clientes-vip');
        
        // Armazena os dados retornados no estado
        setClientesVip(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar relatório de clientes VIP:", err);
        
        // Trata o erro: se for 404, define lista vazia, senão mostra mensagem genérica
        if (err.response && err.response.status === 404) {
          setClientesVip([]);
        } else {
          setError("Ocorreu um erro inesperado ao carregar o relatório. Tente novamente mais tarde.");
        }
      } finally {
        // Finaliza o carregamento
        setLoading(false);
      }
    }

    // Chama a função para buscar o relatório
    fetchRelatorioClientesVip();
  }, []); // Array vazio garante que executa só uma vez ao montar

  // Se estiver carregando, exibe uma mensagem de carregamento
  if (loading) {
    return <p>Carregando relatório de clientes VIP...</p>;
  }

  // Retorno do componente JSX
  return (
    <div>
      <h1>Relatório de Clientes VIP</h1>
      <p>Este relatório classifica os clientes pelo valor total de compras finalizadas.</p>

      {/* Exibe a mensagem de erro, se houver */}
      {error && <p style={errorStyle}>{error}</p>}

      {/* Se não houver erro, mostra a tabela ou mensagem de ausência de dados */}
      {!error && (
        clientesVip.length > 0 ? (
          // Tabela com os dados dos clientes
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
              {/* Mapeia a lista de clientes e gera uma linha para cada um */}
              {clientesVip.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td style={thTdStyle}>{cliente.id_cliente}</td>
                  <td style={thTdStyle}>{cliente.nome}</td>
                  <td style={thTdStyle}>{cliente.total_pedidos}</td>
                  <td style={thTdStyle}>
                    {/* Formata valor total gasto como moeda em reais */}
                    {parseFloat(cliente.valor_total_compras).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td style={thTdStyle}>
                    {/* Formata o ticket médio como moeda */}
                    {parseFloat(cliente.ticket_medio).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td style={thTdStyle}>
                    {/* Formata a data da última compra para o formato brasileiro */}
                    {new Date(cliente.ultima_compra).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Caso a lista esteja vazia, exibe mensagem amigável
          <p>Nenhum cliente com compras finalizadas foi encontrado para exibir no relatório.</p>
        )
      )}
    </div>
  );
}

// Exporta o componente para uso em outros arquivos
export default RelatorioClientesVip;
