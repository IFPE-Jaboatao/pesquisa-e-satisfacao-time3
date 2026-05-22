# Documentação Técnica

Este documento descreve a arquitetura, a estrutura de módulos e as regras de negócio críticas do sistema. Ele serve como guia oficial para compreender o fluxo de dados, o modelo de banco de dados híbrido e as travas de segurança e isolamento por campus implementadas no ecossistema.

## Arquitetura

O sistema é construído sobre uma arquitetura de microsserviços monolíticos baseada em módulos lógicos bem definidos, utilizando o ecossistema NestJS. O fluxo de dados e controle de acesso segue a hierarquia abaixo:

```
[Autenticação JWT (Matrícula + Senha)]
                  ↓
       [Controle de Acesso (RBAC)]
  (Admin | Gestor | Docente | Aluno)
                  ↓
         [Módulos de Negócio]
 ┌────────────────┬────────────────┐
 │  INSTITUTIONAL │    ACADEMIC    │
 └────────────────┼────────────────┘
                  │
                  ▼
              [SURVEYS]
      (Pesquisas/Questões/Respostas)
                  ↓
   [Anonimização Seguro via HMAC]
                  ↓
      [Persistência de Dados]
```

---

## Estrutura de Pastas

A estrutura do diretório src/ reflete a organização dos domínios:

```
src/
├── app.module.ts
├── app.service.ts
├── app.controller.ts
├── main.ts
├── config/
├── mail/                 # Envio automatizado de emails de notificações
├── notificacoes/
├── auditoria/
├── seed/                 # Setup de modo seed
├── shared/               # Eventos gerais
├── common/
│   ├── decorators/
│   ├── guards/
│   └── utils/
├── auth/                 # Autenticação e Login Geral
├── users/                # Gestão de Usuários e Dashboards por Perfil
├── institutional/        # Gestão de Campi, Setores e Serviços
├── academic/             # Cursos, Disciplinas, Períodos, Turmas e Matrículas
├── pesquisas/
├── questoes/
└── respostas/
```

---

## Autenticação e Perfis (RBAC)

O sistema utiliza autenticação baseada em JWT (JSON Web Token) através da estratégia passport-jwt. O identificador principal do usuário é a sua matrícula.

* Header:

```HTTP
Authorization: Bearer <TOKEN_JWT>
```

---

### Perfis de Acesso (Roles)
*   **Admin:** Acesso irrestrito ao sistema, responsável pelo módulo Institutional e controle global de Users e Academic.
*   **Gestor:** Focado na administração das pesquisas (Surveys) dentro do seu campus de atuação.
*   **Docente:** Acesso a relatórios de desempenho e listagem de suas respectivas turmas.
*   **Aluno:** Perfil padrão. Autorizado a responder pesquisas de satisfação e avaliações institucionais.

---

## Segurança e Anonimização
### Estratégia de Anonimato: HMAC

Para garantir que um **Aluno** não responda à mesma pesquisa mais de uma vez (mantendo a integridade do processo) sem violar o seu anonimato, o sistema gera um identificador único irreversível no momento do envio da resposta:

*   O identificador anônimo é gerado através de um **Hash HMAC** utilizando dados únicos do aluno combinado a uma chave secreta do servidor.
*   Esse método assegura que o voto seja computado de forma única, mas impede que administradores ou gestores consigam fazer a engenharia reversa para descobrir qual aluno gerou aquela resposta.

---

## Banco de Dados e Persistência

O sistema opera de forma híbrida utilizando o **TypeORM** com suporte a conexões simultâneas para otimizar os diferentes modelos de dados.

### MongoDB (@InjectRepository(Entity, 'mongo'))

Utilizado para o módulo de **Surveys** (Pesquisas, Questões e Respostas). A flexibilidade do formato de documentos se adequa à variação dos tipos de questões e respostas:

*   **Tipos de Questões Suportados:** ABERTA, ESCALA (numérica) e MULTIPLA (baseada em array de opções).

### MySQL (@InjectRepository(Entity, 'default'))

Utilizado para os dados relacionais e transacionais do sistema, garantindo integridade referencial estrita (Foreign Keys e deleções em cascata):

