const express = require('express');
const db = require('./db');
const router = express.Router();

/**
 * Função auxiliar para executar consultas no banco de dados e tratar erros.
 * @param {object} res - O objeto de resposta do Express.
 * @param {string} query - A string da consulta SQL.
 * @param {Array} params - Os parâmetros para a consulta SQL.
 * @param {number} successStatusCode - O código de status HTTP para sucesso (padrão 200).
 */
const executeQuery = async (res, query, params = [], successStatusCode = 200) => {
  try {
    const result = await db.query(query, params);
    // Se o resultado estiver vazio, retorna 204 No Content, senão, os dados com o código de sucesso
    if (result.rows.length === 0 && successStatusCode === 200) {
        res.status(204).send(); // No Content
    } else {
        res.status(successStatusCode).json(result.rows);
    }
  } catch (error) {
    console.error('Erro ao executar a query:', {
      query: query,
      params: params,
      errorMessage: error.message,
    });
    // Retorna um erro 500 com a mensagem específica do PostgreSQL
    res.status(500).json({ 
        error: 'Erro interno do servidor.', 
        details: error.message 
    });
  }
};

// =================================================================
// --- CRUD: CLIENTE ---
// =================================================================
router.get('/clientes', (req, res) => executeQuery(res, 'SELECT * FROM CLIENTE ORDER BY nome'));
router.get('/clientes/:id', (req, res) => executeQuery(res, 'SELECT * FROM CLIENTE WHERE id_cliente = $1', [req.params.id]));
router.post('/clientes', (req, res) => {
  const { nome, cpf_cnpj, email, telefone, endereco } = req.body;
  executeQuery(res, 'INSERT INTO CLIENTE (nome, cpf_cnpj, email, telefone, endereco) VALUES ($1, $2, $3, $4, $5) RETURNING *', [nome, cpf_cnpj, email, telefone, endereco], 201);
});
router.put('/clientes/:id', (req, res) => {
  const { nome, cpf_cnpj, email, telefone, endereco } = req.body;
  executeQuery(res, 'UPDATE CLIENTE SET nome = $1, cpf_cnpj = $2, email = $3, telefone = $4, endereco = $5 WHERE id_cliente = $6 RETURNING *', [nome, cpf_cnpj, email, telefone, endereco, req.params.id]);
});
router.delete('/clientes/:id', (req, res) => executeQuery(res, 'DELETE FROM CLIENTE WHERE id_cliente = $1 RETURNING *', [req.params.id]));


// =================================================================
// --- CRUD: PRODUTO ---
// =================================================================
router.get('/produtos', (req, res) => executeQuery(res, 'SELECT p.*, c.nome as nome_categoria FROM PRODUTO p JOIN CATEGORIA_PRODUTO c ON p.id_categoria = c.id_categoria ORDER BY p.nome'));
router.get('/produtos/:id', (req, res) => executeQuery(res, 'SELECT p.*, c.nome as nome_categoria FROM PRODUTO p JOIN CATEGORIA_PRODUTO c ON p.id_categoria = c.id_categoria WHERE id_produto = $1', [req.params.id]));
router.post('/produtos', (req, res) => {
  const { nome, preco, id_categoria, estoque } = req.body;
  executeQuery(res, 'INSERT INTO PRODUTO (nome, preco, id_categoria, estoque) VALUES ($1, $2, $3, $4) RETURNING *', [nome, preco, id_categoria, estoque], 201);
});
router.put('/produtos/:id', (req, res) => {
  const { nome, preco, id_categoria, estoque } = req.body;
  executeQuery(res, 'UPDATE PRODUTO SET nome = $1, preco = $2, id_categoria = $3, estoque = $4 WHERE id_produto = $5 RETURNING *', [nome, preco, id_categoria, estoque, req.params.id]);
});
router.delete('/produtos/:id', (req, res) => executeQuery(res, 'DELETE FROM PRODUTO WHERE id_produto = $1 RETURNING *', [req.params.id]));


// =================================================================
// --- CRUD: CATEGORIA_PRODUTO ---
// =================================================================
router.get('/categorias', (req, res) => executeQuery(res, 'SELECT * FROM CATEGORIA_PRODUTO ORDER BY nome'));
router.get('/categorias/:id', (req, res) => executeQuery(res, 'SELECT * FROM CATEGORIA_PRODUTO WHERE id_categoria = $1', [req.params.id]));
router.post('/categorias', (req, res) => {
    const { nome } = req.body;
    executeQuery(res, 'INSERT INTO CATEGORIA_PRODUTO (nome) VALUES ($1) RETURNING *', [nome], 201);
});
router.put('/categorias/:id', (req, res) => {
    const { nome } = req.body;
    executeQuery(res, 'UPDATE CATEGORIA_PRODUTO SET nome = $1 WHERE id_categoria = $2 RETURNING *', [nome, req.params.id]);
});
router.delete('/categorias/:id', (req, res) => executeQuery(res, 'DELETE FROM CATEGORIA_PRODUTO WHERE id_categoria = $1 RETURNING *', [req.params.id]));


