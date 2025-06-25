// Importa os hooks do React
import React, { useState, useEffect } from 'react';
// Importa a instância da API para requisições
import api from '../services/api';


// --- Componente reutilizável de Modal ---
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null; // Não renderiza nada se o modal estiver fechado

  // Estilo do fundo escurecido
  const backdropStyle = {
    position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000,
  };

  // Estilo da caixa do modal
  const modalStyle = {
    background: 'white', padding: '25px',
    borderRadius: '8px', width: '90%', maxWidth: '500px',
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


// --- Componente principal: página de Clientes ---
function Clientes() {
  // Estado da lista de clientes
  const [clientes, setClientes] = useState([]);

  // Estados de controle da interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado do formulário e cliente em edição
  const [editingCliente, setEditingCliente] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cpf_cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
  });

  // useEffect para buscar clientes ao carregar o componente
  useEffect(() => {
    async function fetchClientes() {
      setLoading(true);
      try {
        const response = await api.get('/clientes');
        setClientes(response.data || []);
        setError(null);
      } catch (err) {
        setError("Falha ao carregar clientes. Tente recarregar a página.");
        console.error("Erro ao buscar clientes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchClientes();
  }, []);

  // Abre o modal para adicionar ou editar um cliente
  const handleOpenModal = (cliente = null) => {
    if (cliente) {
      // Se estiver editando, preenche os campos com os dados existentes
      setEditingCliente(cliente);
      setFormData({
        nome: cliente.nome || '',
        cpf_cnpj: cliente.cpf_cnpj || '',
        email: cliente.email || '',
        telefone: cliente.telefone || '',
        endereco: cliente.endereco || '',
      });
    } else {
      // Se for novo cliente, limpa os campos
      setEditingCliente(null);
      setFormData({ nome: '', cpf_cnpj: '', email: '', telefone: '', endereco: '' });
    }
    setIsModalOpen(true);
  };

  // Fecha o modal e limpa o estado de edição
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCliente(null);
  };

  // Atualiza o estado do formulário conforme o usuário digita
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submete o formulário (cria ou atualiza um cliente)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validação básica
    if (!formData.nome || !formData.cpf_cnpj) {
      alert("Por favor, preencha os campos Nome e CPF/CNPJ.");
      return;
    }

    const dataToSubmit = { ...formData };

    try {
      if (editingCliente) {
        // --- Atualização de cliente existente ---
        const response = await api.put(`/clientes/${editingCliente.id_cliente}`, dataToSubmit);
        setClientes(clientes.map(c =>
          c.id_cliente === editingCliente.id_cliente ? response.data[0] : c
        ));
        alert("Cliente atualizado com sucesso!");
      } else {
        // --- Adição de novo cliente ---
        const response = await api.post('/clientes', dataToSubmit);
        setClientes([...clientes, response.data[0]]);
        alert("Cliente adicionado com sucesso!");
      }
      handleCloseModal(); // Fecha o modal
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
      alert(`Erro ao salvar cliente: ${err.response?.data?.details || err.message}`);
    }
  };

  // Deleta um cliente
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este cliente? A ação não pode ser desfeita.")) {
      try {
        await api.delete(`/clientes/${id}`);
        setClientes(clientes.filter(c => c.id_cliente !== id));
        alert("Cliente removido com sucesso!");
      } catch (err) {
        console.error("Erro ao remover cliente:", err);
        alert(`Falha ao remover o cliente. Verifique se ele não possui pedidos associados.`);
      }
    }
  };

  // --- Estilos utilizados na página ---
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
  const thTdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
  const buttonStyle = { marginRight: '8px', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' };
  const editButtonStyle = { ...buttonStyle, backgroundColor: '#3498db', color: 'white' };
  const deleteButtonStyle = { ...buttonStyle, backgroundColor: '#e74c3c', color: 'white' };
  const addButtonStyle = { ...buttonStyle, backgroundColor: '#2ecc71', color: 'white', fontSize: '16px', padding: '10px 15px' };
  const formGroupStyle = { marginBottom: '15px' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };

  // Exibe carregamento ou erro, se necessário
  if (loading) return <p>Carregando clientes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Gerenciamento de Clientes</h1>

      {/* Botão para abrir o modal de adição */}
      <button onClick={() => handleOpenModal()} style={addButtonStyle}>
        Adicionar Cliente
      </button>

      {/* Tabela de clientes */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>ID</th>
            <th style={thTdStyle}>Nome</th>
            <th style={thTdStyle}>CPF/CNPJ</th>
            <th style={thTdStyle}>Email</th>
            <th style={thTdStyle}>Telefone</th>
            <th style={thTdStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id_cliente}>
              <td style={thTdStyle}>{cliente.id_cliente}</td>
              <td style={thTdStyle}>{cliente.nome}</td>
              <td style={thTdStyle}>{cliente.cpf_cnpj}</td>
              <td style={thTdStyle}>{cliente.email}</td>
              <td style={thTdStyle}>{cliente.telefone}</td>
              <td style={thTdStyle}>
                {/* Botões de editar e remover */}
                <button onClick={() => handleOpenModal(cliente)} style={editButtonStyle}>Editar</button>
                <button onClick={() => handleDelete(cliente.id_cliente)} style={deleteButtonStyle}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Adicionar/Editar Cliente */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{editingCliente ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Nome Completo*</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleFormChange} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>CPF/CNPJ*</label>
            <input type="text" name="cpf_cnpj" value={formData.cpf_cnpj} onChange={handleFormChange} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleFormChange} style={inputStyle} />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Telefone</label>
            <input type="text" name="telefone" value={formData.telefone} onChange={handleFormChange} style={inputStyle} />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Endereço</label>
            <input type="text" name="endereco" value={formData.endereco} onChange={handleFormChange} style={inputStyle} />
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

// Exporta o componente
export default Clientes;
