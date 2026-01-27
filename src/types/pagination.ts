/**
 * Tipos e interfaces para paginação, filtros e ordenação
 */

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface SortParams {
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface FilterParams {
    [key: string]: any;
}

export interface QueryParams extends PaginationParams, SortParams {
    [key: string]: any;
}

/**
 * Valida e normaliza parâmetros de paginação
 */
export function normalizePaginationParams(params: PaginationParams): { page: number; limit: number; offset: number } {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10)); // Máximo 100 itens por página
    const offset = (page - 1) * limit;

    return { page, limit, offset };
}

/**
 * Valida e normaliza parâmetros de ordenação
 */
export function normalizeSortParams<T extends string>(
    params: SortParams,
    allowedFields: readonly T[] | T[],
    defaultField: T,
    defaultOrder: 'ASC' | 'DESC' = 'ASC'
): { sortBy: T; sortOrder: 'ASC' | 'DESC' } {
    const sortBy = (params.sortBy && allowedFields.includes(params.sortBy as T))
        ? (params.sortBy as T)
        : defaultField;

    const sortOrder = params.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    return { sortBy, sortOrder };
}

/**
 * Cria resposta de paginação
 */
export function createPaginationResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
): PaginationResult<T> {
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
}
