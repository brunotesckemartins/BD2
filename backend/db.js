const { Pool } = require('pg');
require('dotenv').config();

// Configura o pool de conexões usando as variáveis de ambiente
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Exporta uma função para executar queries
module.exports = {
  query: (text, params) => pool.query(text, params),
};
