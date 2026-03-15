/**
 * Utilitário de máscaras de input para o sistema Alta Café
 */
export class MaskUtils {
    /**
     * Aplica máscara de CEP: 00000-000
     */
    static cep(value: string): string {
        const clean = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

        // Se for 8 dígitos numéricos, aplica máscara brasileira
        if (/^\d{8}$/.test(clean)) {
            return clean.replace(/^(\d{5})(\d{3})/, '$1-$2');
        }

        // Se estiver no processo de digitação numérica, ajuda na máscara
        if (/^\d+$/.test(clean)) {
            if (clean.length > 5) {
                return clean.replace(/^(\d{5})(\d{1,3}).*/, '$1-$2');
            }
            return clean.slice(0, 8);
        }

        // Caso contrário (internacional), limita em 12 caracteres alfanuméricos
        return clean.slice(0, 12);
    }

    /**
     * Aplica máscara de CPF: 000.000.000-00
     */
    static cpf(value: string): string {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1')
            .slice(0, 14);
    }

    /**
     * Aplica máscara de Celular: (00) 00000-0000
     */
    static celular(value: string): string {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1')
            .slice(0, 15);
    }

    /**
     * Aplica máscara de RG: 00.000.000-0 (Padrão genérico alfanumérico)
     */
    static rg(value: string): string {
        let raw = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (raw.length > 9) raw = raw.slice(0, 9);

        if (raw.length > 8) {
            return raw.replace(/^(.{2})(.{3})(.{3})(.{1}).*/, '$1.$2.$3-$4');
        } else if (raw.length > 5) {
            return raw.replace(/^(.{2})(.{3})(.+)/, '$1.$2.$3');
        } else if (raw.length > 2) {
            return raw.replace(/^(.{2})(.+)/, '$1.$2');
        }
        return raw;
    }

    /**
     * Aplica máscara de CNPJ: 00.000.000/0000-00
     */
    static cnpj(value: string): string {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1')
            .slice(0, 18);
    }

    /**
     * Aplica máscara de CCIR: 000.000.000.000-0
     */
    static ccir(value: string): string {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{1})\d+?$/, '$1')
            .slice(0, 15);
    }

    /**
     * Aplica máscara de Passport / ID (Padrão ICAO/BR): 2 Letras + 7 Números (9 caracteres)
     */
    static passportID(value: string): string {
        const letters = value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2);
        const numbers = value.slice(letters.length).replace(/\D/g, '').slice(0, 7);
        return (letters + numbers).slice(0, 9);
    }

    /**
     * Remove caracteres especiais, mantendo apenas letras e números (Alfanumérico)
     */
    static unmask(value: string): string {
        return value.replace(/[^a-zA-Z0-9]/g, '');
    }
}
