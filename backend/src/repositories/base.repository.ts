// src/repositories/base.repository.ts
import { PrismaService } from '../prisma.service';
import { BusinessException } from '../common/exceptions/business.exception';

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly model: any,
  ) {}

  async create(data: CreateInput, include?: any): Promise<T> {
    try {
      return await this.model.create({ data, include });
    } catch (error) {
      if (error.code && error.code.startsWith('P')) {
          // O PrismaExceptionFilter cuidará disso no nível de Controller
          throw error;
      }
      throw new BusinessException(`Falha ao criar registro: ${error.message}`);
    }
  }

  async findAll(include?: any): Promise<T[]> {
    try {
      return await this.model.findMany({ include });
    } catch (error) {
      throw new BusinessException(`Falha ao buscar registros: ${error.message}`);
    }
  }

  async findById(id: string, include?: any): Promise<T | null> {
    try {
      const result = await this.model.findUnique({
        where: { id },
        include,
      });
      return result as T | null;
    } catch (error) {
      throw new BusinessException(`Erro ao buscar registro pelo ID: ${error.message}`);
    }
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code && error.code.startsWith('P')) throw error;
      throw new BusinessException(`Falha ao atualizar registro: ${error.message}`);
    }
  }

  async delete(id: string): Promise<T> {
    try {
      return await this.model.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code && error.code.startsWith('P')) throw error;
      throw new BusinessException(`Falha ao excluir registro: ${error.message}`);
    }
  }
}
