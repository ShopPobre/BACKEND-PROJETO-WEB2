import { Request, Response, NextFunction } from 'express';

/**
 * Armazena as requisições por IP
 */
interface RateLimitStore {
    [ip: string]: {
        count: number;
        resetTime: number;
    };
}

class RateLimiter {
    private store: RateLimitStore = {};
    private windowMs: number;
    private maxRequests: number;

    constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
        this.windowMs = windowMs; // 15 minutos por padrão
        this.maxRequests = maxRequests; // 100 requisições por padrão
    }

    /**
     * Limpa entradas expiradas do store
     */
    private cleanup(): void {
        const now = Date.now();
        Object.keys(this.store).forEach((ip) => {
            if (this.store[ip].resetTime < now) {
                delete this.store[ip];
            }
        });
    }

    /**
     * Obtém o IP do cliente
     */
    private getClientIp(req: Request): string {
        const forwarded = req.headers['x-forwarded-for'];
        if (typeof forwarded === 'string') {
            return forwarded.split(',')[0].trim();
        }
        return req.ip || req.socket.remoteAddress || 'unknown';
    }

    /**
     * Middleware de rate limiting
     */
    middleware() {
        return (req: Request, res: Response, next: NextFunction): void => {
            // Limpar entradas expiradas periodicamente
            if (Math.random() < 0.1) { // 10% de chance de limpar a cada requisição
                this.cleanup();
            }

            const ip = this.getClientIp(req);
            const now = Date.now();

            // Inicializar ou obter registro do IP
            if (!this.store[ip] || this.store[ip].resetTime < now) {
                this.store[ip] = {
                    count: 0,
                    resetTime: now + this.windowMs,
                };
            }

            // Incrementar contador
            this.store[ip].count++;

            // Verificar se excedeu o limite
            if (this.store[ip].count > this.maxRequests) {
                const resetTime = new Date(this.store[ip].resetTime).toISOString();
                
                res.status(429).json({
                    error: 'Muitas requisições',
                    message: `Limite de ${this.maxRequests} requisições por ${this.windowMs / 1000 / 60} minutos excedido. Tente novamente após ${resetTime}`,
                    retryAfter: Math.ceil((this.store[ip].resetTime - now) / 1000),
                    statusCode: 429,
                });
                return;
            }

            // Adicionar headers informativos
            res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
            res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - this.store[ip].count).toString());
            res.setHeader('X-RateLimit-Reset', new Date(this.store[ip].resetTime).toISOString());

            next();
        };
    }
}

/**
 * Rate limiter padrão: 100 requisições por 15 minutos
 */
export const defaultRateLimiter = new RateLimiter(15 * 60 * 1000, 100);

/**
 * Rate limiter estrito: 20 requisições por 15 minutos (para operações sensíveis)
 */
export const strictRateLimiter = new RateLimiter(15 * 60 * 1000, 20);

/**
 * Rate limiter para autenticação: 5 requisições por 15 minutos
 */
export const authRateLimiter = new RateLimiter(15 * 60 * 1000, 5);

/**
 * Factory para criar rate limiters customizados
 */
export function createRateLimiter(windowMs: number, maxRequests: number): RateLimiter {
    return new RateLimiter(windowMs, maxRequests);
}
