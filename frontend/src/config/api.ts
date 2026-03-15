const isServer = typeof window === 'undefined';

export const ENV_CONFIG = {

    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || (isServer ? 'http://backend:3001' : ''),
};

const prefix = isServer ? '' : '/api';

export const API_ROUTES = {
    CREDENCIADOS: {
        CRIAR: () => `${ENV_CONFIG.API_BASE_URL}${prefix}/credenciados`,
        BUSCAR_POR_CPF: (cpf: string) => `${ENV_CONFIG.API_BASE_URL}${prefix}/credenciados/cpf/${cpf}`,
    },
    ADDRESS: {
        BUSCAR: (zipCode: string, country: string = 'Brasil') => `${ENV_CONFIG.API_BASE_URL}${prefix}/address/${zipCode}?country=${country}`,
    },
    EXTERNAL: {
        VIA_CEP: (zipCode: string) => `https://viacep.com.br/ws/${zipCode}/json/`,
        BRASIL_API: (zipCode: string) => `https://brasilapi.com.br/api/cep/v1/${zipCode}`,
    }
};
