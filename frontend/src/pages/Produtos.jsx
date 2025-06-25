import React, { useState, useEffect } from 'react';
import api from '../services/api';

// --- Componente Modal ---
// Modal genérico para exibir formulários de adicionar/editar
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Fica acima de outros elementos
  };

  const modalStyle = {
    background: 'white',
    padding: '25px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Sombra sutil
  };

  return (
    // Ao clicar no fundo, fecha o modal
    <div style={backdropStyle} onClick={onClose}>
      {/* Evita fechar o modal ao clicar dentro do conteúdo */}
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};


// --- Componente Principal da Página ---
function Produtos() {
  // Estados para armazenar os dados da API
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  // Estados para controle da interface (loading e erros)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Controle da abertura do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado que armazena o produto que está sendo editado (null para adicionar)
  const [editingProduto, setEditingProduto] = useState(null);

  // Estado que armazena os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    id_categoria: '',
    estoque: 0,
  });

  // Busca produtos e categorias na API ao montar o componente
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Busca produtos e categorias em paralelo para otimizar
        const [produtosResponse, categoriasResponse] = await Promise.all([
          api.get('/produtos'),
          api.get('/categorias')
        ]);
        
        setProdutos(produtosResponse.data || []);
        setCategorias(categoriasResponse.data || []);
        setError(null);
      } catch (err) {
        setError("Falha ao carregar dados. Tente recarregar a página.");
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Abre o modal e, se for edição, preenche o formulário com dados existentes
  const handleOpenModal = (produto = null) => {
    if (produto) {
      // Editar produto: carrega os dados no formulário
      setEditingProduto(produto);
      setFormData({
        nome: produto.nome,
        preco: produto.preco,
        id_categoria: produto.id_categoria,
        estoque: produto.estoque,
      });
    } else {
      // Adicionar produto: limpa o formulário
      setEditingProduto(null);
      setFormData({ nome: '', preco: '', id_categoria: '', estoque: 0 });
    }
    setIsModalOpen(true);
  };

  // Fecha o modal e reseta o estado de edição
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduto(null);
  };
  
  // Atualiza o estado do formulário ao digitar/selecionar um campo
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // Converte para número inteiro no campo estoque para evitar strings
    if (name === 'estoque') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Trata o envio do formulário para adicionar ou editar
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validação básica dos campos obrigatórios
    if (!formData.nome || !formData.preco || !formData.id_categoria) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    // Preparar os dados para envio, convertendo preços e estoque
    const dataToSubmit = { 
      ...formData, 
      preco: parseFloat(formData.preco), 
      estoque: parseInt(formData.estoque) 
    };

    try {
      if (editingProduto) {
        // Atualiza o produto existente
        const response = await api.put(`/produtos/${editingProduto.id_produto}`, dataToSubmit);
        setProdutos(produtos.map(p => (p.id_produto === editingProduto.id_produto ? response.data[0] : p)));
        alert("Produto atualizado com sucesso!");
      } else {
        // Cria um novo produto
        const response = await api.post('/produtos', dataToSubmit);
        setProdutos([...produtos, response.data[0]]);
        alert("Produto adicionado com sucesso!");
      }
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      alert(`Erro ao salvar produto: ${err.response?.data?.details || err.message}`);
    }
  };

  // Função para deletar um produto após confirmação do usuário
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este produto?")) {
      try {
        await api.delete(`/produtos/${id}`);
        setProdutos(produtos.filter(p => p.id_produto !== id));
        alert("Produto removido com sucesso!");
      } catch (err) {
        console.error("Erro ao remover produto:", err);
        alert(`Falha ao remover o produto. Verifique se ele não está associado a um pedido.`);
      }
    }
  };

  // --- Estilos inline para a tabela e botões ---
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
  const thTdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
  const buttonStyle = { marginRight: '8px', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' };
  const editButtonStyle = { ...buttonStyle, backgroundColor: '#3498db', color: 'white'};
  const deleteButtonStyle = { ...buttonStyle, backgroundColor: '#e74c3c', color: 'white'};
  const addButtonStyle = { ...buttonStyle, backgroundColor: '#2ecc71', color: 'white', fontSize: '16px', padding: '10px 15px'};
  const formGroupStyle = { marginBottom: '15px' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };

  // Exibe loading ou erro caso necessário
  if (loading) return <p>Carregando produtos e categorias...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Renderiza a tabela e o modal com formulário
  return (
    <div>
      <h1>Gerenciamento de Produtos</h1>
      <button onClick={() => handleOpenModal()} style={addButtonStyle}>
        Adicionar Produto
      </button>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>ID</th>
            <th style={thTdStyle}>Nome</th>
            <th style={thTdStyle}>Preço</th>
            <th style={thTdStyle}>Estoque</th>
            <th style={thTdStyle}>Categoria</th>
            <th style={thTdStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(produto => (
            <tr key={produto.id_produto}>
              <td style={thTdStyle}>{produto.id_produto}</td>
              <td style={thTdStyle}>{produto.nome}</td>
              <td style={thTdStyle}>
                {parseFloat(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
              <td style={thTdStyle}>{produto.estoque}</td>
              {/* Produto já vem com o nome da categoria associado */}
              <td style={thTdStyle}>{produto.nome_categoria}</td>
              <td style={thTdStyle}>
                <button onClick={() => handleOpenModal(produto)} style={editButtonStyle}>Editar</button>
                <button onClick={() => handleDelete(produto.id_produto)} style={deleteButtonStyle}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Modal para adicionar ou editar produto --- */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{editingProduto ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Nome do Produto</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleFormChange} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Preço (R$)</label>
            <input type="number" name="preco" step="0.01" value={formData.preco} onChange={handleFormChange} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Estoque</label>
            <input type="number" name="estoque" value={formData.estoque} onChange={handleFormChange} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Categoria</label>
            <select name="id_categoria" value={formData.id_categoria} onChange={handleFormChange} style={inputStyle} required>
              <option value="">Selecione uma categoria</option>
              {categorias.map(cat => (
                <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nome}</option>
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

export default Produtos;
