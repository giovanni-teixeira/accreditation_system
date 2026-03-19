import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Filtros de Exceção Globais (ordem importa: GlobalException captura o que o Prisma não capturou)
  app.useGlobalFilters(new GlobalExceptionFilter(), new PrismaExceptionFilter());

  // Habilitar CORS para o frontend em `localhost:3000`
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validações Globais (class-validator)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger (OpenAPI)
  const config = new DocumentBuilder()
    .setTitle('API Alta Café')
    .setDescription('API REST completa do sistema Alta Café - Hackathon.')
    .setVersion('1.2.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  // Rodar na porta 3001
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(
    `🚀 Servidor Backend NestJS rodando com sucesso na porta ${port}!`,
  );
}
bootstrap();
