// Importa o React e os hooks useState e useEffect
import React, { useState, useEffect } from 'react';

// Importa o serviço de API para fazer requisições HTTP
import api from '../../services/api';

// Estilos inline para a tabela, inputs, botão e mensagens de erro
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

const formStyle = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  marginBottom: '1rem',
  flexWrap: 'wrap',
};

const inputStyle = {
  padding: '8px',
};

const buttonStyle = {
  padding: '8px 12px',
  cursor: 'pointer',
};

const errorStyle = {
  color: 'red',
  backgroundColor: '#fff0f0',
  border: '1px solid red',
  padding: '15px',
  borderRadius: '5px',
};

// Função auxiliar para formatar a data no formato YYYY-MM-DD
const getISODate = (date) => date.toISOString().split('T')[0];

// Componente funcional que representa o Relatório Financeiro
function RelatorioFinanceiro() {
  // Estado que armazena os dados retornados da API
  const [dadosRelatorio, setDadosRelatorio] = useState([]);

  // Estado para indicar se os dados estão sendo carregados
  const [loading, setLoading] = useState(false);

  // Estado para armazenar mensagens de erro, se houver
  const [error, setError] = useState(null);

  // Estado com a data de início (inicialmente 1 mês atrás)
  const [dataInicio, setDataInicio] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1); // Retrocede 1 mês
    return getISODate(date); // Converte para string no formato ISO
  });

  // Estado com a data de fim (hoje)
  const [dataFim, setDataFim] = useState(getISODate(new Date()));

  // Função que busca os dados da API com base nas datas selecionadas
  const fetchRelatorio = async () => {
    setLoading(true);           // Inicia carregamento
    setError(null);             // Limpa erros anteriores
    setDadosRelatorio([]);      // Limpa dados anteriores

    try {
      // Requisição GET com parâmetros data_inicio e data_fim
      const response = await api.get('/relatorios/financeiro', {
        params: { data_inicio: dataInicio, data_fim: dataFim },
      });

      // Atualiza os dados recebidos (ou array vazio por segurança)
      setDadosRelatorio(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar relatório financeiro:", err);

      // Se erro for 404, mostra relatório vazio; senão exibe mensagem genérica
      if (err.response && err.response.status === 404) {
        setDadosRelatorio([]);
      } else {
        setError("Ocorreu um erro inesperado ao carregar o relatório. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false); // Finaliza carregamento
    }
  };

  // Executa a primeira busca automaticamente ao montar o componente
  useEffect(() => {
    fetchRelatorio();
  }, []);

  // Manipulador de envio do formulário (quando o botão "Gerar Relatório" é clicado)
  const handleGerarRelatorio = (e) => {
    e.preventDefault(); // Evita recarregamento da página
    fetchRelatorio();   // Chama a função para buscar o relatório com as datas atuais
  };

  return (
    <div>
      <h1>Relatório Financeiro por Cliente</h1>
      <p>
        Resumo financeiro por cliente, incluindo totais de pedidos, valores pagos, pendentes
        e contagem de atrasos em um período.
      </p>

      {/* Formulário com campos para selecionar data de início e fim */}
      <form onSubmit={handleGerarRelatorio} style={formStyle}>
        <div>
          <label htmlFor="dataInicio">Data Início: </label>
          <input
            type="date"
            id="dataInicio"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="dataFim">Data Fim: </label>
          <input
            type="date"
            id="dataFim"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            style={inputStyle}
          />
        </div>
        {/* Botão para gerar o relatório */}
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Gerando...' : 'Gerar Relatório'}
        </button>
      </form>

      {/* Mensagem de carregamento */}
      {loading && <p>Carregando dados...</p>}

      {/* Mensagem de erro, se houver */}
      {error && <p style={errorStyle}>{error}</p>}

      {/* Exibe a tabela se houver dados, caso contrário mostra uma mensagem */}
      {!loading && !error && (
        dadosRelatorio.length > 0 ? (
          // Tabela com os dados financeiros dos clientes
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
              {/* Itera sobre os dados para renderizar cada linha */}
              {dadosRelatorio.map((item) => (
                <tr key={item.cliente_id}>
                  <td style={thTdStyle}>{item.cliente_id}</td>
                  <td style={thTdStyle}>{item.cliente_nome}</td>
                  <td style={thTdStyle}>
                    {parseFloat(item.total_pedidos).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td style={thTdStyle}>
                    {parseFloat(item.total_pago).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td style={thTdStyle}>
                    {parseFloat(item.total_pendente).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td style={thTdStyle}>{item.pedidos_em_atraso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Mensagem caso nenhum dado seja retornado
          <p>Nenhum dado financeiro encontrado para o período selecionado.</p>
        )
      )}
    </div>
  );
}

// Exporta o componente para que possa ser usado em outras partes da aplicação
export default RelatorioFinanceiro;
