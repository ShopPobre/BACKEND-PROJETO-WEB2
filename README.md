# BACKEND-PROJETO-WEB2

## 0. Guia rapido de execucao

### 0.1 O que sobe com Docker Compose

Modo oficial de execucao (unico): `workspace/docker-compose.yml`

- `database` (MySQL 8)
- `minio` (armazenamento de arquivos)
- `backend` (API Node.js/TypeScript)
- `seed` (setup automatico de MinIO + categorias/produtos/imagens)
- `frontend` (Angular) em `http://localhost:4200`

### 0.1.1 Repositorios separados (frontend e backend)

Os projetos estao em repositorios diferentes, clone os dois lado a lado em uma mesma pasta pai:

```bash
workspace/
├── BACKEND-PROJETO-WEB2/
└── FRONTEND-PROJETO-WEB2/
```

### 0.1.2 Variaveis de ambiente (.env) antes do compose

Antes de executar o `docker compose`, configure o `.env` do backend:

```bash
test -f BACKEND-PROJETO-WEB2/.env || cp BACKEND-PROJETO-WEB2/.env.example BACKEND-PROJETO-WEB2/.env
```

Para o ambiente subir (API + banco + seed), o minimo recomendado no `.env` e:

```env
DB_USER=shopobre
DB_PASS=root123
DB_NAME=shopobre
JWT_SECRET=troque_esta_chave_em_producao
JWT_TOKEN_AUDIENCE=shopobre
JWT_TOKEN_ISSUER=shopobre
JWT_TTL=3600
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=admin123
```

### 0.1.3 Stripe (antes de testar pagamentos)

As chaves Stripe **nao sao necessarias para subir a stack**, mas sao obrigatorias para testar checkout/pagamento:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Depois de configurar o `.env`, crie o arquivo `docker-compose.yml` **na pasta pai** (`workspace/`) com o conteudo abaixo:

