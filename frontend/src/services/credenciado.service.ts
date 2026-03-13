// src/services/credenciado.service.ts
import { API_ROUTES } from '@/config/api';
import { apiClient } from './api-client';


export const CredenciadoService = {

    async cadastrar(role: string, dados: any) {
        const body = {
            ...dados,
            tipoCategoria: role.toUpperCase()
        };
        return apiClient<any>(API_ROUTES.CREDENCIADOS.CRIAR(), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },
    async buscarPorCpf(cpf: string) {
        return apiClient<any>(API_ROUTES.CREDENCIADOS.BUSCAR_POR_CPF(cpf));
    }
};
