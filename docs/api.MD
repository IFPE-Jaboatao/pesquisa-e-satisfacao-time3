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

---
