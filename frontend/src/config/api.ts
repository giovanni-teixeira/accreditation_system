const isServer = typeof window === 'undefined';

export const ENV_CONFIG = {
    // No servidor (SSR), chamamos o backend diretamente na porta 3001. baseada no feedback do usuário.
    // No navegador, usamos o path relativo /api que o Nginx intercepta. baseada no feedback do usuário.
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || (isServer ? 'http://backend:3001' : ''),
};

// O prefixo /api é necessário apenas para o Nginx (lado do cliente). baseada no feedback do usuário.
// Internamente no Docker, o backend escuta na raiz /. baseada no feedback do usuário.
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
