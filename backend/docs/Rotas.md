# Roteiro de Testes e Validação de Rotas - Sistema de Pesquisa e Avaliação Docente — IFPE

Este documento reúne o passo a passo técnico executado para validar o fluxo de autenticação, listagem de pesquisas e envio de respostas no sistema. Contém as URLs locais, payloads utilizados e as respostas tratadas pelo servidor NestJS, servindo como guia de suporte para a demonstração prática do projeto.

## 1. Configuração de Segurança e Contexto Técnico

- Ambiente Local: `http://localhost:3000`

- Guard de Autenticação Global: JwtAuthGuard (valida o token no cabeçalho HTTP de cada requisição).

- Guard de Autorização por Perfil: RolesGuard junto com o decorator `@Roles()`.

- Validação de Enums: O Enum em `src/users/user-role.enum.ts` mapeia `ALUNO = 'aluno'` em letras minúsculas para bater com o payload do JWT.

- Ajuste Crítico no Swagger UI: Mudança do decorator para `@ApiBearerAuth('access-token')` para alinhar a interface ao esquema definido no `main.ts`, injetando o cabeçalho de autorização corretamente.

## 2. Fluxo de Execução dos Testes (Passo a Passo)

### Passo 1: Autenticação e Geração de Credenciais

Simulação de login para extrair o token necessário para acessar os endpoints bloqueados.

- Método: `POST`
- Endpoint: `/auth/login`

- Corpo da Requisição (Payload JSON):
```json
{
  "matricula": "2026123ALUNO",
  "password": "senha123"
}

Resposta do Servidor (200 OK):
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4IiwibWF0cmljdWxhIjoiMjAyNjEyM0FMVU5PIiwicm9sZSI6ImFsdW5vIiwiY2FtcHVzIjoiSmFib2F0w6NvIn0..."
}
```


> Nota: O payload interno do JWT carrega a propriedade `"role": "aluno"`. O RolesGuard lê essa propriedade para liberar o acesso.

### Passo 2: Consulta de Pesquisas Publicadas

Retorna as avaliações ativas no banco de dados para checar quais estão disponíveis para voto.

- Método: `GET`
- Endpoint: `/surveys/pesquisas`
- Cabeçalho: `Authorization: Bearer <TOKEN_GERADO_NO_PASSO_1>`
- Resposta do Servidor (200 OK):

```json
[
  {
    "id": "6a0bd56edd4e33ace00a2432",
    "titulo": "Pesquisa de Satisfação Atendimento",
    "dataInicio": "2026-05-18T23:59:59.000Z",
    "dataFinal": "2026-06-18T23:59:59.000Z",
    "tipo": "satisfacao",
    "publicada": true,
    "finalizada": false,
    "encerrada": false
  }
]
```

> Análise de Validade: O ID "6a0bd56edd4e33ace00a2432" está com `"publicada": true` e dentro do prazo de vigência. 

- Este ID será usado no teste de envio.

### Passo 3: Envio de Resposta da Avaliação

- Rota restrita ao perfil de aluno `(@Roles(Role.ALUNO))` para salvar os votos no banco.

- Método: `POST`

- Endpoint: `/surveys/respostas/enviar`

- Cabeçalho: `Authorization: Bearer <TOKEN_GERADO_NO_PASSO_1>`

- Corpo da Requisição (Payload JSON):

```json
{
  "pesquisaId": "6a0bd56edd4e33ace00a2432",
  "matricula": "2026123ALUNO",
  "turma": "ADS-4N",
  "periodo": "2026.1",
  "respostas": [
    {
      "questaoId": "6a0e9738195df57a12212855",
      "enunciado": "Como você avalia a infraestrutura e as aulas?",
      "tipo": "escala",
      "valor": "5"
    }
  ]
}
```

### 3. Respostas de Validação do Servidor (Matriz de Casos de Teste)

O backend trata quatro cenários principais de retorno HTTP:

| Código HTTP | Status do Cenário | Comportamento do Sistema |
| ------------- | ------------- | ------------- |
| 201 Created | Sucesso na Inserção | Token válido, perfil correto e resposta registrada no banco |
| 401 Unauthorized | Falha de Autenticação | Token JWT ausente, expirado ou malformado |
| 403 Forbidden | Bloqueio de Regra / Perfil | Usuário autenticado, mas tentou responder pesquisa não publicada (`"publicada": false`) |
| 409 Conflict | Validação de Duplicidade | O aluno já votou nessa pesquisa. O sistema bloqueia o segundo voto para evitar duplicidade |
