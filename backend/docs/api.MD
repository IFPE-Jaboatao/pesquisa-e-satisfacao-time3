# Endpoints da API

---

## Auth

O módulo **auth** serve para realizar a autenticação do usuário e possibilitar as autorizações dele no sistema.

#### POST

<details>

<summary>/auth/login</summary>

Realiza login do usuário retornando um token para acessar às demais rotas.

```json
JSON Content:
{
    "matricula": string,
    "password": string
}
```

</details>

---

## Surveys

***Surveys*** reúne os módulos das entidades: Pesquisa, Questão, Resposta e Relatório.


### Pesquisas

Todas as suas rotas são liberadas para o acesso de **Gestores**, sendo especificado na descrição da rota caso algum outro perfil também tenha acesso àquela rota específica.

#### GET

<details>

<summary>/surveys/pesquisas </summary>

Lista todas as pesquisas existentes no campus do gestor requerente.

</details>

<details>

<summary>/surveys/pesquisas/:id</summary>

Retorna uma pesquisa específica.

**Perfis autorizados**: Gestor e Aluno.

</details>

<details>

<summary>/surveys/pesquisas/:id/complete</summary>

Retorna uma pesquisa específica e as suas questões.

**Perfis autorizados**: Gestor e Aluno.

</details>

<details>

<summary>/surveys/pesquisas/avaliacao/criterios </summary>

Retorna um preview das questões definidas para avaliação dos docentes.

</details>

<details>

<summary>/surveys/pesquisas/:pesquisaId/relatorio </summary>

Retorna o relatório da pesquisa especificada.

</details>

#### POST

<details>

<summary>/surveys/pesquisas/satisfacao </summary>

Cria uma pesquisa de satisfação de um serviço.

```json
JSON Content:
{
    "titulo": string,
    "descricao": string,
    "servicoId": number,
    "dataInicio": datestring,
    "dataFinal": datestring

}
```

**Regras de Criação**

- **descricao**: deve ser maior do que 10 caracteres.

- **dataInicio**: deve ser igual ou maior do que hoje.

- **dataFinal**: deve ser maior do que `dataInicio`.

- **Conflitos de pesquisas**: uma pesquisa de satisfação de um serviço não pode existir mais de uma vez com as mesmas `dataInicio` e `dataFinal`.

**OBS.:** Todas as avaliações são criadas de forma padronizada, e turmas com avaliações já existentes não são criadas novamente.

</details>

<details>

<summary>/surveys/pesquisas/avaliacao/periodo </summary>

Cria todas as avaliações docentes para todas as turmas de um curso em tal período.

```json
JSON Content:
{
    "periodoId": number,
    "cursoId": number
}
```

**OBS.:** Todas as avaliações são criadas de forma padronizada, e turmas com avaliações já existentes não são criadas novamente.

</details>

#### PATCH

<details>

<summary>/surveys/pesquisas/:id </summary>

Atualiza uma pesquisa.

```json
JSON Content:
{  
    "titulo": string,
    "descricao": string,  
    "dataInicio": string,
    "dataFinal": string,
    "tipo": string, // avaliacao ou satisfacao
    "tipoId": number, // se tipo = avaliação, se refere a um turmaId, se tipo = satisfacao, se refere a um servicoId
    "publicada": boolean,
    "status": string, // ATIVA, INATIVA, FECHADA
    "finalizada": boolean
}
```

</details>

<details>

<summary>/surveys/pesquisas/:id/publicar </summary>

Publica uma pesquisa.

</details>

#### DELETE

<details>

<summary>/surveys/pesquisas/:id </summary>

Deleta uma pesquisa.

***Causa deleção em cascada em:*** questões e respostas.

</details>

---

### Questões

#### GET

<details>

<summary>/surveys/questoes/pesquisa/:pesquisaId </summary>

Retorna as questões da pesquisa especificada.

</details>

#### POST

<details>

<summary>/surveys/questoes </summary>

Cria uma questão.

```json
JSON Content:
{
    "pesquisaId": string,
    "pergunta": string,
    "tipo": string,
    "opcoes": string[], // obrigatório se "tipo" = "MULTIPLA"
    "escalaMax": number // obrigatório se "tipo" = "ESCALA"
}
```

