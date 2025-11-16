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
| **User**      | Representa os usuários do sistema (Admin e Cliente).   | 1:N com `Order`, 1:N com `Address`, 1:N com `Review`      |
| **Role**      | Define os papéis de usuário (`ADMIN`, `CUSTOMER`).     | 1:N com `User`                                            |
| **Category**  | Classifica produtos (Ex: Eletrônicos, Roupas).         | 1:N com `Product`                                         |
| **Product**   | Produto à venda, com nome, preço, descrição e estoque. | N:1 com `Category`, 1:N com `Review`, 1:N com `OrderItem` |
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
