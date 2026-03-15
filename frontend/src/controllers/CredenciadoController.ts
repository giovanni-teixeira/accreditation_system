'use server';

// src/controllers/CredenciadoController.ts
import { Credenciado, Expositor, Produtor, Visitante, Imprensa } from '@/models/Credenciado';
import { API_ROUTES } from '@/config/api';
import { CredenciadoService } from '@/services/credenciado.service';

export interface CadastroResponse {
    sucesso: boolean;
    mensagem: string;
    dadosRecebidos?: any;
}

export async function cadastrarUsuario(formData: any): Promise<CadastroResponse> {
    try {
        const { role, ...dados } = formData;
        let novoUsuario: Credenciado;


        switch (role) {
            case 'expositor':
                novoUsuario = new Expositor(dados as any);
                break;
            case 'produtor':
                novoUsuario = new Produtor(dados as any);
                break;
            case 'visitante':
                novoUsuario = new Visitante(dados as any);
                break;
            case 'imprensa':
                novoUsuario = new Imprensa(dados as any);
                break;
            case 'credenciado':
            default:
                novoUsuario = new Credenciado(dados as any);
                break;
        }


        novoUsuario.validar();


        const rotasPossiveis = ['visitante', 'produtor', 'imprensa', 'expositor'];
        if (!rotasPossiveis.includes(role)) {
            throw new Error('Perfil inválido no sistema.');
        }


        const usuarioCriado = await CredenciadoService.cadastrar(role, dados);

        return {
            sucesso: true,
            mensagem: `Cadastro realizado com sucesso! Bem-vindo(a), ${usuarioCriado.nomeCompleto}.`,
            dadosRecebidos: usuarioCriado
        };

    } catch (error: any) {
        console.error("Erro no cadastro:", error);
        return {
            sucesso: false,
            mensagem: error.message || "Erro ao processar o cadastro."
        };
    }
}

export async function buscarPorCpf(cpf: string): Promise<CadastroResponse> {
    try {
        const cleanCpf = cpf.replace(/\D/g, '');
        const data = await CredenciadoService.buscarPorCpf(cleanCpf);

        return {
            sucesso: true,
            mensagem: `Credencial encontrada!`,
            dadosRecebidos: data
        };
    } catch (error: any) {
        console.error("Erro na busca por CPF:", error);
        return {
            sucesso: false,
            mensagem: error.message || "CPF não encontrado na base de dados."
        };
    }
}
