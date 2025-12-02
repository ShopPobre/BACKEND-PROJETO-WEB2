import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerDefinition } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "ShopPobre API",
        version: "1.0.0",
        description: "API RESTful para o sistema de e-commerce ShopPobre. Sistema completo de gerenciamento de produtos, categorias, pedidos e pagamentos.",
        contact: {
            name: "ShopPobre Team",
            email: "support@shoppobre.com"
        },
        license: {
            name: "ISC",
            url: "https://opensource.org/licenses/ISC"
        }
    },
    servers: [
        {
            url: process.env.API_URL || "http://localhost:3000",
            description: "Servidor de desenvolvimento"
        },
        {
            url: "https://api.shoppobre.com",
            description: "Servidor de produção"
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Token JWT obtido através do endpoint de autenticação. Formato: Bearer {token}"
            }
        },
        schemas: {
            // Category Schemas
            CreateCategoryDTO: {
                type: "object",
                required: ["name"],
                properties: {
                    name: {
                        type: "string",
                        minLength: 2,
                        maxLength: 100,
                        example: "Eletrônicos",
                        description: "Nome da categoria (obrigatório, 2-100 caracteres)"
                    },
                    description: {
                        type: "string",
                        maxLength: 500,
                        example: "Produtos eletrônicos em geral",
                        description: "Descrição da categoria (opcional, máximo 500 caracteres)"
                    }
                }
            },
            UpdateCategoryDTO: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        minLength: 2,
                        maxLength: 100,
                        example: "Eletrônicos Atualizados",
                        description: "Nome da categoria (2-100 caracteres)"
                    },
                    description: {
                        type: "string",
                        maxLength: 500,
                        example: "Nova descrição para a categoria",
                        description: "Descrição da categoria (máximo 500 caracteres)"
                    },
                    isActive: {
                        type: "boolean",
                        example: true,
                        description: "Status ativo/inativo da categoria"
                    }
                }
            },
            CategoryResponseDTO: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        example: 1,
                        description: "ID único da categoria"
                    },
                    name: {
                        type: "string",
                        example: "Eletrônicos",
                        description: "Nome da categoria"
                    },
                    description: {
                        type: "string",
                        nullable: true,
                        example: "Produtos eletrônicos em geral",
                        description: "Descrição da categoria"
                    },
                    isActive: {
                        type: "boolean",
                        example: true,
                        description: "Status ativo/inativo"
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        example: "2024-01-15T10:30:00.000Z",
                        description: "Data de criação"
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                        example: "2024-01-15T10:30:00.000Z",
                        description: "Data de atualização"
                    }
                }
            },
            // Error Schemas
            Error: {
                type: "object",
                properties: {
                    error: {
                        type: "string",
                        example: "Mensagem de erro",
                        description: "Mensagem de erro descritiva"
                    },
                    statusCode: {
                        type: "integer",
                        example: 400,
                        description: "Código HTTP do erro"
                    }
                }
            },
            ValidationError: {
                type: "object",
                properties: {
                    error: {
                        type: "string",
                        example: "Nome da categoria é obrigatório",
                        description: "Mensagem de erro de validação"
                    },
                    statusCode: {
                        type: "integer",
                        example: 422,
                        description: "Código HTTP 422 (Unprocessable Entity)"
                    }
                }
            },
            NotFoundError: {
                type: "object",
                properties: {
                    error: {
                        type: "string",
                        example: "Categoria não encontrada",
                        description: "Mensagem de erro quando recurso não é encontrado"
                    },
                    statusCode: {
                        type: "integer",
                        example: 404,
                        description: "Código HTTP 404 (Not Found)"
                    }
                }
            },
            ConflictError: {
                type: "object",
                properties: {
                    error: {
                        type: "string",
                        example: "Categoria com este nome já existe",
                        description: "Mensagem de erro quando há conflito (ex: duplicação)"
                    },
                    statusCode: {
                        type: "integer",
                        example: 409,
                        description: "Código HTTP 409 (Conflict)"
                    }
                }
            },
            // Health Check Schema
            HealthCheck: {
                type: "object",
                properties: {
                    status: {
                        type: "string",
                        example: "OK",
                        description: "Status do servidor"
                    },
                    message: {
                        type: "string",
                        example: "Server is running",
                        description: "Mensagem de status"
                    }
                }
            }
        },
        responses: {
            UnauthorizedError: {
                description: "Token de autenticação inválido ou ausente",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Error"
                        },
                        example: {
                            error: "Token de autenticação inválido",
                            statusCode: 401
                        }
                    }
                }
            },
            ForbiddenError: {
                description: "Usuário não tem permissão para acessar este recurso",
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/Error"
                        },
                        example: {
                            error: "Acesso negado. Apenas administradores podem realizar esta ação.",
                            statusCode: 403
                        }
                    }
                }
            }
        }
    },
    tags: [
        {
            name: "Health",
            description: "Endpoints de verificação de saúde do servidor"
        },
        {
            name: "Categories",
            description: "Operações relacionadas ao gerenciamento de categorias de produtos"
        },
        {
            name: "Authentication",
            description: "Operações de autenticação e autorização (a implementar)"
        }
    ]
};

const options: swaggerJsdoc.Options = {
    definition: swaggerDefinition,
    apis: [
        "./src/routes/*.ts",
        "./src/controllers/*.ts",
        "./src/index.ts"
    ]
};

export const swaggerSpec = swaggerJsdoc(options);

