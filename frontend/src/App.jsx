import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

import Clientes from './pages/Clientes';
// --- Páginas de Cadastro (CRUD) ---
import Produtos from './pages/Produtos';
import Pedidos from './pages/Pedidos';
import Categorias from './pages/Categorias';
import ContasReceber from './pages/ContasReceber';
import FormasPagamento from './pages/FormasPagamento';
import Usuarios from './pages/Usuarios';
import Logs from './pages/Logs';

// --- Páginas de Relatórios (Views e Functions) ---
import RelatorioVendas from './pages/relatorios/RelatorioVendas';
import RelatorioClientesVip from './pages/relatorios/RelatorioClientesVip';
import RelatorioFinanceiro from './pages/relatorios/RelatorioFinanceiro';


// Um componente simples para a página inicial
function HomePage() {
  return (
    <div>
      <h1>CRUD do Sistema Financeiro em PostgreSQL</h1>
      <p>Utilizar o menu lateral para navegar entre as seções de cadastros e relatórios.</p>
      <p>Este projeto foi desenvolvido para a disciplina de Banco de Dados 2, utilizando React para o frontend e uma API conectada a um banco de dados PostgreSQL.</p>
    </div>
  );
}

function App() {
  const location = useLocation(); // Hook para saber a rota atual

  // --- Estilos para o Layout ---
  const appStyle = {
    display: 'flex',
    fontFamily: 'sans-serif',
    color: '#333',
  };

  const sidebarStyle = {
    width: '250px',
    minHeight: '100vh',
    background: '#2c3e50',
    color: 'white',
    padding: '20px',
    boxSizing: 'border-box',
    flexShrink: 0, // Impede que o sidebar encolha
  };

  const mainContentStyle = {
    flexGrow: 1,
    padding: '30px',
    background: '#f4f6f8',
    overflowY: 'auto', // Permite scroll no conteúdo principal
    height: '100vh',
    boxSizing: 'border-box',
  };

  const navListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const navItemStyle = {
    marginBottom: '10px',
  };

  // Estilo base do link
  const navLinkStyle = {
    color: '#bdc3c7',
    textDecoration: 'none',
    display: 'block',
    padding: '10px 15px',
    borderRadius: '4px',
    transition: 'background 0.3s, color 0.3s',
  };
  
  // Estilo do link quando a rota está ativa
  const activeLinkStyle = {
    ...navLinkStyle,
    background: '#3498db',
    color: 'white',
    fontWeight: 'bold',
  };

  const sectionTitleStyle = {
      color: '#95a5a6',
      textTransform: 'uppercase',
      fontSize: '0.8em',
      marginTop: '20px',
      marginBottom: '10px',
      borderBottom: '1px solid #34495e',
      paddingBottom: '5px'
  }

  return (
    <div style={appStyle}>
      <aside style={sidebarStyle}>
        <h2 style={{color: 'white', textAlign: 'center', marginBottom: '30px'}}>BD2 - CRUD</h2>
        <nav>
          <ul style={navListStyle}>
            <div style={sectionTitleStyle}>Principal</div>
            <li style={navItemStyle}><Link to="/" style={location.pathname === '/' ? activeLinkStyle : navLinkStyle}>Início</Link></li>
            
            <div style={sectionTitleStyle}>Cadastros</div>
            <li style={navItemStyle}><Link to="/clientes" style={location.pathname === '/clientes' ? activeLinkStyle : navLinkStyle}>Clientes</Link></li>
            <li style={navItemStyle}><Link to="/produtos" style={location.pathname === '/produtos' ? activeLinkStyle : navLinkStyle}>Produtos</Link></li>
            <li style={navItemStyle}><Link to="/pedidos" style={location.pathname === '/pedidos' ? activeLinkStyle : navLinkStyle}>Pedidos</Link></li>
            <li style={navItemStyle}><Link to="/categorias" style={location.pathname === '/categorias' ? activeLinkStyle : navLinkStyle}>Categorias</Link></li>
            <li style={navItemStyle}><Link to="/contas-receber" style={location.pathname === '/contas-receber' ? activeLinkStyle : navLinkStyle}>Contas a Receber</Link></li>
            <li style={navItemStyle}><Link to="/formas-pagamento" style={location.pathname === '/formas-pagamento' ? activeLinkStyle : navLinkStyle}>Formas de Pagamento</Link></li>
            <li style={navItemStyle}><Link to="/usuarios" style={location.pathname === '/usuarios' ? activeLinkStyle : navLinkStyle}>Usuários</Link></li>
            
            <div style={sectionTitleStyle}>Relatórios e Logs</div>
            <li style={navItemStyle}><Link to="/relatorios/financeiro" style={location.pathname === '/relatorios/financeiro' ? activeLinkStyle : navLinkStyle}>Relatório Financeiro</Link></li>
            <li style={navItemStyle}><Link to="/relatorios/clientes-vip" style={location.pathname === '/relatorios/clientes-vip' ? activeLinkStyle : navLinkStyle}>Clientes VIP</Link></li>
            <li style={navItemStyle}><Link to="/relatorios/vendas" style={location.pathname === '/relatorios/vendas' ? activeLinkStyle : navLinkStyle}>Resumo de Vendas</Link></li>
            <li style={navItemStyle}><Link to="/logs" style={location.pathname === '/logs' ? activeLinkStyle : navLinkStyle}>Logs do Sistema</Link></li>
          </ul>
        </nav>
      </aside>

      <main style={mainContentStyle}>
        {/* As rotas renderizam o componente de página correspondente aqui */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Rotas de CRUD */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/contas-receber" element={<ContasReceber />} />
          <Route path="/formas-pagamento" element={<FormasPagamento />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/logs" element={<Logs />} />

          {/* Rotas de Relatórios */}
          <Route path="/relatorios/financeiro" element={<RelatorioFinanceiro />} />
          <Route path="/relatorios/clientes-vip" element={<RelatorioClientesVip />} />
          <Route path="/relatorios/vendas" element={<RelatorioVendas />} />

          {/* Rota para quando nenhum caminho corresponder */}
          <Route path="*" element={<div><h2>Página não encontrada!</h2></div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
