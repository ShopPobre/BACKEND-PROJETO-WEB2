# BACKEND-PROJETO-WEB2

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

- **Node.js** (versão 20 ou superior)
- **npm** ou **yarn**
- **MySQL** (versão 8 ou superior) ou **PostgreSQL**
- **Docker** e **Docker Compose** (opcional, para usar containers)

### 4.2 Instalação e Configuração

#### Opção 1: Execução Local (Sem Docker)

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/ShopPobre/BACKEND-PROJETO-WEB2.git
   cd BACKEND-PROJETO-WEB2
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   # Banco de Dados
   DB_DIALECT=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=seu_usuario
   DB_PASS=sua_senha
   DB_NAME=shopobre_db

   # Servidor
   PORT=3000
   NODE_ENV=development
   ```

4. **Crie o banco de dados:**
   
   Acesse seu MySQL/PostgreSQL e crie o banco de dados:
   ```sql
   CREATE DATABASE shopobre_db;
   ```

5. **Compile o projeto TypeScript:**
   ```bash
   npm run build
   ```

6. **Inicie o servidor:**
   
   **Modo desenvolvimento (com hot-reload):**
   ```bash
   npm run dev
   ```
   
   **Modo produção:**
   ```bash
   npm start
   ```

7. **Verifique se está funcionando:**
   
   Acesse no navegador ou via curl:
   ```bash
   curl http://localhost:3000/health
   ```
   
   Você deve receber:
   ```json
   {
     "status": "OK",
     "message": "Server is running"
   }
   ```

#### Opção 2: Execução com Docker Compose

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/ShopPobre/BACKEND-PROJETO-WEB2.git
   cd BACKEND-PROJETO-WEB2
   ```

2. **Configure as variáveis de ambiente:**
   
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   # Banco de Dados
   DB_DIALECT=mysql
   DB_PORT=3306
   DB_USER=shopobre_user
   DB_PASS=shopobre_password
   DB_NAME=shopobre_db
   ```

3. **Inicie os containers:**
   ```bash
   docker-compose up -d
   ```

4. **Verifique os logs:**
   ```bash
   docker-compose logs -f backend
   ```

5. **Acesse a aplicação:**
   
   - API: `http://localhost:3000`
   - Health Check: `http://localhost:3000/health`
   - Swagger Docs: `http://localhost:3000/api-docs`

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
