'use server';

// src/controllers/CredenciadoController.js
import { Credenciado, Expositor, Cafeicultor, Visitante, Imprensa } from '@/models/Credenciado';

/**
 * Controller que lida com a requisição de cadastro vinda da View (Formulário).
 * Em um app completo, aqui interagiríamos com o banco de dados.
 */
export async function cadastrarUsuario(formData) {
    try {
        const { role, ...dados } = formData;
        let novoUsuario;

        // Instancia o modelo correto baseado no tipo de usuário
        switch (role) {
            case 'expositor':
                novoUsuario = new Expositor(dados);
                break;
            case 'cafeicultor':
                novoUsuario = new Cafeicultor(dados);
                break;
            case 'visitante':
                novoUsuario = new Visitante(dados);
                break;
            case 'imprensa':
                novoUsuario = new Imprensa(dados);
                break;
            case 'credenciado':
            default:
                novoUsuario = new Credenciado(dados);
                break;
        }

        // Regra de validação de domínio
        novoUsuario.validar();

        // Simular salvamento em DB (Delay artificial para UX da interface)
        await new Promise(resolve => setTimeout(resolve, 800));

        console.log("Novo credenciado salvo [Backend Action]:", novoUsuario);

        return {
            sucesso: true,
            mensagem: `Cadastro realizado com sucesso! Bem-vindo(a), ${novoUsuario.nomeCompleto}.`
        };

    } catch (error) {
        console.error("Erro no cadastro:", error);
        return {
            sucesso: false,
            mensagem: error.message || "Erro ao processar o cadastro."
        };
    }
}
