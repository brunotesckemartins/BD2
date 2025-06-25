import React, { useState, useEffect } from 'react';
import api from '../services/api';

// --- Componente Modal ---
// Modal genérico para exibir formulários de adicionar/editar usuários
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null; // Não renderiza nada se não estiver aberto

  const backdropStyle = {
    position: 'fixed', // Fica fixo na tela toda
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)', // Fundo escurecido semi-transparente
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
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Sombra leve para dar destaque
  };

  return (
    // Ao clicar no fundo, fecha o modal
    <div style={backdropStyle} onClick={onClose}>
      {/* Evita fechar o modal ao clicar dentro da caixa */}
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};


// --- Componente Principal da Página ---
function Usuarios() {
  // Estados para armazenar os dados dos usuários
  const [usuarios, setUsuarios] = useState([]);
  
  // Estados para controle da interface (loading e erros)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controle da abertura do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado que armazena o usuário que está sendo editado (null para adicionar)
  const [editingUsuario, setEditingUsuario] = useState(null);

  // Estado que armazena os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cargo: '',
  });

  // Efeito que busca os usuários na API ao montar o componente
  useEffect(() => {
    async function fetchUsuarios() {
      setLoading(true);
      try {
        const response = await api.get('/usuarios');
        setUsuarios(response.data || []);
        setError(null);
      } catch (err) {
        setError("Falha ao carregar usuários. Tente recarregar a página.");
        console.error("Erro ao buscar usuários:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  // Abre o modal e, se for edição, preenche o formulário com os dados existentes
  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingUsuario(usuario);
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        senha: '', // Senha fica em branco por segurança (não mostra senha)
        cargo: usuario.cargo || '',
      });
    } else {
      setEditingUsuario(null);
      setFormData({ nome: '', email: '', senha: '', cargo: '' });
    }
    setIsModalOpen(true);
  };

  // Fecha o modal e reseta o estado de edição
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUsuario(null);
  };
  
  // Atualiza o estado do formulário ao digitar/alterar um campo
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Trata o envio do formulário para adicionar ou editar usuário
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validação básica de campos obrigatórios
    if (!formData.nome || !formData.email) {
      alert("Por favor, preencha nome e email.");
      return;
    }

    // Monta o objeto que será enviado para a API
    const dataToSubmit = {
      nome: formData.nome,
      email: formData.email,
      cargo: formData.cargo,
    };
    
    if (editingUsuario) {
      // Ao editar, só envia a senha se o usuário digitou uma nova
      if (formData.senha) {
        dataToSubmit.senha = formData.senha;
      }
    } else {
      // Ao adicionar, senha é obrigatória
      if (!formData.senha) {
        alert("A senha é obrigatória para novos usuários.");
        return;
      }
      dataToSubmit.senha = formData.senha;
    }

    try {
      if (editingUsuario) {
        // Atualiza usuário existente via PUT
        const response = await api.put(`/usuarios/${editingUsuario.id_usuario}`, dataToSubmit);
        // Atualiza o estado local substituindo o usuário editado
        setUsuarios(usuarios.map(u => (u.id_usuario === editingUsuario.id_usuario ? response.data[0] : u)));
        alert("Usuário atualizado com sucesso!");
      } else {
        // Cria novo usuário via POST
        const response = await api.post('/usuarios', dataToSubmit);
        setUsuarios([...usuarios, response.data[0]]);
        alert("Usuário adicionado com sucesso!");
      }
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      alert(`Erro ao salvar: ${err.response?.data?.details || err.message}`);
    }
  };

  // Função para deletar usuário após confirmação
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este usuário?")) {
      try {
        await api.delete(`/usuarios/${id}`);
        // Remove o usuário deletado da lista local
        setUsuarios(usuarios.filter(u => u.id_usuario !== id));
        alert("Usuário removido com sucesso!");
      } catch (err) {
        console.error("Erro ao remover usuário:", err);
        alert(`Falha ao remover o usuário. Verifique se ele não está associado a algum pedido.`);
      }
    }
  };

  // --- Estilos inline para tabela e botões ---
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
  const thTdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
  const buttonStyle = { marginRight: '8px', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' };
  const editButtonStyle = { ...buttonStyle, backgroundColor: '#3498db', color: 'white'};
  const deleteButtonStyle = { ...buttonStyle, backgroundColor: '#e74c3c', color: 'white'};
  const addButtonStyle = { ...buttonStyle, backgroundColor: '#2ecc71', color: 'white', fontSize: '16px', padding: '10px 15px'};
  const formGroupStyle = { marginBottom: '15px' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' };

  // Exibe loading ou erro se necessário
  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Renderiza a página com tabela e modal
  return (
    <div>
      <h1>Gerenciamento de Usuários</h1>
      <button onClick={() => handleOpenModal()} style={addButtonStyle}>
        Adicionar Usuário
      </button>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>ID</th>
            <th style={thTdStyle}>Nome</th>
            <th style={thTdStyle}>Email</th>
            <th style={thTdStyle}>Cargo</th>
            <th style={thTdStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id_usuario}>
              <td style={thTdStyle}>{usuario.id_usuario}</td>
              <td style={thTdStyle}>{usuario.nome}</td>
              <td style={thTdStyle}>{usuario.email}</td>
              <td style={thTdStyle}>{usuario.cargo}</td>
              <td style={thTdStyle}>
                <button onClick={() => handleOpenModal(usuario)} style={editButtonStyle}>Editar</button>
                <button onClick={() => handleDelete(usuario.id_usuario)} style={deleteButtonStyle}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Modal para adicionar ou editar usuário --- */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{editingUsuario ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Nome*</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleFormChange} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Email*</label>
            <input type="email" name="email" value={formData.email} onChange={handleFormChange} style={inputStyle} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Senha{editingUsuario ? ' (opcional)' : '*'}</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleFormChange}
              style={inputStyle}
              placeholder={editingUsuario ? "Deixe em branco para não alterar" : ""}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Cargo</label>
            <input type="text" name="cargo" value={formData.cargo} onChange={handleFormChange} style={inputStyle} />
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

export default Usuarios;
