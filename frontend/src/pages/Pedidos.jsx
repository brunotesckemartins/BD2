import React, { useState, useEffect } from 'react';
import api from '../services/api';

// --- Componente Modal ---
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

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
function Pedidos() {
  // --- Estados para armazenar os dados ---
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState([]);

  // --- Estados para controle da interface ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- Estados para controle do formulário ---
  const [editingPedido, setEditingPedido] = useState(null);
  const [formData, setFormData] = useState({
    id_cliente: '',
    data_pedido: new Date().toISOString().split('T')[0],
    valor_total: '',
    status: 'PENDENTE',
    id_usuario: '',
    id_forma_pagamento: '',
  });

  // --- Efeito para carregar dados essenciais e secundários de forma resiliente ---
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Busca dados essenciais (pedidos e clientes) simultaneamente
        const [pedidosRes, clientesRes] = await Promise.all([
          api.get('/pedidos'),
          api.get('/clientes')
        ]);
        
        setPedidos(pedidosRes.data || []);
        setClientes(clientesRes.data || []);

        // Busca dados secundários (usuarios e formas de pagamento) separadamente
        try {
          const usuariosRes = await api.get('/usuarios');
          setUsuarios(usuariosRes.data || []);
        } catch (err) {
          console.warn("Aviso: Não foi possível carregar os usuários.", err.message);
        }

        try {
          const formasPagamentoRes = await api.get('/formas-pagamento');
          setFormasPagamento(formasPagamentoRes.data || []);
        } catch (err) {
          console.warn("Aviso: Não foi possível carregar as formas de pagamento.", err.message);
        }

      } catch (err) {
        setError("Falha ao carregar dados essenciais (pedidos/clientes). A API está online?");
        console.error("Erro ao buscar dados essenciais:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- Função para abrir o modal e carregar dados no formulário (edição ou criação) ---
  const handleOpenModal = (pedido = null) => {
    if (pedido) {
      setEditingPedido(pedido);
      setFormData({
        id_cliente: pedido.id_cliente,
        data_pedido: new Date(pedido.data_pedido).toISOString().split('T')[0],
        valor_total: pedido.valor_total,
        status: pedido.status,
        id_usuario: pedido.id_usuario || '',
        id_forma_pagamento: pedido.id_forma_pagamento || '',
      });
    } else {
      setEditingPedido(null);
      setFormData({
        id_cliente: '',
        data_pedido: new Date().toISOString().split('T')[0],
        valor_total: '',
        status: 'PENDENTE',
        id_usuario: '',
        id_forma_pagamento: '',
      });
    }
    setIsModalOpen(true);
  };

  // --- Função para fechar o modal e limpar estado de edição ---
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPedido(null);
  };
  
  // --- Função para atualizar o estado do formulário ao modificar campos ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Função para enviar o formulário (adicionar ou editar pedido) ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validação simples dos campos obrigatórios
    if (!formData.id_cliente || !formData.data_pedido || !formData.valor_total) {
      alert("Por favor, preencha Cliente, Data do Pedido e Valor Total.");
      return;
    }
    
    const dataToSubmit = { 
      ...formData, 
      valor_total: parseFloat(formData.valor_total),
      id_usuario: formData.id_usuario || null,
      id_forma_pagamento: formData.id_forma_pagamento || null,
    };

    try {
      if (editingPedido) {
        // Atualiza pedido existente
        const response = await api.put(`/pedidos/${editingPedido.id_pedido}`, dataToSubmit);
        // Atualiza lista localmente
        setPedidos(pedidos.map(p => (p.id_pedido === editingPedido.id_pedido ? { ...p, ...response.data[0] } : p)));
        alert("Pedido atualizado com sucesso!");
      } else {
        // Adiciona novo pedido
        const response = await api.post('/pedidos', dataToSubmit);
        setPedidos([...pedidos, response.data[0]]);
        alert("Pedido adicionado com sucesso!");
      }
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar pedido:", err);
      alert(`Erro ao salvar pedido: ${err.response?.data?.details || err.message}`);
    }
  };

  // --- Função para remover um pedido ---
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este pedido?")) {
      try {
        await api.delete(`/pedidos/${id}`);
        setPedidos(pedidos.filter(p => p.id_pedido !== id));
        alert("Pedido removido com sucesso!");
      } catch (err) {
        console.error("Erro ao remover pedido:", err);
        alert(`Falha ao remover o pedido. Verifique as dependências.`);
      }
    }
  };

  // --- Estilos para a tabela e botões ---
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
  const thTdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
  const buttonStyle = { marginRight: '8px', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' };
  const editButtonStyle = { ...buttonStyle, backgroundColor: '#3498db', color: 'white'};
  const deleteButtonStyle = { ...buttonStyle, backgroundColor: '#e74c3c', color: 'white'};
  const addButtonStyle = { ...buttonStyle, backgroundColor: '#2ecc71', color: 'white', fontSize: '16px', padding: '10px 15px'};
  const formGroupStyle = { marginBottom: '15px' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };

  // --- Exibição condicional para loading e erro ---
  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // --- Renderização do componente ---
  return (
    <div>
      <h1>Gerenciamento de Pedidos</h1>
      <button onClick={() => handleOpenModal()} style={addButtonStyle}>
        Adicionar Pedido
      </button>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>ID</th>
            <th style={thTdStyle}>Cliente</th>
            <th style={thTdStyle}>Data</th>
            <th style={thTdStyle}>Valor Total</th>
            <th style={thTdStyle}>Status</th>
            <th style={thTdStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(pedido => (
            <tr key={pedido.id_pedido}>
              <td style={thTdStyle}>{pedido.id_pedido}</td>
              <td style={thTdStyle}>
                {/* Exibe nome do cliente, ou ID se não encontrado */}
                {clientes.find(c => c.id_cliente === pedido.id_cliente)?.nome || `ID: ${pedido.id_cliente}`}
              </td>
              <td style={thTdStyle}>{new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}</td>
              <td style={thTdStyle}>{parseFloat(pedido.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td style={thTdStyle}>{pedido.status}</td>
              <td style={thTdStyle}>
                <button onClick={() => handleOpenModal(pedido)} style={editButtonStyle}>Editar</button>
                <button onClick={() => handleDelete(pedido.id_pedido)} style={deleteButtonStyle}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Modal para adicionar/editar pedido --- */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{editingPedido ? 'Editar Pedido' : 'Adicionar Novo Pedido'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Cliente*</label>
            <select name="id_cliente" value={formData.id_cliente} onChange={handleFormChange} style={inputStyle} required>
              <option value="">Selecione um cliente</option>
              {clientes.map(cli => (
                <option key={cli.id_cliente} value={cli.id_cliente}>{cli.nome}</option>
              ))}
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Data do Pedido*</label>
            <input type="date" name="data_pedido" value={formData.data_pedido} onChange={handleFormChange} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Valor Total (R$)*</label>
            <input type="number" name="valor_total" step="0.01" value={formData.valor_total} onChange={handleFormChange} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Status</label>
            <select name="status" value={formData.status} onChange={handleFormChange} style={inputStyle} required>
              <option value="PENDENTE">Pendente</option>
              <option value="FINALIZADO">Finalizado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Usuário (Vendedor)</label>
            <select name="id_usuario" value={formData.id_usuario} onChange={handleFormChange} style={inputStyle} disabled={!usuarios.length}>
              <option value="">{usuarios.length ? 'Nenhum' : 'Usuários não carregados'}</option>
              {usuarios.map(user => (
                <option key={user.id_usuario} value={user.id_usuario}>{user.nome}</option>
              ))}
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Forma de Pagamento</label>
            <select name="id_forma_pagamento" value={formData.id_forma_pagamento} onChange={handleFormChange} style={inputStyle} disabled={!formasPagamento.length}>
              <option value="">{formasPagamento.length ? 'Nenhuma' : 'Formas de Pagamento não carregadas'}</option>
              {formasPagamento.map(forma => (
                <option key={forma.id_forma} value={forma.id_forma}>{forma.descricao}</option>
              ))}
            </select>
          </div>
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <button type="button" onClick={handleCloseModal} style={{...buttonStyle, backgroundColor: '#bdc3c7'}}>Cancelar</button>
            <button type="submit" style={addButtonStyle}>Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Pedidos;