```yaml
services:
  database:
    image: mysql:8
    container_name: shopobre-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASS:-root123}
      MYSQL_DATABASE: ${DB_NAME:-shopobre}
      MYSQL_USER: ${DB_USER:-shopobre}
      MYSQL_PASSWORD: ${DB_PASS:-root123}
    ports:
      - "${DB_PORT:-3306}:3306"
    volumes:
      - mysqldata:/var/lib/mysql
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -u$${MYSQL_USER} -p$${MYSQL_PASSWORD} --silent"]
      interval: 10s
      timeout: 5s
      retries: 15
      start_period: 30s
    networks:
      - shopobre-net

  minio:
    image: minio/minio:latest
    container_name: shopobre-minio
    restart: always
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-minioadmin}
    ports:
      - "${MINIO_PORT:-9000}:9000"
      - "${MINIO_CONSOLE_PORT:-9001}:9001"
    volumes:
      - miniodata:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 10s
      timeout: 5s
      retries: 15
      start_period: 10s
    networks:
      - shopobre-net

  backend:
    build:
      context: ./BACKEND-PROJETO-WEB2
      dockerfile: Dockerfile
    container_name: shopobre-backend
    restart: always
    env_file:
      - ./BACKEND-PROJETO-WEB2/.env
    environment:
      DB_DIALECT: mysql
      DB_HOST: database
      DB_PORT: "3306"
      DB_USER: ${DB_USER:-shopobre}
      DB_PASS: ${DB_PASS:-root123}
      DB_NAME: ${DB_NAME:-shopobre}
      JWT_SECRET: ${JWT_SECRET:-shopobre_dev_jwt_secret_change_me}
      JWT_TOKEN_AUDIENCE: ${JWT_TOKEN_AUDIENCE:-shopobre}
      JWT_TOKEN_ISSUER: ${JWT_TOKEN_ISSUER:-shopobre}
      JWT_TTL: ${JWT_TTL:-3600}
      MINIO_ENDPOINT: minio
      MINIO_PORT: "9000"
      MINIO_ACCESS_KEY: ${MINIO_ROOT_USER:-minioadmin}
      MINIO_SECRET_KEY: ${MINIO_ROOT_PASSWORD:-minioadmin}
      MINIO_BUCKET: ${MINIO_BUCKET:-shopobre}
      MINIO_USE_SSL: "false"
      PORT: "3000"
    depends_on:
      database:
        condition: service_healthy
      minio:
        condition: service_healthy
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/health"]
      interval: 15s
      timeout: 5s
      retries: 15
      start_period: 40s
    networks:
      - shopobre-net

  seed:
    build:
      context: ./BACKEND-PROJETO-WEB2
      dockerfile: Dockerfile
    container_name: shopobre-seed
    env_file:
      - ./BACKEND-PROJETO-WEB2/.env
    environment:
      DB_DIALECT: mysql
      DB_HOST: database
      DB_PORT: "3306"
      DB_USER: ${DB_USER:-shopobre}
      DB_PASS: ${DB_PASS:-root123}
      DB_NAME: ${DB_NAME:-shopobre}
      JWT_SECRET: ${JWT_SECRET:-shopobre_dev_jwt_secret_change_me}
      JWT_TOKEN_AUDIENCE: ${JWT_TOKEN_AUDIENCE:-shopobre}
      JWT_TOKEN_ISSUER: ${JWT_TOKEN_ISSUER:-shopobre}
      JWT_TTL: ${JWT_TTL:-3600}
      MINIO_ENDPOINT: minio
      MINIO_PORT: "9000"
      MINIO_ACCESS_KEY: ${MINIO_ROOT_USER:-minioadmin}
      MINIO_SECRET_KEY: ${MINIO_ROOT_PASSWORD:-minioadmin}
      MINIO_BUCKET: ${MINIO_BUCKET:-shopobre}
      MINIO_USE_SSL: "false"
    command:
      - sh
      - -c
      - |
        for i in 1 2 3 4 5 6; do
          npm run setup && exit 0
          echo "Aguardando DB/MinIO para seed... tentativa $$i/6"
          sleep 5
        done
        exit 1
    depends_on:
      database:
        condition: service_healthy
      minio:
        condition: service_healthy
    restart: on-failure:5
    networks:
      - shopobre-net

  frontend:
    build:
      context: ./FRONTEND-PROJETO-WEB2/shopobre-ui
      dockerfile: Dockerfile
    container_name: shopobre-frontend
    restart: always
    depends_on:
      backend:
        condition: service_healthy
      seed:
        condition: service_completed_successfully
    ports:
      - "4200:4200"
    networks:
      - shopobre-net

networks:
  shopobre-net:

volumes:
  mysqldata:
  miniodata:
```

### 0.2 Passo a passo completo (modo unico)

1. Na pasta pai `workspace/` (onde esta o `docker-compose.yml`), garanta o `.env` do backend:

```bash
test -f BACKEND-PROJETO-WEB2/.env || cp BACKEND-PROJETO-WEB2/.env.example BACKEND-PROJETO-WEB2/.env
```

2. Ainda em `workspace/`, suba tudo:

```bash
docker compose up -d --build
```

3. Validacoes:

```bash
curl http://localhost:3000/health
```

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`
- MinIO Console: `http://localhost:9001`
- Config Stripe (chave publica): `http://localhost:3000/api/config`

### 0.3 Stripe local (instalar, webhook e teste)