<details>

<summary>Valores aceitos para <b>Tipo</b></summary>

    - ABERTA
    - ESCALA
    - MULTIPLA

**Obs.:**

</details>

</details>

---

### Respostas

#### GET

<details>

<summary>/surveys/respostas/relatorio/:pesquisaId </summary>

Retorna relatório de pesquisa com todas as respostas.

</details>

#### POST

<details>

<summary>/surveys/respostas/enviar </summary>

Envia resposta

**Perfis autorizados**: Aluno

```json
JSON Content:
{
    "pesquisaId": string,
    "respostas": [
        {
            "questaoId": string,
            "valor": string
        },
    ]
}
```

***OBS.:*** "valor" se refere à resposta do aluno àquela pergunta.

</details>

---

## Users

O módulo **Users** é usado para gestão das entidades: Users.

Informações sobre as especificações de perfis autorizados nas rotas estão na descrição de cada uma.

### Gestão de Usuários

**Perfil autorizado**: Admin

#### GET

<details>

<summary>/users</summary>

Lista todos os usuários.

</details>

<details>

<summary>/users/:id</summary>

Busca um usuário específico.

</details>

#### POST

<details>

<summary>/users</summary>

Cria um usuário.

```json
JSON Content:
{
    "matricula": string,
    "nome": string,
    "email": string,
    "role": string, // admin, gestor, docente ou aluno, sendo "aluno" o default
    "password": string,
    "campusId": string // opcional caso role = admin
}
```

</details>

#### PATCH

<details>

<summary>/users/:id</summary>

Atualiza um usuário

```json
JSON Content:
{
    "matricula": string,
    "nome": string,
    "email": string,
    "role": string, // admin, gestor, docente ou aluno, sendo "aluno" o default
    "password": string,
    "campusId": string // opcional caso role = admin
}
```

</details>

#### DELETE

<details>

<summary>/users/:id</summary>

Deleta um usuário.

***Causa deleção em cascada em:*** matrículas e repostas (caso user.role = aluno), turmas (caso user.role = docente)

</details>

### Acesso Comum

**Perfis autorizados:** todos

#### GET

<details>

<summary>/users/me</summary>

Retorna as informações do usuário requerente.

</details>

#### PATCH

<details>

<summary>/users/me/password</summary>

Altera a senha do usuário requerente.

```json
JSON Content:
{
    "passwordAtual": string, // a senha atual
    "password": string // a senha nova que o usuário quer ter
}
```

</details>

### Dashboards

<details>

<summary>/users/dashboard/admin</summary>

Retorna a quantidade e as informações dos usuários e das entidades dos módulos Institutional.

**Exemplo de resposta**
```json
{
    "resumo": {
        "users": { "total": 49, "admins": 3, "gestores": 3, ... },
        "institutional": { "campi": 4, "setores": 5, ... },
        "academic": { "cursos": 2, "disciplinas": 5, ... }
    },
    "institutional": { "campus": {...}, "setores": {...}, ...},
    "academic": { "cursos": {...}, "disciplinas": {...}, ...},
    "users": { { "id": 1, "matricula": "2787219", "nome": "Pessoa da Silva", ....}, ...}
}
```

</details>

<details>

<summary>/users/dashboard/gestor</summary>

Retorna a quantidade e as informações das pesquisas do campus do gestor requerente.

**Exemplo de resposta**
```json
{
    "resumo": {
        "avaliacoes": { "total": 42, "fechadas": 7, "ativas": 2, ...},
        "satisfacoes": { "total": 42, "fechadas": 7, "ativas": 2, ...},
    },
    "avaliacoes": {
        "ativas": [ { "id": "1bbca34e2412b3e", "titulo": "Pesquisa sobre tal", ...} ],
        "inativas": [ { "id": "35baa34dca2j32b", "titulo": "Pesquisa sobre tal 2", ...} ],
        ...
    },
    "satisfacoes": {
        "ativas": [ { "id": "1bbca3bda412b3aee", "titulo": "Pesquisa sobre tal 3", ...} ],
        "inativas": [ { "id": "35baa3aae5ca2j32cc", "titulo": "Pesquisa sobre tal 4", ...} ],
        ...
    }
}
```

