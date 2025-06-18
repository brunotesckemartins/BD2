// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// Importa as rotas
const routes = require('./routes');

// Middlewares
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Usa as rotas definidas no arquivo routes.js
app.use('/api', routes);

// Define a porta a partir do arquivo .env ou usa 3001 como padrão
const PORT = process.env.API_PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
