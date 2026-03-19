import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno no servidor.';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      // Erros de validação do class-validator vêm como objeto com array de 'message'
      if (typeof res === 'object' && res !== null && 'message' in res) {
        const rawMessage = (res as any).message;
        message = Array.isArray(rawMessage)
          ? rawMessage.join('; ')
          : rawMessage;
      } else if (typeof res === 'string') {
        message = res;
      }

      // Mapear códigos HTTP para errorCode legível
      const codeMap: Record<number, string> = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        409: 'CONFLICT',
        422: 'UNPROCESSABLE',
        429: 'TOO_MANY_REQUESTS',
        500: 'INTERNAL_ERROR',
      };
      errorCode = codeMap[status] ?? 'HTTP_ERROR';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      errorCode,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
