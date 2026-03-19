"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_exception_filter_1 = require("./common/filters/prisma-exception.filter");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const logger_service_1 = require("./common/logger/logger.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    const logger = app.get(logger_service_1.AppLoggerService);
    app.useLogger(logger);
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter(), new prisma_exception_filter_1.PrismaExceptionFilter());
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API Alta Café')
        .setDescription('API REST completa do sistema Alta Café - Hackathon.')
        .setVersion('1.2.0')
        .addBearerAuth()
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, documentFactory);
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    logger.log(`🚀 Servidor Backend NestJS rodando com sucesso na porta ${port}!`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map