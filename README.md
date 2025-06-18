# BD2 - Sistema Financeiro em PostgreSQL

Este projeto é um sistema de gestão completo desenvolvido com um backend em PostgreSQL e um frontend interativo em React. O sistema permite o gerenciamento de clientes, produtos, pedidos, usuários e finanças, com um frontend projetado para facilitar a interação e manipulação dos dados.

A base de dados foi modelada para atender a uma empresa que necessita controlar seu ciclo de vendas e financeiro, incluindo histórico de pedidos, contas a receber e logs de operações.

O diretório `database/` contém os scripts SQL para a criação de tabelas, relacionamentos, funções, triggers e índices que garantem a integridade e performance do banco de dados. O diretório `frontend/` contém a aplicação React (Vite) para interação com o sistema.

---

## Modelo do Banco de Dados

Veja o modelo relacional completo [aqui](https://github.com/brunotesckemartins/BD2/blob/main/postgres%20-%20financeiro.png).

---

## Estrutura do Projeto

```text
├── database/
│   ├── ddl/ddl.sql               # Criação das tabelas e relacionamentos
│   ├── dml/dml.sql               # Inserção de dados de exemplo
│   └── procedures/procedures.sql # Funções, Views, Triggers e Índices
│
└── frontend/
    ├── public/
    └── src/                      # Código-fonte da aplicação React
        ├── pages/              # Componentes de página (CRUD e Relatórios)
        ├── services/           # Configuração do Axios (api.js)
        ├── App.jsx             # Componente principal e rotas
        └── main.jsx            # Ponto de entrada da aplicação
```

---

## Tecnologias Utilizadas

*   **Backend (Banco de Dados):**
    *   **Banco de Dados:** PostgreSQL
    *   **Linguagem de Scripting:** PL/pgSQL (Functions, Triggers, Procedures)
    *   **SQL:** DDL, DML, DQL

*   **Frontend:**
    *   **Biblioteca:** React
    *   **Build Tool:** Vite
    *   **Requisições HTTP:** Axios

*   **Geral:**
    *   **Controle de Versão:** Git & GitHub

---

## Como Executar a Aplicação Completa

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento localmente.

### Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão 18 ou superior)
*   [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
*   [PostgreSQL](https://www.postgresql.org/download/) instalado e rodando.

### 1. Backend - Configuração do Banco de Dados

Primeiro, vamos preparar o banco de dados.

1.  **Clone este repositório:**
    ```bash
    git clone https://github.com/brunotesckemartins/BD2.git
    cd BD2
    ```
2.  **Crie a base de dados no PostgreSQL.** Você pode usar um cliente como DBeaver, pgAdmin, ou o terminal `psql`:
    ```sql
    CREATE DATABASE bd2_projeto;
    ```
3.  **Execute os scripts SQL na ordem correta.** Conecte-se à base de dados `bd2_projeto` que você acabou de criar e execute os seguintes arquivos:
    *   `database/ddl/ddl.sql` (para criar as tabelas)
    *   `database/dml/dml.sql` (para popular com dados de exemplo)
    *   `database/procedures/procedures.sql` (para criar as views, funções, etc.)

### 2. Backend - Configuração da API

A aplicação React precisa de uma API para se comunicar com o banco de dados.

**Nota:** Estas instruções assumem que você possui um servidor de API (ex: Node.js/Express) em um diretório separado. Adapte os nomes e comandos conforme a sua estrutura.

1.  **Navegue até o diretório da sua API.**
2.  **Instale as dependências do backend:**
    ```bash
    npm install
    ```
3.  **Configure a conexão com o banco de dados.** Geralmente, isso é feito criando um arquivo `.env` na raiz do projeto da API com as suas credenciais:
    ```env
    DB_USER=seu_usuario_postgres
    DB_HOST=localhost
    DB_DATABASE=bd2_projeto
    DB_PASSWORD=sua_senha
    DB_PORT=5432
    ```
4.  **Inicie o servidor da API:**
    ```bash
    npm start
    ```
    O servidor da API deverá estar rodando (geralmente em `http://localhost:3000`).

### 3. Frontend - Configuração da Aplicação React

Com o banco de dados e a API rodando, vamos iniciar o frontend.

1.  **Abra um novo terminal** e navegue para a pasta `frontend`:
    ```bash
    cd frontend
    ```
2.  **Instale as dependências do frontend:**
    ```bash
    npm install
    ```
3.  **Inicie o servidor de desenvolvimento do React:**
    ```bash
    npm run dev
    ```
4.  **Abra seu navegador** e acesse a URL fornecida pelo Vite (geralmente `http://localhost:5173`).

Agora você deve ver a aplicação web funcionando e se comunicando com o seu banco de dados através da API.

---

## Comentários importantes nos commits

Durante o desenvolvimento, foram destacados nos commits pontos importantes para o entendimento do código, principalmente em:

*   **Triggers:** Automatizam verificações e atualizações no banco.
*   **Functions:** Funções SQL que encapsulam lógicas complexas para reuso.
*   **Índices e Índices compostos:** Essenciais para otimizar o desempenho nas consultas mais frequentes.

[Acesse esses comentários](https://github.com/brunotesckemartins/BD2/commit/26d9c0842325ad24d8ff00599b24c3ce1cd2f530)

---

## Repositório mantido por:

**Bruno Tescke Martins**
*   Email: brunotesckemartins@gmail.com
*   [Github](https://github.com/brunotesckemartins)

---

## Colaboradores:

*   **Gabriel Tomé** - [GitHub](https://github.com/GabrielTME)
*   **Tiago Fritzen Palácio** - [GitHub](https://github.com/TiagoPalacio)
