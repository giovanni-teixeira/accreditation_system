"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const business_exception_1 = require("../exceptions/business.exception");
let PrismaExceptionFilter = class PrismaExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.BAD_REQUEST;
        let message = 'Ocorreu um erro inesperado no banco de dados.';
        let errorCode = 'DATABASE_ERROR';
        if (exception instanceof business_exception_1.BusinessException) {
            status = exception.statusCode;
            message = exception.message;
            errorCode = 'BUSINESS_ERROR';
        }
        else if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            switch (exception.code) {
                case 'P2002': {
                    const target = exception.meta?.target || [];
                    status = common_1.HttpStatus.CONFLICT;
                    message = `Já existe um registro com este(s) dado(s): ${target.join(', ')}`;
                    errorCode = 'DUPLICATE_ENTRY';
                    break;
                }
                case 'P2025':
                    status = common_1.HttpStatus.NOT_FOUND;
                    message = 'O registro solicitado não foi encontrado no sistema.';
                    errorCode = 'NOT_FOUND';
                    break;
                case 'P2003':
                    status = common_1.HttpStatus.BAD_REQUEST;
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
};
exports.PrismaExceptionFilter = PrismaExceptionFilter;
exports.PrismaExceptionFilter = PrismaExceptionFilter = __decorate([
    (0, common_1.Catch)(client_1.Prisma.PrismaClientKnownRequestError, business_exception_1.BusinessException)
], PrismaExceptionFilter);
//# sourceMappingURL=prisma-exception.filter.js.map