import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa a API para criação do root React no DOM
import App from './App.jsx';              // Importa o componente principal da aplicação
import { BrowserRouter } from 'react-router-dom'; // Importa o roteador para gerenciamento de rotas

// Cria a raiz da aplicação React no elemento com id 'root' do HTML
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode ativa verificações adicionais em ambiente de desenvolvimento
  <React.StrictMode>
    {/* BrowserRouter habilita o roteamento SPA baseado na URL */}
    <BrowserRouter>
      {/* Renderiza o componente principal da aplicação */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