// =================================================================
// --- CRUD: PEDIDO ---
// =================================================================
router.get('/pedidos', (req, res) => executeQuery(res, 'SELECT p.*, c.nome as nome_cliente FROM PEDIDO p JOIN CLIENTE c ON p.id_cliente = c.id_cliente ORDER BY p.data_pedido DESC'));
router.get('/pedidos/:id', (req, res) => executeQuery(res, 'SELECT p.*, c.nome as nome_cliente FROM PEDIDO p JOIN CLIENTE c ON p.id_cliente = c.id_cliente WHERE id_pedido = $1', [req.params.id]));
router.post('/pedidos', (req, res) => {
    const { id_cliente, data_pedido, valor_total, status, id_usuario, id_forma_pagamento } = req.body;
    executeQuery(res, 'INSERT INTO PEDIDO (id_cliente, data_pedido, valor_total, status, id_usuario, id_forma_pagamento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [id_cliente, data_pedido, valor_total, status, id_usuario, id_forma_pagamento], 201);
});
router.put('/pedidos/:id', (req, res) => {
    const { id_cliente, data_pedido, valor_total, status, id_usuario, id_forma_pagamento } = req.body;
    executeQuery(res, 'UPDATE PEDIDO SET id_cliente = $1, data_pedido = $2, valor_total = $3, status = $4, id_usuario = $5, id_forma_pagamento = $6 WHERE id_pedido = $7 RETURNING *', [id_cliente, data_pedido, valor_total, status, id_usuario, id_forma_pagamento, req.params.id]);
});
router.delete('/pedidos/:id', (req, res) => executeQuery(res, 'DELETE FROM PEDIDO WHERE id_pedido = $1 RETURNING *', [req.params.id]));


// =================================================================
// --- CRUD: ITEM_PEDIDO ---
// =================================================================
router.get('/pedidos/:id_pedido/itens', (req, res) => executeQuery(res, 'SELECT * FROM ITEM_PEDIDO WHERE id_pedido = $1 ORDER BY id_item', [req.params.id_pedido]));
router.post('/itens_pedido', (req, res) => {
    const { id_pedido, descricao, quantidade, preco_unitario } = req.body;
    executeQuery(res, 'INSERT INTO ITEM_PEDIDO (id_pedido, descricao, quantidade, preco_unitario) VALUES ($1, $2, $3, $4) RETURNING *', [id_pedido, descricao, quantidade, preco_unitario], 201);
});
router.put('/itens_pedido/:id', (req, res) => {
    const { id_pedido, descricao, quantidade, preco_unitario } = req.body;
    executeQuery(res, 'UPDATE ITEM_PEDIDO SET id_pedido = $1, descricao = $2, quantidade = $3, preco_unitario = $4 WHERE id_item = $5 RETURNING *', [id_pedido, descricao, quantidade, preco_unitario, req.params.id]);
});
router.delete('/itens_pedido/:id', (req, res) => executeQuery(res, 'DELETE FROM ITEM_PEDIDO WHERE id_item = $1 RETURNING *', [req.params.id]));


// =================================================================
// --- CRUD: CONTA-RECEBER ---
// =================================================================
router.get('/contas-receber', (req, res) => executeQuery(res, 'SELECT * FROM CONTA_RECEBER ORDER BY data_vencimento'));
router.get('/contas-receber/:id', (req, res) => executeQuery(res, 'SELECT * FROM CONTA_RECEBER WHERE id_conta = $1', [req.params.id]));
router.post('/contas-receber', (req, res) => {
    const { id_pedido, data_vencimento, valor, data_pagamento, status_pagamento, id_forma_pagamento } = req.body;
    executeQuery(res, 'INSERT INTO CONTA_RECEBER (id_pedido, data_vencimento, valor, data_pagamento, status_pagamento, id_forma_pagamento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [id_pedido, data_vencimento, valor, data_pagamento, status_pagamento, id_forma_pagamento], 201);
});
router.put('/contas-receber/:id', (req, res) => {
    const { id_pedido, data_vencimento, valor, data_pagamento, status_pagamento, id_forma_pagamento } = req.body;
    executeQuery(res, 'UPDATE CONTA_RECEBER SET id_pedido = $1, data_vencimento = $2, valor = $3, data_pagamento = $4, status_pagamento = $5, id_forma_pagamento = $6 WHERE id_conta = $7 RETURNING *', [id_pedido, data_vencimento, valor, data_pagamento, status_pagamento, id_forma_pagamento, req.params.id]);
});
router.delete('/contas-receber/:id', (req, res) => executeQuery(res, 'DELETE FROM CONTA_RECEBER WHERE id_conta = $1 RETURNING *', [req.params.id]));


// =================================================================
// --- CRUD: FORMAS-PAGAMENTO ---
// =================================================================
router.get('/formas-pagamento', (req, res) => executeQuery(res, 'SELECT * FROM FORMA_PAGAMENTO ORDER BY descricao'));
router.get('/formas-pagamento/:id', (req, res) => executeQuery(res, 'SELECT * FROM FORMA_PAGAMENTO WHERE id_forma = $1', [req.params.id]));
router.post('/formas-pagamento', (req, res) => {
    const { descricao } = req.body;
    executeQuery(res, 'INSERT INTO FORMA_PAGAMENTO (descricao) VALUES ($1) RETURNING *', [descricao], 201);
});
router.put('/formas-pagamento/:id', (req, res) => {
    const { descricao } = req.body;
    executeQuery(res, 'UPDATE FORMA_PAGAMENTO SET descricao = $1 WHERE id_forma = $2 RETURNING *', [descricao, req.params.id]);
});
router.delete('/formas-pagamento/:id', (req, res) => executeQuery(res, 'DELETE FROM FORMA_PAGAMENTO WHERE id_forma = $1 RETURNING *', [req.params.id]));


// =================================================================
// --- CRUD: USUARIO ---
// =================================================================
router.get('/usuarios', (req, res) => executeQuery(res, 'SELECT id_usuario, nome, email, cargo FROM USUARIO ORDER BY nome'));
router.get('/usuarios/:id', (req, res) => executeQuery(res, 'SELECT id_usuario, nome, email, cargo FROM USUARIO WHERE id_usuario = $1', [req.params.id]));
router.post('/usuarios', (req, res) => {
    const { nome, email, senha, cargo } = req.body;
    executeQuery(res, 'INSERT INTO USUARIO (nome, email, senha, cargo) VALUES ($1, $2, $3, $4) RETURNING id_usuario, nome, email, cargo', [nome, email, senha, cargo], 201);
});
router.put('/usuarios/:id', (req, res) => {
    const { nome, email, cargo } = req.body;
    // Não incluímos a senha na atualização para simplificar. 
    // Atualizar senha geralmente é um processo separado.
    executeQuery(res, 'UPDATE USUARIO SET nome = $1, email = $2, cargo = $3 WHERE id_usuario = $4 RETURNING id_usuario, nome, email, cargo', [nome, email, cargo, req.params.id]);
});
router.delete('/usuarios/:id', (req, res) => executeQuery(res, 'DELETE FROM USUARIO WHERE id_usuario = $1 RETURNING *', [req.params.id]));


// =================================================================
// --- LOG (SOMENTE LEITURA) ---
// =================================================================
router.get('/logs', (req, res) => executeQuery(res, 'SELECT * FROM LOG ORDER BY data DESC'));


// =================================================================
// --- ROTAS PARA VIEWS (SOMENTE LEITURA) ---
// =================================================================
router.get('/view/resumo_vendas', (req, res) => executeQuery(res, 'SELECT * FROM view_resumo_vendas_mensal'));
router.get('/view/top5_clientes', (req, res) => executeQuery(res, 'SELECT * FROM view_cliente_top_5'));
router.get('/view/clientes_vip', (req, res) => executeQuery(res, 'SELECT * FROM view_clientes_vip'));


// =================================================================
// --- ROTAS PARA FUNCTIONS (SOMENTE LEITURA) ---
// =================================================================
router.get('/functions/relatorio_financeiro', (req, res) => {
  // Parâmetros são opcionais, a função tem valores padrão
  const { data_inicio = null, data_fim = null } = req.query; // Ex: /api/functions/relatorio_financeiro?data_inicio=2025-01-01&data_fim=2025-06-01
  executeQuery(res, 'SELECT * FROM relatorio_financeiro($1, $2)', [data_inicio, data_fim]);
});

router.get('/functions/clientes_fieis', (req, res) => {
  // Parâmetros são opcionais, a função tem valores padrão
  const { min_pedidos = null, data_inicio = null, data_fim = null } = req.query;
  executeQuery(res, 'SELECT * FROM clientes_fieis($1, $2, $3)', [min_pedidos, data_inicio, data_fim]);
});

router.get('/functions/pedidos_acima_media', (req, res) => {
    executeQuery(res, 'SELECT * FROM pedidos_acima_da_media()');
});


// Exporta o router para ser usado no server.js
module.exports = router;
