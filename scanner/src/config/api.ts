// Centralização de Endpoints e URLs (Clean Code)

export const ENV_CONFIG = {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || (typeof window === 'undefined' ? 'http://nginx' : ''),
};

export const API_ROUTES = {
    AUTH: {
        LOGIN_PORTARIA: `${ENV_CONFIG.API_BASE_URL}/api/auth/login`,
    },
    QRCODE: {
        // Sincronizações assíncronas caso falte internet na hora do scan
        SYNC_OFFLINE: `${ENV_CONFIG.API_BASE_URL}/api/credenciados/sync-scans`,
    }
};
