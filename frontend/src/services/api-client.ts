// src/services/api-client.ts
import { ENV_CONFIG } from '@/config/api';


export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(endpoint, config);

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { message: 'Erro desconhecido no servidor.' };
        }

        // Tratamento amigável de mensagens vindas do NestJS (class-validator)
        let message = errorData.message || 'Erro ao comunicar com o servidor.';
        if (Array.isArray(message)) {
            message = message.join(', ');
        }

        throw new Error(message);
    }

    // Para casos de 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}
