// Centralização de Endpoints e URLs (Clean Code)

export const ENV_CONFIG = {
    // Se estiver no browser, usa string vazia para caminhos relativos (Nginx resolve /api/)
    // Se estiver no servidor (Next SSR), usa localhost ou host interno
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || (typeof window === 'undefined' ? 'http://nginx' : ''),
};

export const STORAGE_KEYS = {
    TOKEN: 'altacafe_token',
    USER: 'altacafe_user',
};

export const API_ROUTES = {
    AUTH: {
        LOGIN: `/auth/login`,
        REGISTER: `/auth/register`,
        PROMOVER: `/auth/promover`,
    },
    CREDENCIADOS: {
        LISTAR: `/credenciados`,
        BUSCAR: (id: string) => `/credenciados/${id}`,
        BUSCAR_CPF: (cpf: string) => `/credenciados/cpf/${cpf}`,
    },
    DASHBOARD: {
        KPI: `/dashboard/kpis`,
    },
    ENDERECO: {
        CACHE: `/endereco-cache`,
        BUSCAR_CEP: (cep: string) => `/address/${cep}?country=Brasil`,
    }
};
