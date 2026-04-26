# Endpoints da API

## Auth
POST /auth/login - Autenticação de usuários administrativos

## Pesquisas
POST /pesquisas - Criar nova pesquisa
GET /pesquisas - Listar todas as pesquisas
GET /pesquisas/:id - Detalhes de uma pesquisa
PATCH /pesquisas/:id - Editar dados da pesquisa
PATCH /pesquisas/:id/publicar - Publicar pesquisa (status ativo)
DELETE /pesquisas/:id - Remover pesquisa

## Questoes
POST /questoes - Adicionar questões a uma pesquisa
GET /questoes/:pesquisaId - Listar questões de uma pesquisa específica

## Respostas
POST /respostas - Salvar resposta (anonimo ou identificado)
GET /respostas/relatorio/:pesquisaId - Gerar dados e estatísticas da pesquisa

## Users (Admins)
GET /users - Listar admins
POST /users - Cadastrar novo admin
GET /users/:id - Ver perfil de admin
PATCH /users/:id - Editar dados de admin
DELETE /users/:id - Remover acesso de admin