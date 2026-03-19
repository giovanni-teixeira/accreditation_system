import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { AppLoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  
  // Usar o LoggerService personalizado do Winston
  const logger = app.get(AppLoggerService);
  app.useLogger(logger);

  // Filtros de Exceção Globais
  app.useGlobalFilters(new GlobalExceptionFilter(), new PrismaExceptionFilter());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('API Alta Café')
    .setDescription('API REST completa do sistema Alta Café - Hackathon.')
    .setVersion('1.2.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  
  logger.log(`🚀 Servidor Backend NestJS rodando com sucesso na porta ${port}!`, 'Bootstrap');
}
bootstrap();