*   **Users:** Dados cadastrais, senhas e perfis.
*   **Institutional:** Relacionamento estrito de Campi ➔ Setores ➔ Serviços.
*   **Academic:** Fluxo acadêmico de Cursos ➔ Disciplinas ➔ Períodos ➔ Turmas ➔ Matrículas.

---

## Regras de Negócio e Validações Críticas

 1. Isolamento por Campus (Multi-Tenancy por Escopo)
O sistema implementa uma trava estrita de escopo baseada no vínculo institucional do usuário. Usuários não-admins possuem acesso estritamente restrito ao seu próprio campusId.

- Gestores: Só conseguem listar, criar ou gerenciar pesquisas (sejam de satisfação de serviços ou avaliações de turmas) que pertençam ao seu campus.

- Docentes: Só podem ser vinculados a turmas que pertençam ao mesmo campus do seu cadastro.

- Alunos:

   - Apenas podem ser matriculados em turmas pertencentes ao seu próprio campus.

   - Restrição de Respostas: Um aluno só está autorizado a responder avaliações docentes de turmas nas quais ele possua uma matrícula ativa, e pesquisas de satisfação de serviços que façam parte do seu campus.

2. Ciclo de Vida e Unicidade de Pesquisas (Surveys)
- Avaliações Docentes: São vinculadas obrigatoriamente a uma Turma. Existe uma restrição estrita de unicidade: só pode haver uma única avaliação docente por turma. O sistema impede qualquer tentativa de duplicação.

- Pesquisas de Satisfação: Vinculadas a um servicoId. A descrição deve ter obrigatoriamente mais de 10 caracteres. A data de início não pode ser retroativa e a data final deve ser maior que a inicial. Não são permitidas pesquisas duplicadas para o mesmo serviço no mesmo intervalo de tempo.

- Garantia de Voto Único: O sistema valida o hash HMAC do aluno antes de persistir a resposta. Um aluno nunca pode responder a mesma pesquisa mais de uma vez.

3. Integridade Referencial via Soft Delete em Cascata (Event-Driven)

Para evitar registros órfãos nos bancos de dados (MySQL e MongoDB), o sistema implementa Soft Delete em Cascata gerenciado por Eventos Internos. Quando uma entidade pai é removida logicamente, ela emite um evento que engatilha a exclusão sequencial de seus dependentes:

**Fluxo Institucional:**
```
[Campus Excluído] 
       ↓ (Trigger Event)
[Setores do Campus Excluídos] 
       ↓ (Trigger Event)
[Serviços dos Setores Excluídos] 
       ↓ (Trigger Event)
[Pesquisas de Satisfação Excluídas] 
       ↓ (Trigger Event)
[Questões e Respostas Excluídas (MongoDB)]
```

**Fluxo Acadêmico (Docente):**
```
[Docente Excluído] 
       ↓ (Trigger Event)
[Turmas do Docente Excluídas] 
       ↓ (Trigger Event)
[Avaliações Docentes Excluídas] 
       ↓ (Trigger Event)
[Questões e Respostas Excluídas (MongoDB)]
```

**Fluxo Acadêmico (Aluno / Matrícula):**

- A exclusão de uma Matrícula remove em cascata apenas as respostas daquele aluno especificamente associadas àquela turma.
- A exclusão de um Usuário Aluno dispara a remoção de todas as suas matrículas e limpa seu histórico de respostas de forma segura (removendo os registros correspondentes ao hash do aluno).

---

## Configurações Globais do NestJS

### main.ts
*   **ValidationPipe:** Configurado globalmente com as flags whitelist: true e transform: true para assegurar que os payloads recebidos coincidam exatamente com os DTOs especificados, tipando os IDs dinâmicos de rota de string para number automaticamente quando necessário.
*   **CORS:** Habilitado para permitir a comunicação dos dashboards dos diferentes perfis (Admin, Gestor, Docente, Aluno).

### app.module.ts
*   **ConfigModule:** Carregamento global de variáveis de ambiente (.env) para gerenciamento das chaves de criptografia do JWT, chaves de hash do HMAC e credenciais dos bancos de dados.
*   **ThrottlerModule:** Rate limit implementado globalmente para proteção contra ataques de força bruta nas rotas de autenticação (/auth/login) e envio massivo de payloads no endpoint de respostas.