1. Confirme que `STRIPE_SECRET_KEY` e `STRIPE_PUBLISHABLE_KEY` estao preenchidas no `BACKEND-PROJETO-WEB2/.env`.
2. Instale a Stripe CLI: [https://docs.stripe.com/stripe-cli](https://docs.stripe.com/stripe-cli)
3. Autentique:

```bash
stripe login
```

4. Com backend ativo, encaminhe os eventos para o webhook local:

```bash
stripe listen --forward-to localhost:3000/webhook/stripe
```

> Importante: o `whsec_...` so aparece quando voce executa o `stripe listen`.
> Por isso, na primeira subida da stack, o webhook de confirmacao **nao funciona** ate voce copiar o `whsec_...` para o `.env` e reiniciar o backend.

5. Copie o segredo `whsec_...` exibido no terminal e atualize `STRIPE_WEBHOOK_SECRET` no `.env`.
6. Reinicie apenas o backend para aplicar:

```bash
docker compose restart backend
```

#### Alternativa (modo dev no VSCode)

Se preferir rodar o backend em modo desenvolvimento (hot-reload) fora do container:

1. Pare o container do backend (libera a porta 3000):

```bash
docker compose stop backend
```

2. Rode o backend localmente:

```bash
cd BACKEND-PROJETO-WEB2
npm install
npm run dev
```

3. Com o backend local rodando em `http://localhost:3000`, execute o Stripe CLI normalmente:

```bash
stripe listen --forward-to localhost:3000/webhook/stripe
```

7. Fluxo esperado:
   - API cria PaymentIntent em `/api/payments`
   - Frontend confirma o pagamento com `clientSecret`
   - Stripe envia `payment_intent.succeeded` para `/webhook/stripe`
   - Backend confirma o pagamento e atualiza o pedido

8. Ao tentar executar o projeto é esperado esse resultado:
```> backend-projeto-web2@1.0.0 dev
> ts-node-dev --respawn --transpile-only src/index.ts

[INFO] 08:43:48 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.2, typescript ver. 5.9.3)
[dotenv@17.2.3] injecting env (0) from .env -- tip: 📡 add observability to secrets: https://dotenvx.com/ops
[dotenv@17.2.3] injecting env (0) from .env -- tip: 🗂️ backup and recover secrets: https://dotenvx.com/ops
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  enable debug logging with { debug: true }
[dotenv@17.2.3] injecting env (0) from .env -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
✅ Conexão com banco de dados estabelecida com sucesso.
✅ Modelos sincronizados com o banco de dados (sem ALTER).
✅ Admin já existe.
🚀 Servidor rodando na porta 3000
✅ GET /api/config ativo (chave Stripe)
📍 Health check: http://localhost:3000/health
📍 AUTH API: http://localhost:3000/api/login
📍 Users API: http://localhost:3000/api/users
📍 Addresses API: http://localhost:3000/api/users/:userId/addresses
📍 Categories API: http://localhost:3000/api/categories
📍 Products API: http://localhost:3000/api/products
📍 Orders API: http://localhost:3000/api/orders
📍 Payments API: http://localhost:3000/api/payments
📍 Config (Stripe): http://localhost:3000/api/config
📍 Stripe Webhook: http://localhost:3000/webhook/stripe
📚 Swagger Docs: http://localhost:3000/api-docs
`` 

### 0.4 Comandos uteis

```bash
# subir ambiente completo (na pasta workspace/)
docker compose up -d --build

# acompanhar logs da API
docker compose logs -f backend

# parar ambiente
docker compose down
```

---

## 1. 🛒 **ShopPobre** - Sistema de E-commerce 🛒


### 1.1 Descrição Geral

O **ShopPobre** é um sistema web de e-commerce desenvolvido com foco no backend. O sistema oferece autenticação segura com papéis distintos (Administrador e Cliente), gerenciamento de produtos, categorias, pedidos e pagamentos.

O objetivo é construir uma aplicação **completa, modular e segura**, abrangendo desde o levantamento de requisitos até a implementação, testes e documentação.

---

### 1.2 Entidades Principais

Estas entidades são **essenciais para o funcionamento** do sistema e compõem o núcleo do e-commerce.

| Entidade      | Descrição                                              | Relacionamentos                                           |
| ------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| **User**      | Representa os usuários do sistema (Admin e Cliente).   | 1:N com `Order`, 1:N com `Address`                        |
| **Role**      | Define os papéis de usuário (`ADMIN`, `CUSTOMER`).     | 1:N com `User`                                            |
| **Category**  | Classifica produtos (Ex: Eletrônicos, Roupas).         | 1:N com `Product`                                         |
| **Product**   | Produto à venda, com nome, preço, descrição e estoque. | N:1 com `Category`, 1:N com `OrderItem`                   |
| **Inventory** | Controla o estoque de cada produto.                    | 1:1 com `Product`                                         |
| **Order**     | Pedido realizado por um cliente.                       | N:1 com `User`, 1:N com `OrderItem`, 1:1 com `Payment`    |
| **OrderItem** | Item dentro de um pedido.                              | N:1 com `Order`, N:1 com `Product`                        |
| **Payment**   | Pagamento vinculado a um pedido.                       | 1:1 com `Order`                                           |
| **Address**   | Endereço de entrega e cobrança.                        | N:1 com `User`                                            |

---

### 1.3 Entidades Desejáveis (Expansões Futuras)

Essas entidades não são essenciais, mas agregam valor e tornam o sistema mais realista. 

| Entidade         | Descrição                                             | Relacionamentos                    |
| ---------------- | ----------------------------------------------------- | ---------------------------------- |
| **Cart**         | Carrinho de compras persistente por usuário.          | 1:1 com `User`, 1:N com `CartItem` |
| **CartItem**     | Item dentro do carrinho.                              | N:1 com `Cart`, N:1 com `Product`  |
| **Wishlist**     | Lista de desejos do cliente.                          | N:1 com `User`, N:M com `Product`  |
| **Notification** | Notificações automáticas (pedido enviado, pago, etc). | N:1 com `User`                     |
| **AuditLog**     | Registros de alterações administrativas.              | N:1 com `User`                     |

**OBS: TANTO OS PONTOS 1.2 E 1.3 ESTÃO SUJEITOS A CORTES, APÓS A ANALISE DO PROFESSOR. ENTÃO PROFESSOR, PRETENDO CONVERSAR COM O SENHOR A RESPEITO, SERÁ QUE DA PRA CONSTRUIR TUDO ISSO NESSA DISCIPLINA? QUAIS ENTIDADES EU POSSO CORTAR, QUAL SERIA UM ESCOPO COMPLETINHO DE ENTIDADES PARA SUPORTAR NA DISCIPLINA?**

---

---

### 1.4 Requisitos Funcionais

| ID   | Requisito                    | Descrição                                                                        |
| ---- | ---------------------------- | -------------------------------------------------------------------------------- |
| RF01 | Cadastro e login de usuários | O sistema deve permitir que usuários se registrem e façam login.                 |
| RF02 | Autenticação JWT             | O sistema deve gerar tokens JWT para autenticação.                               |
| RF03 | Gestão de papéis             | O sistema deve permitir papéis `ADMIN` e `CUSTOMER` com permissões distintas.    |
| RF04 | CRUD de produtos             | O admin pode criar, editar, listar e remover produtos.                           |
| RF05 | CRUD de categorias           | O admin pode gerenciar categorias.                                               |
| RF06 | Controle de estoque          | O sistema deve atualizar automaticamente o estoque após cada compra.             |
| RF07 | Carrinho de compras          | O cliente pode adicionar, remover e alterar quantidades de produtos no carrinho. |
| RF08 | Criação de pedidos           | O cliente pode confirmar o carrinho e gerar um pedido.                           |
| RF09 | Pagamento de pedidos         | O cliente pode efetuar pagamento (simulado).                                     |
| RF10 | Histórico de pedidos         | O cliente pode visualizar seus pedidos anteriores.                               |
| RF11 | Avaliações de produtos       | O cliente pode avaliar produtos adquiridos.                                      |
| RF12 | Painel administrativo        | O admin pode visualizar estatísticas e gerenciar todo o sistema.                 |

---

### 1.5 Requisitos Não Funcionais

| Categoria            | Descrição                                               |
| -------------------- | ------------------------------------------------------- |
| **Desempenho**       | As respostas da API devem ocorrer em menos de 500ms.    |
| **Segurança**        | Criptografia de senhas com bcrypt e autenticação JWT.   |
| **Usabilidade**      | Endpoints RESTful bem documentados via Swagger.         |
| **Escalabilidade**   | Separação de camadas (Controller, Service, Repository). |
| **Confiabilidade**   | Transações atômicas no banco para operações críticas.   |
| **Testabilidade**    | Testes unitários e de integração com Jest/Mocha e Chai. |
| **Portabilidade**    | Deploy em plataformas como Render, Railway ou AWS.      |
| **Manutenibilidade** | Código modular, tipado e versionado em GitHub.          |

---

## 2. 📋 **Funcionalidades Implementadas**

O projeto atual implementa um backend RESTful completo com as seguintes funcionalidades:

- ✅ **CRUD completo de Usuários** - Cadastro, listagem, busca, atualização e exclusão
- ✅ **CRUD completo de Categorias** - Gerenciamento de categorias de produtos
- ✅ **CRUD completo de Produtos** - Gerenciamento de produtos com vinculação a categorias
- ✅ **Controle de Estoque** - Consulta, aumento e diminuição de estoque por produto
- ✅ **CRUD completo de Pedidos** - Criação, listagem, busca, atualização e exclusão de pedidos
- ✅ **CRUD completo de Endereços** - Gerenciamento de endereços por usuário
- ✅ **Documentação Swagger** - API totalmente documentada e testável
- ✅ **Validação de Dados** - Validação robusta usando Zod
- ✅ **Tratamento de Erros** - Middleware centralizado para tratamento de erros
- ✅ **Arquitetura em Camadas** - Separação clara entre Controller, Service e Repository

---

## 3. **Rotas da API**

### 3.1 Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/health` | Verifica se o servidor está funcionando |

### 3.2 Usuários (`/api/users`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/users` | Criar um novo usuário |
| `GET` | `/api/users` | Listar todos os usuários |
| `GET` | `/api/users/:id` | Buscar usuário por ID (UUID) |
| `PUT` | `/api/users/:id` | Atualizar usuário |
| `DELETE` | `/api/users/:id` | Deletar usuário |

**Exemplo de criação de usuário:**
```json
{
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "password": "senha123",
  "cpf": "12345678901",
  "telefone": "(11) 98765-4321"
}
```

### 3.3 Endereços (`/api/users/:userId/addresses`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/users/:userId/addresses` | Criar um novo endereço para um usuário |
| `GET` | `/api/users/:userId/addresses` | Listar todos os endereços de um usuário |
| `PUT` | `/api/users/:userId/addresses/:addressId` | Atualizar endereço |
| `DELETE` | `/api/users/:userId/addresses/:addressId` | Deletar endereço |

**Exemplo de criação de endereço:**
```json
{
  "rua": "Rua das Flores",
  "numero": 123,
  "cep": "12345-678",
  "cidade": "São Paulo",
  "estado": "SP",
  "tipo": "CASA"
}
```

### 3.4 Categorias (`/api/categories`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/categories` | Criar uma nova categoria (requer autenticação admin) |
| `GET` | `/api/categories` | Listar todas as categorias |
| `GET` | `/api/categories/:id` | Buscar categoria por ID |
| `PUT` | `/api/categories/:id` | Atualizar categoria (requer autenticação admin) |
| `DELETE` | `/api/categories/:id` | Deletar categoria (requer autenticação admin) |

**Exemplo de criação de categoria:**
```json
{
  "name": "Eletrônicos",
  "description": "Produtos eletrônicos em geral"
}
```

### 3.5 Produtos (`/api/products`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/products` | Criar um novo produto (requer autenticação admin) |
| `GET` | `/api/products` | Listar todos os produtos |
| `GET` | `/api/products/:id` | Buscar produto por ID |
| `GET` | `/api/products/category/:categoryId` | Listar produtos por categoria |
| `PUT` | `/api/products/:id` | Atualizar produto (requer autenticação admin) |
| `DELETE` | `/api/products/:id` | Deletar produto (requer autenticação admin) |

**Exemplo de criação de produto:**
```json
{
  "name": "Notebook Dell",
  "description": "Notebook com 8GB RAM e SSD 256GB",
  "price": 2999.99,
  "categoryId": 1
}
```

### 3.6 Estoque (`/api/inventory/:productId`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/inventory/:productId` | Buscar estoque de um produto |
| `PATCH` | `/api/inventory/:productId/increase` | Aumentar estoque de um produto |
| `PATCH` | `/api/inventory/:productId/decrease` | Diminuir estoque de um produto |

**Exemplo de aumento de estoque:**
```json
{
  "quantity": 10
}
```

### 3.7 Pedidos (`/api/orders`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/orders` | Criar um novo pedido (requer autenticação) |
| `GET` | `/api/orders/:id` | Buscar pedido por ID |
| `GET` | `/api/orders/user/:userId` | Listar pedidos de um usuário |
| `PUT` | `/api/orders/:id` | Atualizar pedido (status ou endereço) |
| `DELETE` | `/api/orders/:id` | Deletar pedido (devolve estoque automaticamente) |

**Exemplo de criação de pedido:**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "addressId": "123e4567-e89b-12d3-a456-426614174001",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ]
}
```

### 3.8 Documentação Swagger

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api-docs` | Acessar documentação interativa da API |

