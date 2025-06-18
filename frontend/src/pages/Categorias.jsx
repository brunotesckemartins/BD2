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
function Categorias() {
  // Estados para os dados
  const [categorias, setCategorias] = useState([]);
  
  // Estados para controle da UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados para o formulário
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
  });

  // Efeito para buscar os dados da API
  useEffect(() => {
    async function fetchCategorias() {
      setLoading(true);
      try {
        const response = await api.get('/categorias');
        setCategorias(response.data || []);
        setError(null);
      } catch (err) {
        setError("Falha ao carregar categorias. Tente recarregar a página.");
        console.error("Erro ao buscar categorias:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategorias();
  }, []);

  // Funções para controlar o Modal
  const handleOpenModal = (categoria = null) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({
        nome: categoria.nome,
      });
    } else {
      setEditingCategoria(null);
      setFormData({ nome: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategoria(null);
  };
  
  // Função para lidar com mudanças nos inputs do formulário
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função para submeter o formulário (Adicionar ou Editar)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert("Por favor, preencha o nome da categoria.");
      return;
    }
    
    const dataToSubmit = { ...formData };

    try {
      if (editingCategoria) {
        // --- Lógica de EDIÇÃO ---
        const response = await api.put(`/categorias/${editingCategoria.id_categoria}`, dataToSubmit);
        setCategorias(categorias.map(c => (c.id_categoria === editingCategoria.id_categoria ? response.data[0] : c)));
        alert("Categoria atualizada com sucesso!");
      } else {
        // --- Lógica de ADIÇÃO ---
        const response = await api.post('/categorias', dataToSubmit);
        setCategorias([...categorias, response.data[0]]);
        alert("Categoria adicionada com sucesso!");
      }
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
      alert(`Erro ao salvar categoria: ${err.response?.data?.details || err.message}`);
    }
  };

  // Função para deletar uma categoria
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja remover esta categoria?")) {
      try {
        await api.delete(`/categorias/${id}`);
        setCategorias(categorias.filter(c => c.id_categoria !== id));
        alert("Categoria removida com sucesso!");
      } catch (err) {
        console.error("Erro ao remover categoria:", err);
        alert(`Falha ao remover a categoria. Verifique se ela não está sendo usada por algum produto.`);
      }
    }
  };

  // --- Estilos ---
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
  const thTdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
  const buttonStyle = { marginRight: '8px', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' };
  const editButtonStyle = { ...buttonStyle, backgroundColor: '#3498db', color: 'white'};
  const deleteButtonStyle = { ...buttonStyle, backgroundColor: '#e74c3c', color: 'white'};
  const addButtonStyle = { ...buttonStyle, backgroundColor: '#2ecc71', color: 'white', fontSize: '16px', padding: '10px 15px'};
  const formGroupStyle = { marginBottom: '15px' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };

  if (loading) return <p>Carregando categorias...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Gerenciamento de Categorias</h1>
      <button onClick={() => handleOpenModal()} style={addButtonStyle}>
        Adicionar Categoria
      </button>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>ID</th>
            <th style={thTdStyle}>Nome</th>
            <th style={thTdStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(categoria => (
            <tr key={categoria.id_categoria}>
              <td style={thTdStyle}>{categoria.id_categoria}</td>
              <td style={thTdStyle}>{categoria.nome}</td>
              <td style={thTdStyle}>
                <button onClick={() => handleOpenModal(categoria)} style={editButtonStyle}>Editar</button>
                <button onClick={() => handleDelete(categoria.id_categoria)} style={deleteButtonStyle}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Modal de Adicionar/Editar --- */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{editingCategoria ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Nome da Categoria*</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleFormChange} style={inputStyle} required />
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

export default Categorias;
