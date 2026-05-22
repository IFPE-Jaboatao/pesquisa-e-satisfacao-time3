# Endpoints da API

---

## Auth

### POST /auth/login

---

## Pesquisas

* POST /pesquisas
* GET /pesquisas
* GET /pesquisas/:id
* PATCH /pesquisas/:id
* PATCH /pesquisas/:id/publicar
* DELETE /pesquisas/:id

---

## Questões

* POST /questoes
* GET /questoes/:pesquisaId

## Respostas

---

* POST /respostas
* GET /respostas/relatorio/:pesquisaId

---

## Users (exclusivo para Admins)

* GET /users
* POST /users
* GET /users/:id
* PATCH /users/:id
* DELETE /users/:id

---

## Institutional

### Campus
* POST /campus
* GET /campus → listar campus
* GET /campus/:id → buscar um campus
* PATCH /campus/:id → atualizar campus
* DELETE /campus/:id → remover campus (checar cascade)
* GET /campus/:id/full → campus + setores + serviços (agregado)

---

### Setor
* POST /setor → criar setor (vinculado ao campus)
* GET /setor → listar setores
* GET /setor/:id → buscar setor
* PATCH /setor/:id → atualizar setor
* DELETE /setor/:id → remover setor
* GET /setor?campusId=X → listar por campus

---

### Serviço
* POST /servico → criar serviço (vinculado ao setor)
* GET /servico → listar serviços
* GET /servico/:id → buscar serviço
* PATCH /servico/:id → atualizar serviço
* DELETE /servico/:id → remover serviço
* GET /servico?setorId=X → listar por setor

---

## Academic

### Curso
* POST /curso → criar curso (vinculado ao campus)
* GET /curso → listar cursos
* GET /curso/:id → buscar curso
* PATCH /curso/:id → atualizar curso
* DELETE /curso/:id → remover curso
* GET /curso?campusId=X → listar cursos por campus

---

### Disciplina

#### GET

<details>

<summary>/academic/disciplinas</summary>

Lista todas as disciplinas.

</details>

<details>

<summary>/academic/disciplinas?cursoId=</summary>

Lista todas as disciplinas de um curso específico.

</details>

<details>

<summary>/academic/disciplinas/:id</summary>

Busca uma disciplina específica.

</details>

#### POST

<details>

<summary>/academic/disciplinas</summary>

Cria uma disciplina.

```json
JSON Content:
{
    "nome": string,
    "codigo": string,
    "cursoId": number,
}
```

</details>

#### PATCH

<details>

<summary>/academic/disciplinas/:id</summary>

Atualiza uma disciplina.

```json
JSON Content:
{
    "nome": string,
    "codigo": string,
    "cursoId": number,
}
```

</details>

#### DELETE

<details>

<summary>/academic/disciplinas/:id</summary>

Deleta uma disciplina.

***Causa deleção em cascada em***: turmas.

</details>

---

### Periodo

#### GET

<details>

<summary>/academic/periodos</summary>

Lista todos os períodos.

</details>

<details>

<summary>/academic/periodos/:id</summary>

Busca um período específico.

</details>

#### POST

<details>

<summary>/academic/periodos</summary>

Cria um período.

```json
JSON Content:
{
    "ano": number,
    "semestre": number,
    "startDate": datestring,
    "endDate": datestring
}
```

**Regras de Criação**
- **ano**: deve ser superior a 2010 e menor ou igual ao ano atual + 1.

> ***Exemplo:*** se estamos em 2026, o valor máximo permitido para ano é 2027, e o mínimo continua sendo 2010.

 - **semestre**: deve ser 1 ou 2.

- **startDate**: deve estar no formato ISO-STRING, ou seja, YYYY-MM-DD.

- **endDate**: deve estar no formato ISO-STRING, e deve ser maior do que `startDate`

