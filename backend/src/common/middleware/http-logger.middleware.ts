import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    const startTime = Date.now();
    const userId = (req as any).user?.userId;

    res.on('finish', () => {
      const { statusCode } = res;
      const ms = Date.now() - startTime;
      this.logger.access(method, originalUrl, statusCode, ip, ms, userId);
    });

    next();
  }
}
