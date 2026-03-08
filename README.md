# Netflix API

API REST de autenticação e usuários, construída com NestJS, Prisma e MySQL. Segue princípios de Clean Code e Clean Architecture.

## Stack

- **Runtime:** Node.js
- **Framework:** NestJS 11
- **Linguagem:** TypeScript
- **ORM:** Prisma 7 (client `prisma-client-js`; MySQL via adapter `@prisma/adapter-mariadb`)
- **Banco:** MySQL
- **Autenticação:** JWT (JSON Web Token)
- **Validação:** class-validator / class-transformer
- **Senha:** bcrypt

## Pré-requisitos

- Node.js 18+
- MySQL 8+
- npm ou yarn

## Configuração

1. Clone o repositório e instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` na raiz do projeto (ou ajuste o existente):

```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/NOME_DO_BANCO"
JWT_SECRET="sua-chave-secreta"
```

3. Crie o banco no MySQL (se ainda não existir):

```sql
CREATE DATABASE netflix_api;
```

4. Rode as migrações e gere o client do Prisma:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Executando

```bash
# desenvolvimento (watch)
npm run start:dev

# produção
npm run build
npm run start:prod
```

O script `start:prod` executa `node dist/src/main.js` (saída do build Nest).

A API sobe em `http://localhost:3000` (ou na porta definida em `PORT` no `.env`).

**Documentação Swagger:** [http://localhost:3000/api](http://localhost:3000/api) (disponível com a API rodando).

## API

### Autenticação

| Método | Rota           | Descrição                    |
|--------|----------------|-------------------------------|
| POST   | `/auth/register` | Cadastro de usuário          |
| POST   | `/auth/login`    | Login (retorna JWT e dados do usuário) |

### Registro — `POST /auth/register`

**Body (JSON):**

```json
{
  "name": "Nome Completo",
  "birth_date": "1990-01-15",
  "cpf": "12345678901",
  "phone": "11999999999",
  "email": "usuario@email.com",
  "password": "senha12345"
}
```

**Resposta:** objeto do usuário criado (sem o campo `password`).

### Login — `POST /auth/login`

**Body (JSON):**

```json
{
  "email": "usuario@email.com",
  "password": "senha12345"
}
```

**Resposta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "Nome",
    "email": "usuario@email.com",
    "birth_date": "1990-01-15T00:00:00.000Z",
    "phone": "11999999999",
    "cpf": "12345678901",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

Use o `access_token` no header `Authorization: Bearer <token>` em rotas protegidas (quando implementadas).

## Estrutura do projeto

```
src/
├── main.ts                 # Bootstrap da aplicação
├── app.module.ts           # Módulo raiz
├── prisma/                 # Módulo e serviço Prisma
├── modules/
│   ├── auth/               # Autenticação (register, login, JWT)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── dto/
│   └── users/              # Usuários (repositório, serviço, entidade)
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── entities/
│       ├── dto/
│       └── repositories/
│           ├── user.repository.ts      # Contrato (porta)
│           └── prisma/
│               └── prisma-user.repository.ts  # Implementação
prisma/
├── schema.prisma           # Modelos e datasource
└── migrations/
```

- **Controllers:** expõem as rotas HTTP.
- **Services:** regras de negócio e orquestração.
- **Repositories:** abstração de persistência (repositório abstrato + implementação Prisma).
- **DTOs:** validação e formato de entrada/saída.

## Scripts

| Comando           | Descrição              |
|-------------------|------------------------|
| `npm run start:dev` | Sobe em modo watch     |
| `npm run build`     | Compila para produção  |
| `npm run start:prod`| Roda o build            |
| `npm run lint`      | Executa o ESLint       |
| `npm run format`    | Formata com Prettier   |
| `npm run test`      | Testes unitários       |
| `npm run test:e2e`   | Testes e2e             |

## Licença

UNLICENSED (projeto privado).