---

## 4. **Como Iniciar o Projeto**

### 4.1 Pré-requisitos

- **Docker** e **Docker Compose**
- **Stripe CLI** (para confirmar pagamentos localmente por webhook)
- Pasta pai `workspace/` contendo os dois repositorios:
  - `BACKEND-PROJETO-WEB2`
  - `FRONTEND-PROJETO-WEB2`

### 4.2 Instalação e Configuração (modo oficial)

1. **Na pasta `workspace/`, garanta o `.env` do backend:**
   ```bash
   test -f BACKEND-PROJETO-WEB2/.env || cp BACKEND-PROJETO-WEB2/.env.example BACKEND-PROJETO-WEB2/.env
   ```

2. **Suba a stack completa:**
   ```bash
   docker compose up -d --build
   ```

3. **Verifique os logs (se necessário):**
   ```bash
   docker compose logs -f backend
   ```

4. **Acesse a aplicação:**
   - API: `http://localhost:3000`
   - Health Check: `http://localhost:3000/health`
   - Swagger Docs: `http://localhost:3000/api-docs`
   - Frontend: `http://localhost:4200`

### 4.3 Acessando a Documentação

Após iniciar o servidor, acesse a documentação Swagger interativa:

```
http://localhost:3000/api-docs
```

Na documentação Swagger você pode:
- Ver todos os endpoints disponíveis
- Testar as rotas diretamente no navegador
- Ver exemplos de requisições e respostas
- Entender os schemas de validação

