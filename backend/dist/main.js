"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_exception_filter_1 = require("./common/filters/prisma-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new prisma_exception_filter_1.PrismaExceptionFilter());
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('APIV Alta Café - Rotas Individuais')
        .setDescription('Sistema elegante com endpoints específicos para cada perfil de credenciamento.')
        .setVersion('1.1.0')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, documentFactory);
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`🚀 Servidor Backend NestJS rodando com sucesso na porta ${port}!`);
}
bootstrap();
//# sourceMappingURL=main.js.map