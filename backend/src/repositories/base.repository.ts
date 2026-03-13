// src/repositories/base.repository.ts
import { PrismaService } from '../prisma.service';

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly model: any,
  ) {}

  async create(data: CreateInput, include?: any): Promise<T> {
    try {
      return await this.model.create({ data, include });
    } catch (error) {
      // Aqui podemos interceptar erros específicos do Prisma e lançar exceções de domínio
      throw error;
    }
  }

  async findAll(include?: any): Promise<T[]> {
    return this.model.findMany({ include });
  }

  async findById(id: string, include?: any): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
      include,
    });
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }
}
