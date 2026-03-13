"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const business_exception_1 = require("../common/exceptions/business.exception");
class BaseRepository {
    prisma;
    model;
    constructor(prisma, model) {
        this.prisma = prisma;
        this.model = model;
    }
    async create(data, include) {
        try {
            return await this.model.create({ data, include });
        }
        catch (error) {
            if (error.code && error.code.startsWith('P')) {
                throw error;
            }
            throw new business_exception_1.BusinessException(`Falha ao criar registro: ${error.message}`);
        }
    }
    async findAll(include) {
        try {
            return await this.model.findMany({ include });
        }
        catch (error) {
            throw new business_exception_1.BusinessException(`Falha ao buscar registros: ${error.message}`);
        }
    }
    async findById(id, include) {
        try {
            const result = await this.model.findUnique({
                where: { id },
                include,
            });
            return result;
        }
        catch (error) {
            throw new business_exception_1.BusinessException(`Erro ao buscar registro pelo ID: ${error.message}`);
        }
    }
    async update(id, data) {
        try {
            return await this.model.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            if (error.code && error.code.startsWith('P'))
                throw error;
            throw new business_exception_1.BusinessException(`Falha ao atualizar registro: ${error.message}`);
        }
    }
    async delete(id) {
        try {
            return await this.model.delete({
                where: { id },
            });
        }
        catch (error) {
            if (error.code && error.code.startsWith('P'))
                throw error;
            throw new business_exception_1.BusinessException(`Falha ao excluir registro: ${error.message}`);
        }
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map