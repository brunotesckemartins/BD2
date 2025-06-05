
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











