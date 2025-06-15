# BD2 - Sistema Financeiro em PostgreSQL

Este projeto é um sistema financeiro desenvolvido com foco em gerenciamento de clientes, fornecedores, produtos, pedidos de venda e compra, atendimentos e movimentações financeiras. A base de dados foi modelada para atender a uma empresa que necessita controlar todo o ciclo financeiro e operacional, incluindo histórico de pedidos, controle de estoque e registros de atendimento.

O arquivo principal do projeto é o Script.sql, que contém a criação das tabelas, relacionamentos, funções, triggers e índices que garantem a integridade e performance do banco de dados.

##Estrutura do Banco de Dados

O banco possui as seguintes principais entidades:

-CLIENTE: Cadastro de clientes da empresa.

-FORNECEDOR: Cadastro de fornecedores.

-PRODUTO: Registro dos produtos comercializados.

-PEDIDOVENDA / ITEMPEDIDOVENDA: Pedidos de venda realizados e seus itens.

-PEDIDOCOMPRA / ITEMPEDIDOCOMPRA: Pedidos de compra e seus itens para controle de estoque.

-ATENDIMENTO: Registro de atendimentos realizados para clientes.

-FINANCEIRO: Controle das movimentações financeiras, incluindo contas a pagar e receber.

-LOG: Armazena o histórico de alterações e operações no sistema, por meio de triggers.

---

##Modelo completo : 

 Veja o modelo completo [aqui](https://github.com/brunotesckemartins/BD2/blob/main/postgres%20-%20financeiro.png)

---

##Tecnologias e Ferramentas

-Banco de Dados: PostgreSQL

-SQL: DDL para criação de tabelas, DML para inserção e manipulação dos dados, consultas SQL para extração de informações.

-Triggers e Functions: Implementadas para automação de processos, validações e logs automáticos.

-Índices: Criados para otimizar consultas e melhorar performance.

---

##Como usar

1. Instale o PostgreSQL em seu ambiente local ou servidor.

2. CLone este repositório :
    ```bash
   git@github.com:brunotesckemartins/BD2.git
    ```
3. Acesse a pasta do projeto :
    ```bash
    cd BD2
    ```

##Comentários importantes nos commits

-Durante o desenvolvimento, foram destacados nos commits pontos importantes para o entendimento do código, principalmente em:

-Triggers: Automatizam verificações e atualizações no banco.

-Functions: Funções SQL que encapsulam lógicas complexas para reuso.

-Índices e Índices compostos: Essenciais para otimizar o desempenho nas consultas mais frequentes.

[acesse esses comentários](https://github.com/brunotesckemartins/BD2/commit/26d9c0842325ad24d8ff00599b24c3ce1cd2f530)

##Repositório mantido por : Bruno Tescke Martins
email : brunotesckemartins@gmail.com
[Github](https://github.com/brunotesckemartins)

---

##Colaboradores : Gabriel Tomé  [GitHub](https://github.com/GabrielTME)

Tiago Fritzen Palácio   [GitHub](https://github.com/TiagoPalacio)

   
