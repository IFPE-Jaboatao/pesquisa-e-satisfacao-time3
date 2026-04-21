# Endpoints da API



## Auth

* POST /auth/login


## Pesquisas

* POST /pesquisas
* GET /pesquisas
* GET /pesquisas/:id
* PATCH /pesquisas/:id
* PATCH /pesquisas/:id/publicar
* DELETE /pesquisas/:id

## Questões

* POST /questoes
* GET /questoes/:pesquisaId

## Respostas

* POST /respostas
* GET /respostas/relatorio/:pesquisaId

## Users (exclusivo para Admins)

* GET /users
* POST /users
* GET /users/:id
* PATCH /users/:id
* DELETE /users/:id

## Institutional

### Campus
* POST /campus
* GET /campus → listar campus
* GET /campus/:id → buscar um campus
* PATCH /campus/:id → atualizar campus
* DELETE /campus/:id → remover campus (checar cascade)
* GET /campus/:id/full → campus + setores + serviços (agregado)

### Setor
* POST /setor → criar setor (vinculado ao campus)
* GET /setor → listar setores
* GET /setor/:id → buscar setor
* PATCH /setor/:id → atualizar setor
* DELETE /setor/:id → remover setor
* GET /setor?campusId=X → listar por campus


### Serviço
* POST /servico → criar serviço (vinculado ao setor)
* GET /servico → listar serviços
* GET /servico/:id → buscar serviço
* PATCH /servico/:id → atualizar serviço
* DELETE /servico/:id → remover serviço
* GET /servico?setorId=X → listar por setor

## Academic

### Curso
* POST /curso → criar curso (vinculado ao campus)
* GET /curso → listar cursos
* GET /curso/:id → buscar curso
* PATCH /curso/:id → atualizar curso
* DELETE /curso/:id → remover curso
* GET /curso?campusId=X → listar cursos por campus

### Disciplina
* POST /disciplina → criar disciplina (vinculado ao curso)
* GET /disciplina → listar disciplinas
* GET /disciplina/:id → buscar disciplina
* PATCH /disciplina/:id → atualizar disciplina
* DELETE /disciplina/:id → remover disciplina
* GET /disciplina?cursoId=X → listar disciplinas por curso

### Periodo
* POST /periodo → criar periodo
* GET /periodo → listar periodos
* GET /periodo/:id → buscar periodo
* PATCH /periodo/:id → atualizar periodo
* DELETE /periodo/:id → remover periodo

### Turma
* POST /turma → criar turma (vinculado à disciplina, período e docente)
* GET /turma → listar turmas
* GET /turma/:id → buscar turma
* PATCH /turma/:id → atualizar turma
* DELETE /turma/:id → remover disciplina
* GET /turma?disciplinaId=X → listar turmas por disciplinas
* GET /turma/docente/:id → listar turmas de um docente

### Matrícula
* POST /matricula → criar matricula (vinculada ao aluno e à turma)
* GET /matricula → listar matriculas
* GET /matricula/:id → buscar matricula
* PATCH /matricula/:id → atualizar matricula
* DELETE /matricula/:id → remover matricula
* GET /matricula?turmaId=X → listar matriculas por turma
* GET /matricula/aluno/:id → listar matrículas de um aluno

---