</details>

<details>

<summary>/users/dashboard/docente</summary>

Retorna a quantidade e as informações das pesquisas do docente requerente junto com seu desempenho atual.

**Exemplo de resposta**
```json
{
    "docenteId": 1,
    "totalTurmasAvaliado": 6,
    "totalRespostasRecebidas": 18,
    "desempenhoGeral": { {"criterio": "Organização", "mediaValor": 45, "porcentagem": "45%", ... }},
    "mediaGeralHistorica": "45%",
    "pontosAtencao": { "razoavel": ["Organização"], "alto": ["Didática"], "critico": ["Pontualidade"]},
    "ultimosComentarios": ["Muito bom", "Não sei...", ...],
    "avaliacoes": {
        "total": 5,
        "ativas": [ { "id": "1bbca34e2412b3e", "titulo": "Pesquisa sobre tal", ...} ],
        "inativas": [ { "id": "35baa34dca2j32b", "titulo": "Pesquisa sobre tal 2", ...} ],
        ...
    }
}
```

</details>

<details>

<summary>/users/dashboard/aluno</summary>

Retorna as pesquisas disponíveis para o aluno responder.

**Exemplo de resposta**
```json
{
    "avaliacoesResponder": 4,
    "satisfacoesResponder": 5,
    "satisfacoes": [
        { "id": "1bbca34e2412b3e", "titulo": "Pesquisa sobre tal", ...},
        { "id": "35baa34dca2j32b", "titulo": "Pesquisa sobre tal 2", ...},
        ...
    ],
    "avaliacoes":[ 
        { "id": "1bbca34e2412b3e", "titulo": "Pesquisa sobre tal 3", ...},
        { "id": "35baa34dca2j32b", "titulo": "Pesquisa sobre tal 4", ...},
        ...
    ]
}
```

</details>

---

## Institutional

O módulo **institucional** é usado para gestão das entidades: Campus, Setor e Serviço.

Todas as suas rotas são liberadas apenas para o acesso de **Admins**.

### Campi

#### GET

<details>

<summary>/institutional/campi</summary>

Lista todos os campi.

</details>

<details>

<summary>/institutional/campi/:id</summary>

Busca um campus específico.

</details>

<details>

<summary>/institutional/campi/:id/full</summary>

Retorna o campus especificado junto com os seus setores, e os serviços daqueles setores.

**Exemplo de resposta**

```json
{
    "id": 1,
    "nome": "Jaboatao",
    "cidade": "Jaboatão dos Guararapes",
    "setores": [
        {
            "id": 1,
            "nome": "Infraestrutura",
            "servicos": [
                {
                    "id": 1,
                    "nome": "Áreas de Convivência"
                },
            ]
        },
    ]
} 
```

</details>

<details>

<summary>/institutional/campi/deleted</summary>

Lista todos os campi que foram deletados.

</details>

#### POST

<details>

<summary>/institutional/campi</summary>

Cria um campus.

```json
JSON Content:
{
    "nome": string,
    "cidade": string,
}
```

<details>

<summary>Valores aceitos para o campo <b>Cidade</b></summary> 

```JS
'Abreu e Lima',
'Afogados da Ingazeira',
'Barreiros',
'Belo Jardim',
'Cabo de Santo Agostinho',
'Caruaru',
'EAD',
'Garanhuns',
'Igarassu',
'Ipojuca',
'Jaboatão dos Guararapes',
'Olinda',
'Palmares',
'Paulista',
'Pesqueira',
'Recife',
'Vitória de Santo Antão'
```

</details>

</details>

#### PATCH

<details>

<summary>/institutional/campi/:id</summary>

Atualiza um campus.

```json
JSON Content:
{
    "nome": string,
    "cidade": string,
}
```

</details>

#### DELETE

<details>

<summary>/institutional/servicos</summary>

Cria um campus.

***Causa deleção em cascada em:*** setores, serviços e usuários.

</details>

---

### Setores

#### GET

<details>

<summary>/institutional/setores</summary>

Lista todos os setores.

