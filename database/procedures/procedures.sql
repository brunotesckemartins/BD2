/*====================================================================
  VISÃO GERAL — TIPOS DE OBJETOS NO SCRIPT
  --------------------------------------------------------------------
  • FUNCTIONS  : retornam dados (relatórios, cálculos, filtros reutilizáveis)
  • PROCEDURES : executam ações administrativas / de manutenção
  • TRIGGERS   : gatilhos automáticos disparados em INSERT/UPDATE/DELETE
  • VIEWS      : consultas salvas como “tabelas virtuais” para relatórios
====================================================================*/

/*====================================================================
  FUNCTIONS
====================================================================*/

/*--------------------------------------------------------------------
  FUNCTION: relatorio_financeiro(
              data_inicio DATE DEFAULT CURRENT_DATE-INTERVAL '1 month',
              data_fim    DATE DEFAULT CURRENT_DATE)
  --------------------------------------------------------------------
  ➤ O que faz?
    • Para cada cliente devolve:
      - total de pedidos
      - total pago
      - total pendente
      - quantidade de pedidos em atraso
  ➤ Como usar:
      SELECT * FROM relatorio_financeiro('2025-06-01','2025-06-30');
--------------------------------------------------------------------*/

/*--------------------------------------------------------------------
  FUNCTION: clientes_fieis(
              min_pedidos INT DEFAULT 1,
              data_inicio DATE DEFAULT '2020-01-01',
              data_fim    DATE DEFAULT CURRENT_DATE)
  --------------------------------------------------------------------
  ➤ O que faz?
    • Lista clientes que fizeram pelo menos <min_pedidos>
      pedidos FINALIZADOS no intervalo.
    • Calcula o ticket médio (valor médio gasto por pedido).
  ➤ Como usar:
      SELECT * FROM clientes_fieis(2,'2025-06-01','2025-06-30');
--------------------------------------------------------------------*/

/*--------------------------------------------------------------------
  FUNCTION: pedidos_acima_da_media()
  --------------------------------------------------------------------
  ➤ O que faz?
    • Devolve todos os pedidos cujo valor_total é maior
      que a média de todos os pedidos.
  ➤ Como usar:
      SELECT * FROM pedidos_acima_da_media();
--------------------------------------------------------------------*/

/*====================================================================
  PROCEDURES
====================================================================*/

/*--------------------------------------------------------------------
  PROCEDURE: procedure_alerta_produto_sem_estoque()
  --------------------------------------------------------------------
  ➤ O que faz?
    • Procura produtos com estoque = 0.
    • Insere alerta na tabela LOG e exibe RAISE NOTICE.
  ➤ Como usar:
      CALL procedure_alerta_produto_sem_estoque();
--------------------------------------------------------------------*/

/*--------------------------------------------------------------------
  PROCEDURE: procedure_top_clientes_cada_mes(ano INT DEFAULT ano atual)
  --------------------------------------------------------------------
  ➤ O que faz?
    • Para cada mês do ano informado mostra, via NOTICE,
      o cliente que mais gastou (pedidos FINALIZADOS).
  ➤ Como usar:
      CALL procedure_top_clientes_cada_mes(2025);
--------------------------------------------------------------------*/

/*--------------------------------------------------------------------
  PROCEDURE: procedure_produtos_estagnados()
  --------------------------------------------------------------------
  ➤ O que faz?
    • Lista produtos sem nenhuma venda FINALIZADA
      nos últimos 3 meses (RAISE NOTICE linha a linha).
  ➤ Como usar:
      CALL procedure_produtos_estagnados();
--------------------------------------------------------------------*/

/*====================================================================
  TRIGGERS
====================================================================*/

/*--------------------------------------------------------------------
  TRIGGER: tg_bloquear_pagamento_duplicado  (BEFORE INSERT ON CONTA_RECEBER)
  --------------------------------------------------------------------
  ➤ O que faz?
    • Impede lançar duas vezes o mesmo pagamento (mesmo id_pedido,
      valor e data_pagamento).
    • Quando detecta duplicidade:
        - grava alerta na tabela LOG
        - lança EXCEPTION cancelando o INSERT
  ➤ Como testar:
      -- 1ª inserção OK
      INSERT INTO conta_receber (..., valor, data_pagamento) VALUES (...);
      -- 2ª (mesmos valores) → erro gerado pelo trigger
--------------------------------------------------------------------*/

