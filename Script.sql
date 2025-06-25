
CREATE TABLE CLIENTE (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf_cnpj VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    telefone VARCHAR(20),
    endereco TEXT,
    data_cadastro DATE DEFAULT CURRENT_DATE
);

CREATE TABLE PEDIDO (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    data_pedido DATE NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDENTE',
    FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente)
);

CREATE TABLE ITEM_PEDIDO (
    id_item SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL,
    descricao VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES PEDIDO(id_pedido)
);

CREATE TABLE CONTA_RECEBER (
    id_conta SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL,
    data_vencimento DATE NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_pagamento DATE,
    status_pagamento VARCHAR(20) DEFAULT 'EM ABERTO',
    FOREIGN KEY (id_pedido) REFERENCES PEDIDO(id_pedido)
);

CREATE TABLE CATEGORIA_PRODUTO (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE PRODUTO (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES CATEGORIA_PRODUTO(id_categoria)
);

CREATE TABLE FORMA_PAGAMENTO (
    id_forma SERIAL PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL
);

CREATE TABLE USUARIO (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    cargo VARCHAR(50)
);

create table LOG(
id_log SERIAL PRIMARY KEY,
id_produto INT NOT NULL,
mensagem TEXT NOT NULL,
DATA TIMESTAMP DEFAULT NOW(),
FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);



INSERT INTO CLIENTE (nome, cpf_cnpj, email, telefone, endereco) VALUES 
('João da Silva', '123.456.789-00', 'joao@email.com', '48999990001', 'Rua A, 123 - Centro'),
('Maria Oliveira', '987.654.321-00', 'maria@email.com', '48999990002', 'Rua B, 456 - Bairro Azul'),
('Carlos Mendes', '555.444.333-00', 'carlos@email.com', '48999990003', 'Rua C, 789 - Bairro Verde'),
('Lúcia Souza', '321.654.987-00', 'lucia@email.com', '48999990004', 'Rua D, 101 - Centro'),
('Pedro Santos', '789.123.456-00', 'pedro@email.com', '48999990005', 'Rua E, 202 - Centro'),
('Ana Lima', '654.321.789-00', 'ana@email.com', '48999990006', 'Rua F, 303 - Centro'),
('Rafael Costa', '222.333.444-55', 'rafael@email.com', '48999990007', 'Rua G, 404 - Bairro Sul'),
('Beatriz Campos', '888.777.666-00', 'beatriz@email.com', '48999990008', 'Rua H, 505 - Bairro Norte'),
('Diego Nunes', '999.000.111-22', 'diego@email.com', '48999990009', 'Rua I, 606 - Bairro Leste'),
('Camila Rocha', '111.222.333-44', 'camila@email.com', '48999990010', 'Rua J, 707 - Bairro Oeste');

INSERT INTO PEDIDO (id_cliente, data_pedido, valor_total) VALUES 
(1, '2025-06-01', 1500.00),
(2, '2025-06-02', 800.00),
(3, '2025-06-03', 2500.00),
(4, '2025-06-04', 700.00),
(5, '2025-06-05', 1800.00),
(6, '2025-06-06', 950.00),
(7, '2025-06-07', 620.00),
(8, '2025-06-08', 1350.00),
(9, '2025-06-09', 2750.00),
(10, '2025-06-10', 420.00);

INSERT INTO ITEM_PEDIDO (id_pedido, descricao, quantidade, preco_unitario) VALUES 
(1, 'Notebook Dell', 1, 1500.00),
(2, 'Monitor LG 24"', 1, 800.00),
(3, 'Kit Gamer: Mouse + Teclado', 1, 500.00),
(3, 'Cadeira Gamer ThunderX3', 1, 800.00),
(3, 'Webcam Logitech C920', 1, 300.00),
(4, 'Mousepad XXL', 2, 50.00),
(5, 'Impressora Epson', 1, 800.00),
(6, 'Headset JBL', 1, 400.00),
(7, 'HD Externo 1TB', 1, 400.00),
(8, 'Teclado Mecânico', 1, 350.00);

INSERT INTO CONTA_RECEBER (id_pedido, data_vencimento, valor) VALUES 
(1, '2025-06-10', 1500.00),
(2, '2025-06-10', 400.00),
(2, '2025-07-10', 400.00),
(3, '2025-06-15', 1250.00),
(3, '2025-07-15', 1250.00),
(4, '2025-06-11', 700.00),
(5, '2025-06-20', 1800.00),
(6, '2025-06-13', 950.00),
(7, '2025-06-14', 620.00),
(8, '2025-06-15', 1350.00);

INSERT INTO CATEGORIA_PRODUTO (nome) VALUES
('Informática'),
('Periféricos'),
('Acessórios'),
('Cadeiras'),
('Áudio'),
('Vídeo'),
('Armazenamento'),
('Impressoras'),
('Redes'),
('Outros');

INSERT INTO PRODUTO (nome, preco, id_categoria) VALUES
('Notebook Lenovo', 3200.00, 1),
('Monitor Samsung 27"', 1200.00, 2),
('Mouse Logitech G203', 150.00, 2),
('Headset HyperX Cloud II', 600.00, 5),
('Cadeira Gamer DT3', 900.00, 4),
('HD Externo 1TB', 400.00, 7),
('Impressora Epson EcoTank', 800.00, 8),
('Roteador TP-Link AC1200', 250.00, 9),
('Teclado Mecânico Redragon', 280.00, 2),
('Webcam Microsoft HD', 350.00, 6);

INSERT INTO FORMA_PAGAMENTO (descricao) VALUES
('Boleto Bancário'),
('Cartão de Crédito'),
('Cartão de Débito'),
('PIX'),
('Transferência Bancária'),
('Dinheiro'),
('Cheque'),
('Pagamento Online'),
('Fiado'),
('Carnê');

INSERT INTO USUARIO (nome, email, senha, cargo) VALUES
('Ana Ribeiro', 'ana@empresa.com', 'senha123', 'Atendente'),
('Lucas Silva', 'lucas@empresa.com', 'senha123', 'Financeiro'),
('Fernanda Lima', 'fernanda@empresa.com', 'senha123', 'Administrador'),
('Tiago Rocha', 'tiago@empresa.com', 'senha123', 'Atendente'),
('Juliana Prado', 'juliana@empresa.com', 'senha123', 'Gerente'),
('Carlos Souza', 'carlos@empresa.com', 'senha123', 'Financeiro'),
('Patrícia Duarte', 'patricia@empresa.com', 'senha123', 'Financeiro'),
('Marcos Gomes', 'marcos@empresa.com', 'senha123', 'Vendedor'),
('Beatriz Nunes', 'beatriz@empresa.com', 'senha123', 'Administrador'),
('Renato Campos', 'renato@empresa.com', 'senha123', 'Suporte');

----------------------------------------------------------
				--FUNCTIONS--
----------------------------------------------------------

-- faz relacao entre pedido e usuario
ALTER TABLE PEDIDO ADD COLUMN id_usuario INT;
ALTER TABLE PEDIDO ADD CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario);
-- faz relacao entre forma de pedido e forma de pagamento 
ALTER TABLE PEDIDO ADD COLUMN id_forma_pagamento INT;
ALTER TABLE PEDIDO ADD CONSTRAINT fk_forma_pagamento FOREIGN KEY (id_forma_pagamento) REFERENCES FORMA_PAGAMENTO(id_forma);
--faz relacao entre conta a receber e forma de pagamento
ALTER TABLE CONTA_RECEBER ADD COLUMN id_forma_pagamento INT;
ALTER TABLE CONTA_RECEBER ADD CONSTRAINT fk_conta_forma_pagamento FOREIGN KEY (id_forma_pagamento) REFERENCES FORMA_PAGAMENTO(id_forma);
-- essas alteracoes fazem a relacao de quem realizou cada pedido, como cada pedido foi feito
-- e como cada conta a receber foi quitada

