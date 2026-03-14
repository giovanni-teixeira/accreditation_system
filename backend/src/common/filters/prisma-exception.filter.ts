import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { BusinessException } from '../exceptions/business.exception';

@Catch(Prisma.PrismaClientKnownRequestError, BusinessException)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.BAD_REQUEST;
    let message = 'Ocorreu um erro inesperado no banco de dados.';
    let errorCode = 'DATABASE_ERROR';

    // Se for uma exceção de negócio nossa
    if (exception instanceof BusinessException) {
      status = exception.statusCode;
      message = exception.message;
      errorCode = 'BUSINESS_ERROR';
    }
    // Se for erro do Prisma
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': {
          const target = (exception.meta?.target as string[]) || [];
          status = HttpStatus.CONFLICT;
          message = `Já existe um registro com este(s) dado(s): ${target.join(', ')}`;
          errorCode = 'DUPLICATE_ENTRY';
          break;
        }
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'O registro solicitado não foi encontrado no sistema.';
          errorCode = 'NOT_FOUND';
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message =
            'Erro de relacionamento: Um dado referenciado não existe ou está em uso.';
          errorCode = 'FOREIGN_KEY_VIOLATION';
          break;
        default:
          message = `Erro no Banco de Dados (${exception.code}): ${exception.message}`;
          break;
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
