// src/repositories/base.repository.ts
import { PrismaService } from '../prisma.service';

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly model: any, // Referência ao modelo do Prisma (ex: this.prisma.evento)
  ) {}

  async create(data: CreateInput, include?: any): Promise<T> {
    return this.model.create({ data, include });
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