-- 1.gera um resumo financeiro por cliente com totais de pedidos,valores e contagem de atrasos,por periodo
CREATE OR REPLACE FUNCTION relatorio_financeiro(
    data_inicio DATE DEFAULT CURRENT_DATE - INTERVAL '1 month',
    data_fim DATE DEFAULT CURRENT_DATE
) 
RETURNS TABLE (
    cliente_id INT,
    cliente_nome VARCHAR(100),
    total_pedidos DECIMAL(12,2),
    total_pago DECIMAL(12,2),
    total_pendente DECIMAL(12,2),
    pedidos_em_atraso INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id_cliente AS cliente_id,
        c.nome AS cliente_nome,
        COALESCE(SUM(p.valor_total), 0) AS total_pedidos,
        COALESCE(SUM(CASE WHEN cr.status_pagamento = 'PAGO' THEN cr.valor ELSE 0 END), 0) AS total_pago,
        COALESCE(SUM(CASE WHEN cr.status_pagamento = 'EM ABERTO' THEN cr.valor ELSE 0 END), 0) AS total_pendente,
        CAST(COUNT(CASE WHEN cr.status_pagamento = 'EM ABERTO' AND cr.data_vencimento < CURRENT_DATE THEN 1 END) AS INT) AS pedidos_em_atraso
    FROM 
        CLIENTE c
        LEFT JOIN PEDIDO p ON c.id_cliente = p.id_cliente
        LEFT JOIN CONTA_RECEBER cr ON p.id_pedido = cr.id_pedido
    WHERE 
        p.data_pedido BETWEEN $1 AND $2
    GROUP BY 
        c.id_cliente, c.nome
    ORDER BY 
        total_pendente DESC;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM relatorio_financeiro();
--

--2.mostra os clientes que fizeram pelo menos 3 pedidos finalizados no periodo e calculda ticket
CREATE OR REPLACE FUNCTION clientes_fieis(
    min_pedidos INT DEFAULT 1,
    data_inicio DATE DEFAULT '2020-01-01',
    data_fim DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    id_cliente INT,
    nome_cliente VARCHAR,
    total_pedidos BIGINT,
    ticket_medio DECIMAL(12,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id_cliente,
        c.nome,
        COUNT(p.id_pedido) AS total_pedidos,
        ROUND(AVG(p.valor_total), 2) AS ticket_medio
    FROM
        CLIENTE c
        JOIN PEDIDO p ON c.id_cliente = p.id_cliente
    WHERE
        p.data_pedido BETWEEN data_inicio AND data_fim
    GROUP BY
        c.id_cliente, c.nome
    HAVING
        COUNT(p.id_pedido) >= min_pedidos
    ORDER BY
        total_pedidos DESC;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM clientes_fieis();

--3.calcula a media dos valores totais de todos os pedidos
CREATE OR REPLACE FUNCTION pedidos_acima_da_media()
RETURNS TABLE (
    id_pedido INT,
    cliente VARCHAR,
    data_pedido DATE,
    valor_total DECIMAL(10,2),
    status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id_pedido,
        c.nome AS cliente,
        p.data_pedido,
        p.valor_total,
        p.status
    FROM pedido p
    JOIN cliente c ON c.id_cliente = p.id_cliente
    WHERE p.valor_total > (
        SELECT AVG(pedido.valor_total) FROM pedido
    )
    ORDER BY p.valor_total DESC;
END;
$$ LANGUAGE plpgsql;


SELECT * FROM pedidos_acima_da_media();

----------------------------------------------------------
				--PROCEDURES--
----------------------------------------------------------

--1.Identifica produtos encalhados (sem nenhuma venda recente).
CREATE OR REPLACE PROCEDURE procedure_produtos_estagnados()
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE NOTICE 'Produtos estagnados nos últimos 3 meses:';
    RAISE NOTICE 'id_produto | nome';

    PERFORM (
        SELECT pr.id_produto, pr.nome
        FROM produto pr
        WHERE NOT EXISTS (
            SELECT 1
            FROM itempedidovenda ip
            JOIN pedido p ON ip.id_pedido = p.id_pedido
            WHERE ip.id_produto = pr.id_produto
              AND p.status = 'FINALIZADO'
              AND p.data_pedido >= CURRENT_DATE - INTERVAL '3 months'
        )
        ORDER BY pr.nome
    );
END;
$$;

--2.Mostra o cliente que mais gastou em cada mês do ano atual.
CREATE OR REPLACE PROCEDURE procedure_top_clientes_cada_mes(
    ano INT DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE NOTICE 'Top cliente por mês no ano %:', ano;
    RAISE NOTICE 'mês | id_cliente | nome | total_gasto';

    PERFORM (
        WITH total_mes AS (
            SELECT 
                EXTRACT(MONTH FROM p.data_pedido) AS mes,
                c.id_cliente,
                c.nome,
                SUM(p.valor_total) AS total_gasto,
                RANK() OVER (PARTITION BY EXTRACT(MONTH FROM p.data_pedido)
                             ORDER BY SUM(p.valor_total) DESC) AS pos
            FROM cliente c
            JOIN pedido p ON c.id_cliente = p.id_cliente
            WHERE EXTRACT(YEAR FROM p.data_pedido) = ano
              AND p.status = 'FINALIZADO'
            GROUP BY mes, c.id_cliente, c.nome
        )
        SELECT mes, id_cliente, nome, total_gasto
        FROM total_mes
        WHERE pos = 1
        ORDER BY mes
    );
END;
$$;

--3.Detecta produtos esgotados e ainda à venda.
CREATE OR REPLACE PROCEDURE procedure_alerta_produto_sem_estoque()
LANGUAGE plpgsql
AS $$
DECLARE
    produto RECORD;
BEGIN
    FOR produto IN
        SELECT id_produto, nome
        FROM produto
        WHERE estoque = 0
    LOOP
        INSERT INTO log (mensagem, data, id_produto)
        VALUES (
            FORMAT('[ALERTA] Produto "%s" está com estoque zerado!', produto.nome),
            NOW(),
            produto.id_produto
        );

        RAISE NOTICE 'Produto sem estoque: %', produto.nome;
    END LOOP;
END;
$$;


CALL procedure_alerta_produto_sem_estoque();

----------------------------------------------------------
				--TRIGGER--
----------------------------------------------------------

--
CREATE OR REPLACE FUNCTION bloquear_pagamento_duplicado()
RETURNS TRIGGER AS $$
DECLARE
    id_produto_exemplo INT := (SELECT id_produto FROM PRODUTO LIMIT 1); -- só para preencher o campo obrigatório
    mensagem TEXT;
BEGIN
    IF EXISTS (
        SELECT 1 FROM CONTA_RECEBER
        WHERE id_pedido = NEW.id_pedido
          AND valor = NEW.valor
          AND data_pagamento = NEW.data_pagamento
          AND data_pagamento IS NOT NULL
    ) THEN
        mensagem := FORMAT(
            '[ALERTA] Pagamento duplicado detectado para pedido ID %s! Valor: %.2f, Data: %s',
            NEW.id_pedido, NEW.valor, TO_CHAR(NEW.data_pagamento, 'YYYY-MM-DD')
        );

        INSERT INTO LOG (id_produto, mensagem, data)
        VALUES (id_produto_exemplo, mensagem, NOW());

        RAISE EXCEPTION '%', mensagem;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_bloquear_pagamento_duplicado
BEFORE INSERT ON CONTA_RECEBER
FOR EACH ROW
EXECUTE FUNCTION bloquear_pagamento_duplicado();


----------------------------------------------------------
				--VIEWS E INDICES--
----------------------------------------------------------

--1.total de vendas por mês e quantidade de pedidos finalizados
CREATE OR REPLACE VIEW view_resumo_vendas_mensal AS
SELECT 
    DATE_TRUNC('month', p.data_pedido) AS mes,
    COUNT(*) AS total_pedidos,
    SUM(p.valor_total) AS total_vendido
FROM pedido p
WHERE p.status = 'FINALIZADO'
GROUP BY mes
ORDER BY mes;

--2.clientes com maior gasto total
CREATE OR REPLACE VIEW view_cliente_top_5 AS
SELECT 
    c.id_cliente,
    c.nome,
    COUNT(p.id_pedido) AS total_pedidos,
    SUM(p.valor_total) AS total_gasto
FROM cliente c
JOIN pedido p ON c.id_cliente = p.id_cliente
WHERE p.status = 'FINALIZADO'
GROUP BY c.id_cliente, c.nome
ORDER BY total_gasto DESC
LIMIT 5;

--3.mostra clientes com maiores compras acumuladas,alem do valor medio por pedidoe o dia do pedido mais recente
CREATE OR REPLACE VIEW view_clientes_vip AS
SELECT 
    c.id_cliente,
    c.nome,
    COUNT(p.id_pedido) AS total_pedidos,
    COALESCE(SUM(p.valor_total), 0) AS valor_total_compras,
    ROUND(AVG(p.valor_total), 2) AS ticket_medio,
    MAX(p.data_pedido) AS ultima_compra
FROM CLIENTE c
LEFT JOIN PEDIDO p ON c.id_cliente = p.id_cliente AND p.status = 'FINALIZADO'
GROUP BY c.id_cliente, c.nome
HAVING COUNT(p.id_pedido) > 0
ORDER BY valor_total_compras DESC;

--atualiza o status dos para 'FINALIZADO' 
UPDATE PEDIDO SET status = 'FINALIZADO' WHERE status = 'PENDENTE';

SELECT * FROM view_clientes_vip;

--
CREATE INDEX idx_pedido_status ON pedido(status);
CREATE INDEX idx_pedido_data_pedido ON pedido(data_pedido);
CREATE INDEX idx_pedido_id_cliente ON pedido(id_cliente);
CREATE INDEX idx_itempedido_id_pedido ON item_pedido(id_pedido);

ALTER TABLE produto ADD COLUMN estoque INT DEFAULT 0;

UPDATE produto SET estoque = 0 WHERE id_produto = 1;