- **Intervalo**: o intervalo de meses entre `startDate` e `endDate` não pode ser maior que do que 7, ou seja, períodos não podem durar mais do que 7 meses.

- **Ano e startDate**: a `startDate` de um período deve ser no ano do campo `ano` informado, `ano - 1` ou `ano + 1`. 

> ***Exemplo***: se ano = 2026, startDate deve ser 2026-MM-DD, 2027-MM-DD ou 2025-MM-DD.

- **Conflito de períodos**: um período não pode "entrar" no outro, ou seja, caso a `startDate` ou `endDate` do período a ser criado esteja dentro do intervalo `startDate-endDate` de outro período, a criação será impedida.

</details>

#### PATCH

<details>

<summary>/academic/periodos/:id</summary>

Atualiza um período.


```json
JSON Content:
{
    "ano": number,
    "semestre": number,
    "startDate": datestring,
    "endDate": datestring
}
```

**Obs.:** Extende todas as regras de criação de POST academic/periodos.

</details>

#### DELETE

<details>

<summary>/academic/periodos/:id</summary>

Deleta um período.

***Causa deleção em cascada em***: turmas.

</details>

---

### Turmas

#### GET

<details>

<summary>/academic/turmas</summary>

Lista todas as turmas.

</details>

<details>

<summary>/academic/turmas?disciplinaId=</summary>

Lista todas as turmas de uma disciplina específica.

</details>

<details>

<summary>/academic/turmas/docente/:id</summary>

Lista todas as turmas de um docente.

</details>

<details>

<summary>/academic/turmas/:id</summary>

Busca uma turma específica.

</details>

#### POST

<details>

<summary>/academic/turmas</summary>

Cria uma turma.

```json
JSON Content:
{
    "periodoId": number,
    "disciplinaId": number,
    "docenteId": number,
    "turno": string
}
```

**OBS:** Turno deve obrigatoriamente ser uma das opções abaixo:
    
    - Manhã
    - Tarde
    - Noite
    - Integral
    - EAD

</details>

<details>

<summary>/academic/turmas/avaliacoes-disponiveis</summary>

Retorna uma lista de avaliações docentes disponíveis para serem criadas a partir do período e curso especificados.

**Perfis autorizados**: Admin, Gestor

```json
JSON Content:
{
    "periodoId": number,
    "cursoId": number,
}
```

</details>

#### PATCH

<details>

<summary>/academic/turmas/:id</summary>

Atualiza uma turma, evitando duplicações de turma.

```json
JSON Content:
{
    "periodoId": number,
    "disciplinaId": number,
    "docenteId": number,
    "turno": string
}
```

**OBS:** Turno deve obrigatoriamente ser uma das opções abaixo:
    
    - Manhã
    - Tarde
    - Noite
    - Integral
    - EAD

</details>

#### DELETE

<details>

<summary>/academic/turmas/:id</summary>

Deleta uma turma.

</details>

---

### Matrículas

#### GET

<details>

<summary>/academic/matriculas</summary>

Lista todas as matrículas.

</details>

<details>

<summary>/academic/matriculas?turmaId=</summary>

Lista todas as matrículas de uma turma específica.

</details>

<details>

<summary>/academic/matriculas/:id</summary>

Busca uma matrícula específica.

</details>

<details>

<summary>/academic/matriculas/aluno/:id</summary>

Lista todas as matrículas de um aluno.

</details>

#### POST 
<details>

<summary>/academic/matriculas</summary>

Cria uma matrícula de um aluno em uma turma.

```json
JSON Content:
{
    "alunoId": number,
    "turmaId": number
}
```

</details>


#### PATCH

<details>

<summary>/academic/matriculas/:id</summary>
Atualiza uma matrícula, evitando duplicações de matrícula.

```json
JSON Content:
{
    "alunoId": number,
    "turmaId": number
}
```

</details>

#### DELETE

<details>

<summary>/academic/matriculas/:id</summary>
Deleta uma matrícula.

</details>

---
