import { IAddressRepository } from "../interfaces/IAddressRepository";
import { Address } from "../models";
import { QueryParams, PaginationResult, normalizePaginationParams, normalizeSortParams, createPaginationResponse } from "../types/pagination";
import { Op } from "sequelize";

export class AddressRepository implements IAddressRepository{
    private readonly allowedSortFields = ['rua', 'cidade', 'estado', 'tipo'] as const;

    async create(data: any): Promise<Address> {
        const address = await Address.create(data);
        return address;
    }

    async getAllAddresses(userID: string, queryParams?: QueryParams): Promise<PaginationResult<Address>> {
        const { page, limit, offset } = normalizePaginationParams(queryParams || {});
        const { sortBy, sortOrder } = normalizeSortParams(queryParams || {}, this.allowedSortFields, 'rua');

        // Construir filtros
        const where: any = { userID };

        // Filtro por cidade
        if (queryParams?.cidade) {
            where.cidade = { [Op.like]: `%${queryParams.cidade}%` };
        }

        // Filtro por estado
        if (queryParams?.estado) {
            where.estado = queryParams.estado;
        }

        // Filtro por tipo
        if (queryParams?.tipo) {
            where.tipo = queryParams.tipo;
        }

        // Filtro por CEP
        if (queryParams?.cep) {
            where.cep = { [Op.like]: `%${queryParams.cep}%` };
        }

        // Contar total
        const total = await Address.count({ where });

        // Buscar dados paginados
        const addresses = await Address.findAll({
            where,
            order: [[sortBy, sortOrder]],
            limit,
            offset,
        });

        return createPaginationResponse(addresses, total, page, limit);
    }

    async findByID(id: string): Promise<Address | null> {
        return await Address.findByPk(id);
    }

    async update(id: string, data: any): Promise<Address> {
        const address = await Address.findByPk(id);

        if (!address) {
        throw new Error("Address not found");
        }

        await address.update(data);
        return address;
    }

    async delete(id: string): Promise<boolean> {
        const deletedCount = await Address.destroy({
        where: { id }
        });

        return deletedCount > 0;
    }
    

    
}