### 4.4 Estrutura de URLs

Após iniciar o servidor, você verá no console as seguintes URLs disponíveis:

```
🚀 Servidor rodando na porta 3000
📍 Health check: http://localhost:3000/health
📍 Users API: http://localhost:3000/api/users
📍 Addresses API: http://localhost:3000/api/users/:userId/addresses
📍 Categories API: http://localhost:3000/api/categories
📍 Products API: http://localhost:3000/api/products
📍 Orders API: http://localhost:3000/api/orders
📚 Swagger Docs: http://localhost:3000/api-docs
```

### 4.5 Scripts Disponíveis

| Script | Descrição |
|-------|-----------|
| `npm run build` | Compila o código TypeScript para JavaScript |
| `npm start` | Inicia o servidor em modo produção |
| `npm run dev` | Inicia o servidor em modo desenvolvimento com hot-reload |

---
## 5.📋 Planilha de Test Cases

Este projeto utiliza uma **planilha de Test Cases** para documentar e organizar os cenários de teste do sistema, garantindo a validação das funcionalidades e regras de negócio.

**Link da planilha:** https://docs.google.com/spreadsheets/d/1W7wYSbi27qVhziQkWRDkAUsZsenHcXhseNwe-KSVda0/edit?usp=sharing

Cada caso de teste descreve:
- Funcionalidade testada
- Pré-condições
- Dados de entrada
- Resultado esperado
- Resultado obtido
- 
A planilha serve como base para a criação e validação dos **testes automatizados**, assegurando a qualidade do software.

## ▶️ Execução dos Testes

Para instalar as dependências do projeto:
```
npm install
```

Para execulta o testes:
```
npm run test:unit
```

## 6. 📝 **Notas Importantes**

- **Banco de Dados**: Em modo desenvolvimento, o Sequelize sincroniza automaticamente os modelos com `force: true`, o que **apaga todos os dados** a cada reinicialização.

- **Autenticação**: Algumas rotas requerem autenticação JWT (marcadas como "requer autenticação admin" ou "requer autenticação"). A implementação de autenticação está planejada mas pode não estar totalmente implementada.

- **Estoque**: Quando um pedido é criado, o estoque é automaticamente decrementado. Quando um pedido é cancelado ou deletado, o estoque é devolvido automaticamente.

- **Relacionamentos**: O sistema gerencia automaticamente os relacionamentos entre entidades (User-Address, User-Order, Product-Category, Order-OrderItem, etc).
