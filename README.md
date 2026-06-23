# pesquisa-e-satisfacao

[![Frontend Build](https://github.com/IFPE-Jaboatao/pesquisa-e-satisfacao-time3/actions/workflows/frontend-build.yml/badge.svg)](https://github.com/IFPE-Jaboatao/pesquisa-e-satisfacao-time3/actions/workflows/frontend-build.yml)

[![CI Backend](https://github.com/IFPE-Jaboatao/pesquisa-e-satisfacao-time3/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/IFPE-Jaboatao/pesquisa-e-satisfacao-time3/actions/workflows/backend-ci.yml)

[![CI Frontend](https://github.com/IFPE-Jaboatao/pesquisa-e-satisfacao-time3/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/IFPE-Jaboatao/pesquisa-e-satisfacao-time3/actions/workflows/frontend-ci.yml)

Projeto full-stack com backend em Nest.js e frontend em Flowbite React Next.js (em desenvolvimento).

## Como rodar o projeto localmente

> Requisitos:
>   - Conexão MySQL
>   - Conexão MongoDB
>   - Node.js

Com o repositório baixado/clonado localmente, execute os seguintes passos:

### 1. Iniciando o backend

#### 1.1 Abra um novo terminal e rode os comandos:

```bash
cd backend

cp .env.example .env
```

#### 1.2 Preencha as variáveis no `.env` corretamente.

#### 1.3 Rode os comandos:

```bash
npm install

npm run start:dev
```

O backend estará rodando em `http://localhost:3000`.

### 2. Iniciando o frontend

#### 2.1 Abra um novo terminal e rode os comandos:

```bash
cd frontend

cp .env.example .env
```

#### 2.2 Preencha as variáveis no `.env` corretamente.

#### 2.3 Rode os comandos:

```bash
npm install

npm run dev
```

O link em que o frontend está rodando aparecerá no terminal. Clique para visualizar o projeto funcionando localmente.
