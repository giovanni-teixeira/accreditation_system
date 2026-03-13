import { PrismaService } from '../prisma.service';
export declare abstract class BaseRepository<T, CreateInput, UpdateInput> {
    protected readonly prisma: PrismaService;
    protected readonly model: any;
    constructor(prisma: PrismaService, model: any);
    create(data: CreateInput, include?: object): Promise<T>;
    findAll(include?: object): Promise<T[]>;
    findById(id: string, include?: object): Promise<T | null>;
    update(id: string, data: UpdateInput): Promise<T>;
    delete(id: string): Promise<T>;
}
