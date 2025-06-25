// Importa o React e os hooks useState e useEffect
import React, { useState, useEffect } from 'react';

// Importa o serviço de API para realizar requisições HTTP
import api from '../../services/api';

// Estilos inline utilizados no componente
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
const thTdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
const errorStyle = {
  color: 'red',
  backgroundColor: '#fff0f0',
  border: '1px solid red',
  padding: '15px',
  borderRadius: '5px',
};

// Componente funcional responsável por exibir o relatório de vendas mensais
function RelatorioVendas() {
  // Estado que armazena os dados do relatório de vendas
  const [dadosVendas, setDadosVendas] = useState([]);

  // Estado que controla se os dados estão sendo carregados
  const [loading, setLoading] = useState(true);

  // Estado que armazena mensagens de erro, caso haja falha na requisição
  const [error, setError] = useState(null);

  // Hook useEffect executado uma única vez ao montar o componente
  useEffect(() => {
    // Função assíncrona para buscar os dados do relatório de vendas
    async function fetchRelatorioVendas() {
      setLoading(true);   // Ativa o estado de carregamento
      setError(null);     // Limpa erros anteriores

      try {
        // Realiza uma requisição GET para a rota do relatório de vendas mensais
        const response = await api.get('/relatorios/vendas-mensal');

        // Atualiza o estado com os dados retornados (ou array vazio por segurança)
        setDadosVendas(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar relatório de vendas:", err);

        // Se o erro for 404 (dados não encontrados), apenas limpa a tabela
        if (err.response && err.response.status === 404) {
          setDadosVendas([]);
        } else {
          // Para outros erros, exibe uma mensagem genérica
          setError("Ocorreu um erro inesperado ao carregar o relatório. Tente novamente mais tarde.");
        }
      } finally {
        // Finaliza o carregamento
        setLoading(false);
      }
    }

    // Chama a função para carregar os dados ao montar o componente
    fetchRelatorioVendas();
  }, []); // Array vazio garante execução única (sem dependências)

  // Se os dados ainda estiverem carregando, exibe mensagem de carregamento
  if (loading) {
    return <p>Carregando relatório de vendas...</p>;
  }

  // Retorno JSX do componente
  return (
    <div>
      <h1>Relatório de Vendas Mensal</h1>
      <p>
        Este relatório apresenta um resumo do total de pedidos finalizados e o valor total vendido em cada mês.
      </p>

      {/* Exibe mensagem de erro, se houver */}
      {error && <p style={errorStyle}>{error}</p>}

      {/* Exibe a tabela se não houver erro */}
      {!error && (
        dadosVendas.length > 0 ? (
          // Tabela com os dados de vendas mensais
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>Mês</th>
                <th style={thTdStyle}>Total de Pedidos</th>
                <th style={thTdStyle}>Total Vendido</th>
              </tr>
            </thead>
            <tbody>
              {/* Itera sobre os dados de vendas para exibir uma linha por mês */}
              {dadosVendas.map((item) => (
                <tr key={item.mes}>
                  <td style={thTdStyle}>
                    {/* Formata a data no estilo "mês por extenso e ano", exemplo: "Março de 2025" */}
                    {new Date(item.mes).toLocaleString('pt-BR', {
                      month: 'long',
                      year: 'numeric'
                    }).replace(/^\w/, c => c.toUpperCase())}
                  </td>
                  <td style={thTdStyle}>{item.total_pedidos}</td>
                  <td style={thTdStyle}>
                    {/* Formata o valor total vendido como moeda brasileira */}
                    {parseFloat(item.total_vendido).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Mensagem exibida caso não haja dados de vendas
          <p>Nenhum dado de venda finalizada encontrado para exibir no relatório.</p>
        )
      )}
    </div>
  );
}

// Exporta o componente para que possa ser utilizado em outros arquivos
export default RelatorioVendas;
