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
