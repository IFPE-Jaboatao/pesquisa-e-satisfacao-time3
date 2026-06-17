# Pesquisas de Satisfação e Avaliação Docente - Time 3

## Visão Geral - Back-End

API desenvolvida com NestJS para criação e gerenciamento de pesquisas. Gestores criam e publicam pesquisas, alunos respondem de forma anônima. O sistema aplica regras para evitar respostas duplicadas e manter a integridade dos dados.


---

## Arquitetura e Módulos do Sistema

O projeto é dividido em domínios lógicos bem definidos:

- `Auth & Users`: Autenticação por matrícula e dashboards customizados por perfil (**Admin, Gestor, Docente e Aluno**).

- `Institutional`: Gerenciamento de Campi, Setores e Serviços.

- `Academic`: Controle de Cursos, Disciplinas, Períodos Acadêmicos, Turmas e Matrículas.

- `Surveys`: Engine de criação de pesquisas, banco de questões (`ABERTA, ESCALA, MULTIPLA`) e computação de respostas.

##  Funcionalidades Chave

- **Isolamento Multi-Campus**: Usuários comuns e gestores possuem a visão e ação limitadas estritamente ao seu campusId.

- **Soft Delete Orientado a Eventos**: Exclusões em cascata seguras utilizando eventos internos para evitar registros órfãos entre os bancos MySQL e MongoDB.

- **Garantia de Voto Único Anônimo**: O aluno é validado para não responder duas vezes a mesma pesquisa através de um hash único gerado por HMAC, mantendo sua identidade 100% anônima.

## Como rodar o projeto localmente

### Pré-requisitos
- Node.js (versão 18 ou superior)

- Instâncias ativas do MySQL e MongoDB

### Passos

1. Clone este repositorio

```bash
git clone https://github.com/IFPE-Jaboatao/pesquisa-e-satisfacao-time3
cd pesquisa-e-satisfacao-time3
cd backend
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
