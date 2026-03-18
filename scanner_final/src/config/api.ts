

const isServer = typeof window === 'undefined';

export const ENV_CONFIG = {

    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || (isServer ? 'http://backend:3001' : ''),
};

const prefix = isServer ? '' : '/api';

export const API_ROUTES = {
    AUTH: {
        LOGIN_PORTARIA: `${ENV_CONFIG.API_BASE_URL}${prefix}/auth/login`,
    },
    QRCODE: {
        SYNC_OFFLINE: `${ENV_CONFIG.API_BASE_URL}${prefix}/credenciados/sync-scans`,
    },
    SCANS: {
        CHECK_IN: `${ENV_CONFIG.API_BASE_URL}${prefix}/scans/check-in`,
        CHECK_IN_BATCH: `${ENV_CONFIG.API_BASE_URL}${prefix}/scans/check-in-batch`,
    }
};
