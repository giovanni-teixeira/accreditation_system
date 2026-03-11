// Centralização de Endpoints e URLs (Clean Code)

export const ENV_CONFIG = {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || (typeof window === 'undefined' ? 'http://nginx' : ''),
};

export const API_ROUTES = {
    AUTH: {
        LOGIN: `${ENV_CONFIG.API_BASE_URL}/api/auth/login`,
    },
    CREDENCIADOS: {
        LISTAR: `${ENV_CONFIG.API_BASE_URL}/api/credenciados`,
        BUSCAR: (id: string) => `${ENV_CONFIG.API_BASE_URL}/api/credenciados/${id}`,
    },
    DASHBOARD: {
        METRICAS: `${ENV_CONFIG.API_BASE_URL}/api/dashboard/estatisticas`,
    }
};