</details>

<details>

<summary>/institutional/setores?campusId=</summary>

Lista todos os setores de um campus específico.

</details>

<details>

<summary>/institutional/setores/:id</summary>

Busca um setor específico.

</details>

#### POST

<details>

<summary>/institutional/setores</summary>

Cria um setor.

```json
JSON Content:
{
    "nome": string,
    "campusId": number,
}
```

</details>

#### PATCH

<details>

<summary>/institutional/setores/:id</summary>

Atualiza um setor.

```json
JSON Content:
{
    "nome": string,
    "campusId": number,
}
```

</details>

#### DELETE

<details>

<summary>/institutional/setores/:id</summary>

Deleta um setor.

***Causa deleção em cascada em:*** dsdsad

</details>

---

### Serviços

#### GET

<details>

<summary>/institutional/servicos</summary>

Lista todos os serviços.

</details>

<details>

<summary>/institutional/servicos?setorId=</summary>

Lista todos os serviços de um setor específico.

</details>

<details>

<summary>/institutional/servicos/:id</summary>

Busca um serviço específico.

</details>

#### POST

<details>

<summary>/institutional/servicos</summary>

Cria um serviço.

```json
JSON Content:
{
    "nome": string,
    "setorId": number,
}
```

</details>

#### PATCH

<details>

<summary>/institutional/servicos/:id</summary>

Atualiza um serviço.

```json
JSON Content:
{
    "nome": string,
    "setorId": number,
}
```

</details>

#### DELETE

<details>

<summary>/institutional/servicos/:id</summary>

Deleta um serviço.

***Causa deleção em cascada em:*** pesquisas.

</details>

---

## Academic

O módulo **acadêmico** é usado para gestão das entidades: Curso, Disciplina, Turma, Período e Matrícula.

Todas as suas rotas são liberadas para o acesso de **Admins**, sendo especificado na descrição da rota caso algum outro perfil também tenha acesso àquela rota específica.

### Cursos

#### GET

<details>

<summary>/academic/cursos</summary>

Lista todos os cursos.

</details>

<details>

<summary>/academic/cursos?campusId=</summary>

Lista todos os cursos de um campus específico.

</details>

<details>

<summary>/academic/cursos/:id</summary>

Busca um curso específico.

</details>

#### POST

<details>

<summary>/academic/cursos</summary>

Cria um curso.

```json
JSON Content:
{
    "nome": string,
    "campusId": number,
}
```

</details>

#### PATCH

<details>

<summary>/academic/cursos/:id</summary>

Atualiza um curso.

```json
JSON Content:
{
    "nome": string,
    "campusId": number,
}
```

</details>

#### DELETE

<details>

<summary>/academic/cursos</summary>

Deleta um curso.

***Causa deleção em cascada em:*** disciplinas.

</details>

---

### Disciplinas

#### GET

<details>

<summary>/academic/disciplinas</summary>

Lista todas as disciplinas.

**Perfis autorizados**: Admin, Gestor

</details>

<details>

<summary>/academic/disciplinas?cursoId=</summary>

Lista todas as disciplinas de um curso específico.

**Perfis autorizados**: Admin, Gestor

</details>

<details>

<summary>/academic/disciplinas/:id</summary>

Busca uma disciplina específica.

**Perfis autorizados**: Admin, Gestor

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

### Períodos

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

**Perfis autorizados**: Admin, Docente

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

***Causa deleção em cascada em:*** pesquisas e matrículas.

</details>

---

### Matrículas

#### GET

<details>

<summary>/academic/matriculas</summary>

Lista todas as matrículas.

**Perfis autorizados**: Admin, Gestor

</details>

<details>

<summary>/academic/matriculas?turmaId=</summary>

Lista todas as matrículas de uma turma específica.

**Perfis autorizados**: Admin, Gestor

</details>

<details>

<summary>/academic/matriculas/:id</summary>

Busca uma matrícula específica.

</details>

<details>

<summary>/academic/matriculas/aluno/:id</summary>

Lista todas as matrículas de um aluno.

**Perfis autorizados**: Admin, Aluno

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

***Causa deleção em cascada em:*** respostas.

</details>

---
