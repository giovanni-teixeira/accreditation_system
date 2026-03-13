import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new PrismaExceptionFilter());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('APIV Alta Café - Rotas Individuais')
    .setDescription(
      'Sistema elegante com endpoints específicos para cada perfil de credenciamento.',
    )
    .setVersion('1.1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(
    `🚀 Servidor Backend NestJS rodando com sucesso na porta ${port}!`,
  );
}
bootstrap();
