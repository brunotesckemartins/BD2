import React, { useState, useEffect } from 'react';
import api from '../services/api';

// --- Componente Modal (padrão) ---
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Estilos do fundo escuro e da caixa do modal
  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalStyle = {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};


// --- Componente Principal da Página ---
function ContasReceber() {
  // Estados para armazenar dados das contas e pedidos
  const [contas, setContas] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // Estados de controle da interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para formulário (adicionar/editar)
  const [editingConta, setEditingConta] = useState(null);
  const [formData, setFormData] = useState({
    id_pedido: '',
    data_vencimento: new Date().toISOString().split('T')[0],
    valor: '',
    data_pagamento: '',
    status_pagamento: 'EM ABERTO',
    id_forma_pagamento: '',
  });

  // Carrega os dados da API ao iniciar o componente
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Busca contas a receber (obrigatório)
        const contasResponse = await api.get('/contas-receber');
        setContas(contasResponse.data || []);

        // Busca pedidos (opcional)
        try {
          const pedidosResponse = await api.get('/pedidos');
          setPedidos(pedidosResponse.data || []);
        } catch (formError) {
          console.warn("Aviso: Não foi possível carregar os pedidos para o formulário.", formError.message);
        }

      } catch (mainError) {
        setError("Falha ao carregar contas a receber. Verifique se a API está online.");
        console.error("Erro ao buscar contas a receber:", mainError);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Abre o modal com ou sem dados preenchidos (edição ou criação)
  const handleOpenModal = (conta = null) => {
    if (conta) {
      setEditingConta(conta);
      setFormData({
        id_pedido: conta.id_pedido,
        data_vencimento: new Date(conta.data_vencimento).toISOString().split('T')[0],
        valor: conta.valor,
        data_pagamento: conta.data_pagamento ? new Date(conta.data_pagamento).toISOString().split('T')[0] : '',
        status_pagamento: conta.status_pagamento,
        id_forma_pagamento: conta.id_forma_pagamento || '',
      });
    } else {
      setEditingConta(null);
      setFormData({
        id_pedido: '',
        data_vencimento: new Date().toISOString().split('T')[0],
        valor: '',
        data_pagamento: '',
        status_pagamento: 'EM ABERTO',
        id_forma_pagamento: '',
      });
    }
    setIsModalOpen(true);
  };

  // Fecha o modal
  const handleCloseModal = () => setIsModalOpen(false);

  // Atualiza os dados do formulário conforme o usuário digita
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Envia o formulário (para adicionar ou editar)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_pedido || !formData.valor || !formData.data_vencimento) {
      alert("Por favor, preencha o Pedido, Valor e Data de Vencimento.");
      return;
    }

    const dataToSubmit = {
      ...formData,
      valor: parseFloat(formData.valor),
      data_pagamento: formData.data_pagamento || null,
      id_forma_pagamento: formData.id_forma_pagamento || null,
    };

    try {
      if (editingConta) {
        // --- Lógica de EDIÇÃO ---
        const response = await api.put(`/contas-receber/${editingConta.id_conta}`, dataToSubmit);
        setContas(contas.map(c => (c.id_conta === editingConta.id_conta ? response.data[0] : c)));
        alert("Conta atualizada com sucesso!");
      } else {
        // --- Lógica de ADIÇÃO ---
        const response = await api.post('/contas-receber', dataToSubmit);
        setContas([...contas, response.data[0]]);
        alert("Conta adicionada com sucesso!");
      }
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar conta:", err);
      alert(`Erro ao salvar conta: ${err.response?.data?.details || err.message}`);
    }
  };

  // Remove uma conta após confirmação
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja remover esta conta a receber?")) {
      try {
        await api.delete(`/contas-receber/${id}`);
        setContas(contas.filter(c => c.id_conta !== id));
        alert("Conta a receber removida com sucesso!");
      } catch (error) {
        console.error("Erro ao remover conta a receber:", error);
        alert("Falha ao remover a conta. Verifique o console.");
      }
    }
  };

  // --- Estilos da página ---
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
  const thTdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
  const buttonStyle = { marginRight: '8px', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' };
  const editButtonStyle = { ...buttonStyle, backgroundColor: '#3498db', color: 'white' };
  const deleteButtonStyle = { ...buttonStyle, backgroundColor: '#e74c3c', color: 'white' };
  const addButtonStyle = { ...buttonStyle, backgroundColor: '#2ecc71', color: 'white', fontSize: '16px', padding: '10px 15px' };
  const formGroupStyle = { marginBottom: '15px' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };

  // Exibe mensagens de carregamento ou erro
  if (loading) return <p>Carregando contas a receber...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Gerenciamento de Contas a Receber</h1>
      <button onClick={() => handleOpenModal()} style={addButtonStyle}>
        Adicionar Conta
      </button>

      {/* --- Tabela de Contas --- */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>ID</th>
            <th style={thTdStyle}>ID Pedido</th>
            <th style={thTdStyle}>Vencimento</th>
            <th style={thTdStyle}>Valor</th>
            <th style={thTdStyle}>Data Pagamento</th>
            <th style={thTdStyle}>Status</th>
            <th style={thTdStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {contas.map(conta => (
            <tr key={conta.id_conta}>
              <td style={thTdStyle}>{conta.id_conta}</td>
              <td style={thTdStyle}>{conta.id_pedido}</td>
              <td style={thTdStyle}>{new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}</td>
              <td style={thTdStyle}>{parseFloat(conta.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td style={thTdStyle}>{conta.data_pagamento ? new Date(conta.data_pagamento).toLocaleDateString('pt-BR') : 'N/A'}</td>
              <td style={thTdStyle}>{conta.status_pagamento}</td>
              <td style={thTdStyle}>
                <button onClick={() => handleOpenModal(conta)} style={editButtonStyle}>Editar</button>
                <button onClick={() => handleDelete(conta.id_conta)} style={deleteButtonStyle}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Modal para Adicionar/Editar Conta --- */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{editingConta ? 'Editar Conta' : 'Adicionar Nova Conta'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Pedido Associado*</label>
            <select 
              name="id_pedido" 
              value={formData.id_pedido} 
              onChange={handleFormChange} 
              style={inputStyle} 
              required
              disabled={!pedidos.length}
            >
              <option value="">
                {pedidos.length ? "Selecione um pedido" : "Carregando pedidos..."}
              </option>
              {pedidos.map(p => (
                <option key={p.id_pedido} value={p.id_pedido}>
                  Pedido {p.id_pedido} - R$ {parseFloat(p.valor_total).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Valor (R$)*</label>
            <input type="number" name="valor" step="0.01" value={formData.valor} onChange={handleFormChange} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Data de Vencimento*</label>
            <input type="date" name="data_vencimento" value={formData.data_vencimento} onChange={handleFormChange} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Status do Pagamento</label>
            <select name="status_pagamento" value={formData.status_pagamento} onChange={handleFormChange} style={inputStyle}>
              <option value="EM ABERTO">Em Aberto</option>
              <option value="PAGO">Pago</option>
            </select>
          </div>

          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <button type="button" onClick={handleCloseModal} style={{ ...buttonStyle, backgroundColor: '#bdc3c7' }}>Cancelar</button>
            <button type="submit" style={addButtonStyle}>Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ContasReceber;
