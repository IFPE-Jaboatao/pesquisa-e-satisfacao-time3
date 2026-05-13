# Documentação Técnica



## Arquitetura

```
ADMIN (JWT)
   ↓
PESQUISAS (CRUD + PUBLICAÇÃO)
   ↓
QUESTÕES
   ↓
LINK PÚBLICO
   ↓
USUÁRIO ANÔNIMO
   ↓
COOKIE (anonId)
   ↓
FINGERPRINT (IP + USER-AGENT)
   ↓
RATE LIMIT
   ↓
RESPOSTAS
   ↓
RELATÓRIOS
```

---

## Estrutura de Pastas

```
src/
├── app.module.ts
├── main.ts
├── config/
├── common/
├── auth/
├── anonymous/
├── pesquisas/
├── questoes/
├── respostas/
└── relatorios/
```

---

## Autenticação (Admin)

* JWT com `passport-jwt`
* Header:

```
Authorization: Bearer TOKEN
```

---

## Acesso Anônimo

* Geração automática de `anonId` (cookie)
* Fingerprint com IP + user-agent
* Usado para impedir respostas duplicadas

---

## Segurança Implementada

* Autenticação com JWT
* Acesso anônimo controlado
* Rate limit por endpoint
* Validação de período da pesquisa
* Validação de ObjectId


## Banco de Dados

### MongoDB

* Pesquisas
* Questões
* Respostas

### MySQL

* Usuários
* Autenticação

---

## Configurações Globais

### main.ts

* cookie-parser
* ValidationPipe
* CORS

### app.module.ts

* ConfigModule global
* TypeORM (Mongo + MySQL)
* ThrottlerModule

### Configurações adicionais

* Multi conexão (mongo + mysql)
* Uso de `@InjectRepository(Entity, 'mongo')`
* Ordenação por registros mais recentes nas listagens administrativas

---
