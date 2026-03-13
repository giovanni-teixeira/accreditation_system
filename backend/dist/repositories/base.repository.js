"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    prisma;
    model;
    constructor(prisma, model) {
        this.prisma = prisma;
        this.model = model;
    }
    async create(data, include) {
        return this.model.create({ data, include });
    }
    async findAll(include) {
        return this.model.findMany({ include });
    }
    async findById(id, include) {
        return this.model.findUnique({
            where: { id },
            include,
        });
    }
    async update(id, data) {
        return this.model.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return this.model.delete({
            where: { id },
        });
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map