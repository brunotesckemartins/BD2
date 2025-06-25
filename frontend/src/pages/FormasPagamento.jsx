import React, { useState, useEffect } from 'react';
import api from '../services/api';

// --- Componente Modal ---
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
function FormasPagamento() {
  // --- Estados para os dados ---
  const [formasPagamento, setFormasPagamento] = useState([]);

  // --- Estados de controle da interface ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Estados para o formulário (adicionar/editar) ---
  const [editingForma, setEditingForma] = useState(null);
  const [formData, setFormData] = useState({
    descricao: '',
  });

  // --- Carrega os dados da API ao iniciar o componente ---
  useEffect(() => {
    async function fetchFormasPagamento() {
      setLoading(true);
      try {
        const response = await api.get('/formas-pagamento');
        setFormasPagamento(response.data || []);
        setError(null);
      } catch (err) {
        setError("Falha ao carregar formas de pagamento. Tente recarregar a página.");
        console.error("Erro ao buscar formas de pagamento:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFormasPagamento();
  }, []);

  // --- Abre o modal com ou sem dados preenchidos (edição ou criação) ---
  const handleOpenModal = (forma = null) => {
    if (forma) {
      setEditingForma(forma);
      setFormData({ descricao: forma.descricao });
    } else {
      setEditingForma(null);
      setFormData({ descricao: '' });
    }
    setIsModalOpen(true);
  };

  // --- Fecha o modal ---
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingForma(null);
  };

  // --- Atualiza os dados do formulário conforme o usuário digita ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Envia o formulário (para adicionar ou editar) ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.descricao.trim()) {
      alert("Por favor, preencha a descrição.");
      return;
    }

    const dataToSubmit = { ...formData };

    try {
      if (editingForma) {
        // --- Lógica de EDIÇÃO ---
        const response = await api.put(`/formas-pagamento/${editingForma.id_forma}`, dataToSubmit);
        setFormasPagamento(formasPagamento.map(f =>
          f.id_forma === editingForma.id_forma ? response.data[0] : f
        ));
        alert("Forma de pagamento atualizada com sucesso!");
      } else {
        // --- Lógica de ADIÇÃO ---
        const response = await api.post('/formas-pagamento', dataToSubmit);
        setFormasPagamento([...formasPagamento, response.data[0]]);
        alert("Forma de pagamento adicionada com sucesso!");
      }
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar forma de pagamento:", err);
      alert(`Erro ao salvar: ${err.response?.data?.details || err.message}`);
    }
  };

  // --- Remove uma forma de pagamento após confirmação ---
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja remover esta forma de pagamento?")) {
      try {
        await api.delete(`/formas-pagamento/${id}`);
        setFormasPagamento(formasPagamento.filter(f => f.id_forma !== id));
        alert("Forma de pagamento removida com sucesso!");
      } catch (err) {
        console.error("Erro ao remover forma de pagamento:", err);
        alert("Falha ao remover. Verifique se esta forma de pagamento não está vinculada a um pedido ou conta.");
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

  // --- Renderiza tela de carregamento ou erro ---
  if (loading) return <p>Carregando formas de pagamento...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Gerenciamento de Formas de Pagamento</h1>
      <button onClick={() => handleOpenModal()} style={addButtonStyle}>
        Adicionar Forma de Pagamento
      </button>

      {/* --- Tabela de Formas de Pagamento --- */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>ID</th>
            <th style={thTdStyle}>Descrição</th>
            <th style={thTdStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {formasPagamento.map(forma => (
            <tr key={forma.id_forma}>
              <td style={thTdStyle}>{forma.id_forma}</td>
              <td style={thTdStyle}>{forma.descricao}</td>
              <td style={thTdStyle}>
                <button onClick={() => handleOpenModal(forma)} style={editButtonStyle}>Editar</button>
                <button onClick={() => handleDelete(forma.id_forma)} style={deleteButtonStyle}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Modal para Adicionar/Editar Forma --- */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{editingForma ? 'Editar Forma de Pagamento' : 'Adicionar Nova Forma de Pagamento'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Descrição*</label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleFormChange}
              style={inputStyle}
              required
            />
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

export default FormasPagamento;
