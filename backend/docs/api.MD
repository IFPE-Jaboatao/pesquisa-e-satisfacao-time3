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
* POST /disciplina → criar disciplina (vinculado ao curso)
* GET /disciplina → listar disciplinas
* GET /disciplina/:id → buscar disciplina
* PATCH /disciplina/:id → atualizar disciplina
* DELETE /disciplina/:id → remover disciplina
* GET /disciplina?cursoId=X → listar disciplinas por curso

---

### Periodo
* POST /periodo → criar periodo
* GET /periodo → listar periodos
* GET /periodo/:id → buscar periodo
* PATCH /periodo/:id → atualizar periodo
* DELETE /periodo/:id → remover periodo

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
