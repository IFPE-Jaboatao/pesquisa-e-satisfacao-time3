Roteiro de Testes e Validação de RotasSistema de Pesquisa e Avaliação Docente — IFPE  Este documento reúne o passo a passo técnico executado para validar o fluxo de autenticação, listagem de pesquisas e envio de respostas no sistema. Contém as URLs locais, payloads utilizados e as respostas tratadas pelo servidor NestJS, servindo como guia de suporte para a demonstração prática do projeto.  

1. Configuração de Segurança e Contexto TécnicoAmbiente Local: http://localhost:3000  Guard de Autenticação Global: JwtAuthGuard (responsável pela validação do token contido no cabeçalho HTTP de cada requisição).  Guard de Autorização por Perfil: RolesGuard atuando em conjunto com o decorator @Roles().  Validação de Enums: O Enum do sistema em src/users/user-role.enum.ts mapeia ALUNO = 'aluno' em letras minúsculas, garantindo a correspondência exata de dados no payload decodificado do JWT.  Ajuste Crítico no Swagger UI: Correção do decorator no Controller para @ApiBearerAuth('access-token'). Esta alteração alinhou a interface visual ao esquema de segurança definido na inicialização do sistema em main.ts, forçando o Swagger a injetar corretamente o cabeçalho de autorização nas chamadas executadas pela interface.  

2. Fluxo de Execução dos Testes (Passo a Passo)Passo 1: Autenticação e Geração de CredenciaisRequisição pública utilizada para simular o login de um usuário com o perfil de estudante e extrair o token necessário para acessar os endpoints bloqueados.  Método: POSTEndpoint: /auth/login  Corpo da Requisição (Payload JSON):JSON{
  "matricula": "2026123ALUNO",
  "password": "senha123"
}
```[cite: 1]

#### Resposta do Servidor (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4IiwibWF0cmljdWxhIjoiMjAyNjEyM0FMVU5PIiwicm9sZSI6ImFsdW5vIiwiY2FtcHVzIjoiSmFib2F0w6NvIn0..."
}
```[cite: 1]

> 💡 **Nota para a Apresentação:** O payload interno do JWT carrega a propriedade "role": "aluno"[cite: 1]. O RolesGuard intercepta essa propriedade para autorizar o acesso à rota de envio de formulários[cite: 1].

---

### Passo 2: Consulta de Pesquisas Publicadas
Endpoint protegido que retorna as avaliações registradas no banco de dados[cite: 1]. Utilizado para mapear quais pesquisas estão disponíveis e ativas para receber votos[cite: 1].

* **Método:** GET
* **Endpoint:** /surveys/pesquisas[cite: 1]
* **Cabeçalho HTTP Obrigatório:** Authorization: Bearer <TOKEN_GERADO_NO_PASSO_1>[cite: 1]

#### Resposta do Servidor (200 OK):
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
```[cite: 1]

> 🔍 **Análise de Validade:** O ID "6a0bd56edd4e33ace00a2432" possui o parâmetro "publicada": true e encontra-se dentro do prazo de vigência estabelecido pelas propriedades de data[cite: 1]. Ele deve ser obrigatoriamente utilizado no teste de envio para evitar erros de validação de negócio[cite: 1].

---

### Passo 3: Envio de Resposta da Avaliação
Rota protegida por restrição de perfil (@Roles(Role.ALUNO)) que realiza a inserção dos votos do aluno no banco de dados[cite: 1].

* **Método:** POST
* **Endpoint:** /surveys/respostas/enviar[cite: 1]
* **Cabeçalho HTTP Obrigatório:** Authorization: Bearer <TOKEN_GERADO_NO_PASSO_1>

#### Corpo da Requisição (Payload JSON):
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
```[cite: 1]

---

## 3. Respostas de Validação do Servidor (Matriz de Casos de Teste)

O comportamento do backend foi testado e homologado sob quatro cenários distintos de retorno HTTP, comprovando a integridade das regras de negócio do sistema:

| Código HTTP | Status do Cenário | Significado Prático / Comportamento do Sistema |
| :--- | :--- | :--- |
| **201 Created** | Sucesso na Inserção | O token foi validado pelo Guard, o perfil do usuário confere com o permitido e a resposta foi registrada com sucesso, criando o ID único no MongoDB[cite: 1]. |
| **401 Unauthorized** | Falha de Autenticação | O token JWT está ausente, expirado ou o formato enviado no cabeçalho HTTP está corrompido ou malformado[cite: 1]. |
| **403 Forbidden** | Bloqueio de Regra / Perfil | O usuário está devidamente autenticado, mas tentou responder a uma pesquisa marcada explicitamente com "publicada": false no banco de dados[cite: 1]. |
| **409 Conflict** | Validação de Duplicidade | O aluno já possui um registro de voto salvo para o ID daquela pesquisa específica[cite: 1]. O sistema bloqueia a segunda inserção para garantir a integridade dos dados[cite: 1]. |

---

## 4. Histórico de Versionamento e Sincronização (Git)

Comandos executados no terminal local para versionamento e salvamento definitivo do ajuste de documentação da rota no repositório compartilhado:

```bash
# 1. Adiciona a correção do controller à área de preparação (Stage)
git add src/surveys/respostas.controller.ts

# 2. Registra o bloco de alteração com mensagem padronizada no histórico
git commit -m "docs: vincula ApiBearerAuth ao access-token corrigindo envio no swagger"

# 3. Atualiza o servidor remoto na branch correspondente do projeto
git push origin swagger-lucas
```[cite: 1]