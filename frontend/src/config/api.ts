// Centralização de Endpoints e URLs (Clean Code)
// Se no futuro você colocar o backend em outro domínio (ex: api.meusite.com),
// basta trocar a BASE_URL aqui. O proxy reverso atualmente atende por '/api' perfeitamente.

export const ENV_CONFIG = {
    // Use '/' para proxy Nginx local (docker), ou a URl da nuvem.
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || (typeof window === 'undefined' ? 'http://nginx' : ''),
};

export const API_ROUTES = {
    CREDENCIADOS: {
        CRIAR: (role: string) => `${ENV_CONFIG.API_BASE_URL}/api/credenciados/${role}`,
        BUSCAR_POR_CPF: (cpf: string) => `${ENV_CONFIG.API_BASE_URL}/api/credenciados/cpf/${cpf}`,
    },
    EXTERNAL: {
        VIA_CEP: (zipCode: string) => `https://viacep.com.br/ws/${zipCode}/json/`,
    }
};
