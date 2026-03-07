'use server';

// src/controllers/CredenciadoController.ts
import { Credenciado, Expositor, Cafeicultor, Visitante, Imprensa } from '@/models/Credenciado';

export interface CadastroResponse {
    sucesso: boolean;
    mensagem: string;
}

/**
 * Controller que lida com a requisição de cadastro vinda da View (Formulário).
 * Em um app completo, aqui interagiríamos com o banco de dados.
 */
export async function cadastrarUsuario(formData: any): Promise<CadastroResponse> {
    try {
        const { role, ...dados } = formData;
        let novoUsuario: Credenciado;

        // Instancia o modelo correto baseado no tipo de usuário 
        switch (role) {
            case 'expositor':
                novoUsuario = new Expositor(dados as any);
                break;
            case 'cafeicultor':
                novoUsuario = new Cafeicultor(dados as any);
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

        // Regra de validação de domínio do frontend
        novoUsuario.validar();

        // Limpa tipagens não necessárias que possam ter sobrado do objeto instanciado (tipo, id)
        const rotasPossiveis = ['visitante', 'cafeicultor', 'imprensa', 'expositor'];
        if (!rotasPossiveis.includes(role)) {
            throw new Error('Perfil inválido no sistema.');
        }

        // Requisição para o backend NestJS rodando na porta 3001
        const res = await fetch(`http://localhost:3001/credenciados/${role}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!res.ok) {
            // Em caso de Bad Request (400), tentamos parsear o erro retornado pelo class-validator ou Prisma.
            const erroRes = await res.json().catch(() => ({}));

            let errorMessage = erroRes.message || 'Erro ao comunicar com o servidor de credenciamento.';
            if (Array.isArray(errorMessage)) errorMessage = errorMessage.join(', ');

            throw new Error(errorMessage);
        }

        const usuarioCriado = await res.json();

        return {
            sucesso: true,
            mensagem: `Cadastro realizado com sucesso! Bem-vindo(a), ${usuarioCriado.nomeCompleto}.`
        };

    } catch (error: any) {
        console.error("Erro no cadastro:", error);
        return {
            sucesso: false,
            mensagem: error.message || "Erro ao processar o cadastro."
        };
    }
}