/*====================================================================
  VIEWS
====================================================================*/

/*--------------------------------------------------------------------
  VIEW: view_resumo_vendas_mensal
  --------------------------------------------------------------------
  ➤ Conteúdo:
    • mês (DATE_TRUNC 'month')
    • total_pedidos  – quantidade de pedidos FINALIZADOS no mês
    • total_vendido  – soma valor_total desses pedidos
  ➤ Consulta:
      SELECT * FROM view_resumo_vendas_mensal;
--------------------------------------------------------------------*/

/*--------------------------------------------------------------------
  VIEW: view_cliente_top_5
  --------------------------------------------------------------------
  ➤ Conteúdo:
    • Top 5 clientes por valor_total (somente pedidos FINALIZADOS)
    • total_pedidos   – nº de pedidos finalizados
    • total_gasto     – soma valor_total
  ➤ Consulta:
      SELECT * FROM view_cliente_top_5;
--------------------------------------------------------------------*/

/*--------------------------------------------------------------------
  VIEW: view_clientes_vip
  --------------------------------------------------------------------
  ➤ Conteúdo por cliente:
    • total_pedidos         – nº de pedidos FINALIZADOS
    • valor_total_compras   – soma desses pedidos
    • ticket_medio          – média por pedido
    • ultima_compra         – data do pedido mais recente
  ➤ Consulta:
      SELECT * FROM view_clientes_vip;
--------------------------------------------------------------------*/




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
DECLARE
  produto_estagnado RECORD;
BEGIN
  RAISE NOTICE 'Produtos estagnados nos últimos 3 meses:';
  RAISE NOTICE 'id_produto | nome';

  FOR produto_estagnado IN
    SELECT pr.id_produto, pr.nome
    FROM produto pr
    WHERE NOT EXISTS (
      SELECT 1
      FROM item_pedido ip
      JOIN pedido p ON ip.id_pedido = p.id_pedido
      WHERE ip.descricao = pr.nome
        AND p.status = 'FINALIZADO'
        AND p.data_pedido >= CURRENT_DATE - INTERVAL '3 months'
    )
    ORDER BY pr.nome
  LOOP
    RAISE NOTICE '% | %', produto_estagnado.id_produto, produto_estagnado.nome;
  END LOOP;
END;
$$;



--2.Mostra o cliente que mais gastou em cada mês do ano atual.
CREATE OR REPLACE PROCEDURE procedure_top_clientes_cada_mes(ano INT)
LANGUAGE plpgsql
AS $$
DECLARE
  v_mes INT;
  v_id_cliente INT;
  v_nome TEXT;
  v_total_gasto NUMERIC;
BEGIN
  RAISE NOTICE 'Top cliente por mês no ano %:', ano;

  FOR v_mes, v_id_cliente, v_nome, v_total_gasto IN
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
  LOOP
    RAISE NOTICE '% | % | % | %', v_mes, v_id_cliente, v_nome, v_total_gasto;
  END LOOP;
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
    id_produto_exemplo INT := (SELECT id_produto FROM PRODUTO LIMIT 1); -- preenche FK do LOG
    mensagem TEXT;
BEGIN
    -- Se já existir pagamento igual (mesmo pedido, valor e data)
    IF EXISTS (
        SELECT 1
        FROM CONTA_RECEBER
        WHERE id_pedido      = NEW.id_pedido
          AND valor          = NEW.valor
          AND data_pagamento = NEW.data_pagamento
          AND data_pagamento IS NOT NULL
    ) THEN
    
        mensagem := FORMAT(
            '[ALERTA] Pagamento duplicado detectado para pedido ID %s! Valor: %s, Data: %s',
            NEW.id_pedido,
            TO_CHAR(NEW.valor, 'FM999999999.00'),          -- 2 casas decimais
            TO_CHAR(NEW.data_pagamento, 'YYYY-MM-DD')
        );

        INSERT INTO LOG (id_produto, mensagem, data)
        VALUES (id_produto_exemplo, mensagem, NOW());

        RAISE EXCEPTION '%', mensagem;  -- cancela a inserção
    END IF;

    RETURN NEW;  -- segue o fluxo se não houver duplicidade
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER tg_bloquear_pagamento_duplicado
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
