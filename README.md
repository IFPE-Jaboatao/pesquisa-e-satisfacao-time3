# Pesquisas de Satisfação e Avaliação Docente - Time 3

## Visão Geral

API desenvolvida com NestJS para criação e gerenciamento de pesquisas. Gestores criam e publicam pesquisas, alunos respondem de forma anônima. O sistema aplica regras para evitar respostas duplicadas e manter a integridade dos dados.

---

## Como rodar o projeto

1. Clone este repositorio

```bash
git clone https://github.com/IFPE-Jaboatao/pesquisa-e-satisfacao-time3
cd pesquisa-e-satisfacao-time3
```

2. Instale as dependências

```bash
npm install
```

3. Copie o arquivo .env.example e preencha as variáveis no arquivo .env.

```bash
cp .env.example .env
```

4. Rode o projeto com

```bash
npm run start:dev
```

5. Confira [Endpoints da API](docs/api.MD) para explorar as rotas disponíveis

## Regras de Negócio

Atualmente as regras implementadas são:

- **Bloqueio de edição**: não permite `PATCH` em pesquisa já publicada
- **Exclusão em cascata**: remover pesquisa apaga questões e respostas vinculadas
- **Controle de duplicidade**: cruza `anonId` + `fingerprint`

## Fluxo de Uso por Usuário

### Admin

1. Login
2. Gerencia os usuários
3. Gerencia informações de campus, serviços, cursos, disciplinas e etc
4. Visualiza relatórios

### Gestor
1. Login
2. Cria pesquisa
3. Adiciona questões
4. Publica
5. Visualiza relatórios

### Docente

1. Login
2. Visualiza seu próprio relatório

### Aluno

1. Login
2. Acessa pesquisa
3. Responde
4. Envia
5. Visualiza sua própria resposta

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
.