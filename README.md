# Pesquisa - Backend (NestJS)

## Visão Geral

API desenvolvida com NestJS para criação e gerenciamento de pesquisas. Administradores criam e publicam pesquisas, usuários respondem de forma anônima. O sistema aplica regras para evitar respostas duplicadas e manter a integridade dos dados.

---

## Arquitetura

```
ADMIN (JWT)
   ↓
PESQUISAS (CRUD + PUBLICAÇÃO)
   ↓
QUESTÕES
   ↓
LINK PÚBLICO
   ↓
USUÁRIO ANÔNIMO
   ↓
COOKIE (anonId)
   ↓
FINGERPRINT (IP + USER-AGENT)
   ↓
RATE LIMIT
   ↓
RESPOSTAS
   ↓
RELATÓRIOS
```

---

## Estrutura de Pastas

```
src/
├── app.module.ts
├── main.ts
├── config/
├── common/
├── auth/
├── anonymous/
├── pesquisas/
├── questoes/
├── respostas/
└── relatorios/
```

---

## Autenticação (Admin)

* JWT com `passport-jwt`
* Header:

```
Authorization: Bearer TOKEN
```

---

## Acesso Anônimo

* Geração automática de `anonId` (cookie)
* Fingerprint com IP + user-agent
* Usado para impedir respostas duplicadas

---

## Segurança Implementada

* Autenticação com JWT
* Acesso anônimo controlado
* Rate limit por endpoint
* Validação de período da pesquisa
* Validação de ObjectId

### Regras de Negócio

* **Bloqueio de edição**: não permite `PATCH` em pesquisa já publicada
* **Exclusão em cascata**: remover pesquisa apaga questões e respostas vinculadas
* **Controle de duplicidade**: cruza `anonId` + `fingerprint`

---

## Banco de Dados

### MongoDB

* Pesquisas
* Questões
* Respostas

### MySQL

* Usuários
* Autenticação

---

## Configurações Globais

### main.ts

* cookie-parser
* ValidationPipe
* CORS

### app.module.ts

* ConfigModule global
* TypeORM (Mongo + MySQL)
* ThrottlerModule

### Configurações adicionais

* Multi conexão (mongo + mysql)
* Uso de `@InjectRepository(Entity, 'mongo')`
* Ordenação por registros mais recentes nas listagens administrativas

---

## Endpoints

### Auth

* POST /auth/login

### Pesquisas

* POST /pesquisas
* GET /pesquisas
* GET /pesquisas/:id
* PATCH /pesquisas/:id
* PATCH /pesquisas/:id/publicar
* DELETE /pesquisas/:id

### Questões

* POST /questoes
* GET /questoes/:pesquisaId

### Respostas

* POST /respostas
* GET /respostas/relatorio/:pesquisaId

---

## Fluxo de Uso

### Admin

1. Login
2. Cria pesquisa
3. Adiciona questões
4. Publica

### Usuário

1. Acessa o link
2. Responde
3. Envia

---

## Instalação

### Criar projeto

```
npm i -g @nestjs/cli
nest new projeto
cd projeto
```

---

### Instalar dependências (todas utilizadas no projeto)

```
npm install \
@nestjs/common \
@nestjs/config \
@nestjs/core \
@nestjs/jwt \
@nestjs/passport \
@nestjs/platform-express \
@nestjs/throttler \
@nestjs/typeorm \
class-transformer \
class-validator \
cookie-parser \
dotenv \
mongodb \
mysql2 \
passport \
passport-anonymous \
passport-custom \
passport-jwt \
reflect-metadata \
rxjs \
typeorm
```

---

## Execução

```
npm run start:dev
```

---



## Autor

Projeto acadêmico.

Matheus Pereira, Maria Adila e Lucas Souza.

# pesquisa-e-satisfacao-time3

## 📋 Gerenciamento de Tarefas

O gerenciamento das tarefas do projeto está sendo feito através do Trello. Abaixo estão as principais listas que usamos para organizar o progresso:

- **Protótipo Figma** – Tarefas relacionadas à criação do protótipo;
- **Backend Typescript** – Tarefas relacionadas ao desenvolvimento do backend;
- **Documentação Backend** – Tarefas para a documentação do backend;
- **To Do** – Tarefas gerais e novas a serem adicionadas;
- **Doing** – Tarefas em andamento;
- **Done** – Tarefas concluídas.

Você pode acompanhar o andamento do projeto no Trello através do link:
[Pesquisa e Satisfação - Trello](https://trello.com/invite/b/68338502fb3b40d7ad7494c0/ATTI5d771c19374b44a2fdc46b847485d7f96B155811/pesquisa-e-satisfacao)
