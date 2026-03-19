"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTES = void 0;
exports.ROUTES = {
    AUTH: {
        BASE: 'auth',
        LOGIN: 'login',
        REGISTER: 'register',
        PROMOVER: 'promover',
    },
    USUARIOS: {
        BASE: 'usuarios',
    },
    CREDENCIADOS: {
        BASE: 'credenciados',
        CRIAR: '',
        BUSCAR_CPF: 'cpf/:cpf',
    },
    EVENTOS: {
        BASE: 'eventos',
    },
    DESCARBONIZACAO: {
        BASE: 'descarbonizacao',
        SUMMARY: 'summary',
        BY_CREDENCIADO: ':credenciadoId',
    },
    SCANS: {
        BASE: 'scans',
        CHECK_IN: 'check-in',
        CHECK_IN_BATCH: 'check-in-batch',
        SUMMARY: 'summary',
    },
    DATA: {
        BASE: 'data',
        EVENTOS: 'eventos',
        USUARIOS_ORGANIZACAO: 'usuarios-organizacao',
        CREDENCIADOS: 'credenciados',
        ENDERECOS: 'enderecos',
        ENDERECO_CACHE: 'endereco-cache',
        DESCARBONIZACAO: 'descarbonizacao',
        CREDENCIAL: 'credenciais',
        QR_SCANS: 'qr-scans',
    },
};
//# sourceMappingURL=routes.constants.js.map