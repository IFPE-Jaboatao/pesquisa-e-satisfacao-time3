# Sistema de Pesquisa de Satisfação e Avaliação Docente - Regras de Negócios

## 1. Visão Geral

Este documento descreve as regras de negócio do sistema de pesquisa de satisfação institucional e avaliação docente.
O sistema permite a criação, resposta e análise de pesquisas aplicadas a contextos acadêmicos e institucionais.

## 2. Autenticação e Autorização

O acesso ao sistema é realizado via autenticação **JWT (Bearer Token)**.

O token contém:

- userId;
- role;
- matricula;
- campusId.

Perfis de usuário
  - ADMIN;
  - GESTOR;
  - DOCENTE;
  - ALUNO.

Cada perfil possui permissões específicas no sistema.

## 3. Regras de Usuário (ADMIN)

Apenas ADMIN pode:

- criar usuários;
- editar usuários;
- excluir usuários.

### Restrições:

Um ADMIN não pode:

- remover o própria role de admin;
- deletar a si próprio.

O sistema deve sempre manter pelo menos **1 ADMIN ativo**.

## 4. Gestão Institucional e Acadêmica

Apenas ADMIN pode gerenciar:

- Institucional
  - Campus
  - Setor
  - Serviço
- Acadêmico
  - Curso
  - Disciplina
  - Turma
  - Período
  - Matrícula

## 5. Regras de Unicidade

As seguintes entidades não podem possuir duplicidade:

- Período → `ano + semestre`
- Disciplina → `nome + cursoId`
- Curso → `nome + campusId`
- Setor → `nome + campusId`
- Serviço → `nome + setorId`
- Campus → `cidade` 
- Turma → `disciplinaId + periodoId + docenteId + nome + turno`
- Matrícula → `turmaId + alunoId`

## 6. Regras de Período

- Ano deve ser entre 2010 e (ano atual + 1);
- Semestre deve ser 1 ou 2;
- EndDate deve ser maior do que startDate;
- O ano de startDate só pode ser `ano - 1, ano, ou ano + 1`. Exemplo: se `ano = 2026`, startDate deve ser no ano 2025, 2026 ou 2027;
- O intervalo startDate - endDate de um período não pode estar dentro do intervalo de outro período. Exemplo: se o período 2026.1 termina em `2026-06-30`, um período 2027.1 não pode ter startDate `2026-06-29` (anterior a endDate de 2026.1).

Não pode haver duplicação de ano + semestre.

## 7. Pesquisas (MongoDB)

As pesquisas são armazenadas no MongoDB e podem ser:

- SATISFACAO (vinculada a um Serviço)
- AVALIACAO (vinculada a uma Turma)

Estrutura base:
```json
"tipo": Tipo,
"tipoId": number,
"titulo": string,
"descricao": string,
"startDate": datestring,
"endDate": datestring,
"status": Status,
"publicada": boolean
```

Regra de unicidade:
```titulo + tipo + tipoId + startDate + endDate```

## 8. Ciclo de Vida da Pesquisa

Status possíveis:
- INATIVA
- PUBLICADA
- FECHADA

### Regras
Ao criar:

- status = INATIVA

PUBLICADA:
- startDate <= hoje <= endDate

FECHADA:

- hoje > endDate

Restrições:

- startDate não pode ser no passado
- endDate é inclusivo
- após FECHADA, não aceita respostas

## 9. Criação de Pesquisas

### 9.1 Pesquisa de Satisfação

- Criada por GESTOR;
- Vinculada a um Serviço;
- Contém questões definidas manualmente;
- Disponível para todos os alunos.

### 9.2 Avaliação Docente

- Criada por GESTOR
- Vinculada a uma Turma

### Padronização de Avaliações

- título e descrição são gerados automaticamente;
- questões baseada em critérios definidos (ENUM);
- Cada critério gera:
  - uma questão do tipo ESCALA;
  - escala de 1 a 6, onde 1 é o nível mais baixo e 6 é o mais alto.

- Inclui obrigatoriamente uma questão final opcional do tipo ABERTA.

## 10. Respostas (MongoDB)

- Apenas ALUNO pode responder
- Cada aluno responde apenas uma vez por pesquisa
- Respostas são associadas a alunoHash
- Pesquisas fechadas não podem ser respondidas

### Regras de Acesso

- Avaliação docente: aluno deve estar matriculado na turma
- Pesquisa de satisfação: disponível para todos os alunos

- Restrição: aluno não pode visualizar suas respostas após envio

## 11. Matrícula e Acesso

O aluno só pode responder avaliações de turmas nas quais está matriculado

## 12. Relatórios

- Gestor: acesso a relatórios agregados parciais e finalizados de todas as pesquisas
- Docente: acesso apenas aos relatórios parciais e finalizados de pesquisas onde foi o docente avaliado

## 13. Logs e Auditoria

O sistema registra logs de ações realizadas por usuários. Todas as entidades possuem:

- createdAt
- updatedAt

## 14. Notificações

As notificações devem chegar por email. Os casos de notificação são:
### ALUNO
  - nova pesquisa disponível;
  - lembrete 1 semana antes do fim da pesquisa (se ainda não respondeu).

### DOCENTE
- resultado de avaliação disponível(quando a avaliação estiver finalizada).

### GESTOR
- resultado de pesquisa disponível(quando a pesquisa estiver finalizada).

> **Obs.:** Docentes e gestores podem visualizar os resultados parciais a qualquer momento, porém não haverá notificações sobre esses resultados parciais (ex.: nova resposta na pesquisa).

## 15. Exclusão de Pesquisas

- Pesquisas podem ser deletadas apenas se ainda não foi iniciada.
- Tentativas de DELETE são bloqueadas pelo sistema caso a pesquisa tenha sido iniciada.
- Respostas e questões não possuem soft delete.

## 16. Integridade Histórica das Pesquisas

As pesquisas possuem caráter histórico e não podem ser invalidadas por alterações ou remoções de suas entidades de origem.

### 16.1 Regra de integridade

Uma pesquisa, após sua criação, deve manter consistência histórica independentemente de alterações nas entidades relacionadas no sistema relacional (MySQL), como:
- Campus
- Curso
- Disciplina
- Turma
- Serviço
- Setor
- Período

### 16.2 Problema de dependência

Como as pesquisas são armazenadas no MongoDB e referenciam entidades do MySQL, existe risco de quebra de referência caso essas entidades sejam alteradas ou removidas.

### 16.3 Estratégia adotada

Para garantir consistência histórica, o sistema adota uma combinação de:

  a) Não exclusão lógica de entidades críticas
Entidades acadêmicas e institucionais não devem ser removidas fisicamente caso estejam associadas a pesquisas existentes.
Quando necessário, deve ser utilizada a estratégia de desativação, que é a deletedAt.

  b) Snapshot de dados na criação da pesquisa
No momento da criação de uma pesquisa, o sistema parmazena uma cópia mínima dos dados relevantes da entidade relacionada no MongoDB.

Exemplo:
- nome da turma
- disciplina associada
- docente responsável
- curso associado
- campus vinculado

Esse snapshot garante que os relatórios permaneçam consistentes mesmo após alterações futuras no sistema relacional.

### 16.4 Regra de ouro

Pesquisas são consideradas registros históricos imutáveis.

Alterações em entidades base do sistema não devem impactar o conteúdo já respondido ou consolidado de uma pesquisa.
