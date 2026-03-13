import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
}
