#Sistema financeiro - Banco de Dados PostgreSQL

Este repositório contém a implementação completa de um sistema financeiro básico utilizando PostgreSQL, desenvolvido como parte de estudos/prática em banco de dados. Inclui:

    Modelagem de dados para controle financeiro pessoal

    Mecanismos de automação via triggers

    Funções para cálculos financeiros

    Otimizações de performance com índices

Objetivo Principal: Demonstrar a aplicação de conceitos avançados de PostgreSQL como triggers, functions e índices em um contexto real de gestão financeira.

#Como Executar (via SSH)

git clone git@github.com:brunotesckemartins/BD2.git
cd BD2
psql -U seu_usuario -d nome_banco -f database/script.sql

#Diagrama 
(https://github.com/brunotesckemartins/BD2/blob/main/postgres%20-%20financeiro.png)

#Como contribuir 

# 1. Faça um fork via SSH
git clone git@github.com:seu_usuario/BD2.git

# 2. Crie uma branch
git checkout -b minha-melhoria

# 3. Commit suas alterações
git commit -am "Descrição precisa das mudanças"

# 4. Push
git push origin minha-melhoria
