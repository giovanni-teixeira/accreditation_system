import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

const logsDir = path.join(process.cwd(), 'logs');

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const extra = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${extra}`;
  }),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) =>
    `[${timestamp}] ${level} ${message}`,
  ),
);

@Injectable()
export class AppLoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;
  private readonly accessLogger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      transports: [
        // Console
        new winston.transports.Console({ format: consoleFormat }),
        // Arquivo combinado (INFO+)
        new (winston.transports as any).DailyRotateFile({
          dirname: logsDir,
          filename: 'combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '14d',
          format: fileFormat,
        }),
        // Apenas erros
        new (winston.transports as any).DailyRotateFile({
          dirname: logsDir,
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxFiles: '14d',
          format: fileFormat,
        }),
      ],
    });

    this.accessLogger = winston.createLogger({
      level: 'info',
      transports: [
        // Console
        new winston.transports.Console({ format: consoleFormat }),
        // Arquivo
        new (winston.transports as any).DailyRotateFile({
          dirname: logsDir,
          filename: 'access-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '14d',
          format: fileFormat,
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  /** Registrar acesso HTTP */
  access(method: string, url: string, status: number, ip: string, ms: number, userId?: string) {
    this.accessLogger.info(`${method} ${url}`, {
      status,
      ip,
      ms: `${ms}ms`,
      userId: userId ?? 'anônimo',
    });
  }
}
