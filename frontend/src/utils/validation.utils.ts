/**
 * Utilitários de validação para documentos brasileiros (CPF e CNPJ). baseada no feedback do usuário.
 */
export class Validador {
    /**
     * Valida o CPF informado. baseada no feedback do usuário.
     * @param cpf CPF formatado ou apenas números
     * @returns boolean
     */
    static validarCPF(cpf: string): boolean {
        const cleanCPF = cpf.replace(/\D/g, '');

        if (cleanCPF.length !== 11) return false;

        // Elimina CPFs conhecidos inválidos
        if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

        // Validação do primeiro dígito
        let add = 0;
        for (let i = 0; i < 9; i++) {
            add += parseInt(cleanCPF.charAt(i)) * (10 - i);
        }
        let rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cleanCPF.charAt(9))) return false;

        // Validação do segundo dígito
        add = 0;
        for (let i = 0; i < 10; i++) {
            add += parseInt(cleanCPF.charAt(i)) * (11 - i);
        }
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cleanCPF.charAt(10))) return false;

        return true;
    }

    /**
     * Valida o CNPJ informado. baseada no feedback do usuário.
     * @param cnpj CNPJ formatado ou apenas números
     * @returns boolean
     */
    static validarCNPJ(cnpj: string): boolean {
        const cleanCNPJ = cnpj.replace(/\D/g, '');

        if (cleanCNPJ.length !== 14) return false;

        // Elimina CNPJs conhecidos inválidos
        if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

        // Validação do primeiro dígito
        let size = cleanCNPJ.length - 2;
        let numbers = cleanCNPJ.substring(0, size);
        const digits = cleanCNPJ.substring(size);
        let sum = 0;
        let pos = size - 7;
        for (let i = size; i >= 1; i--) {
            sum += parseInt(numbers.charAt(size - i)) * pos--;
            if (pos < 2) pos = 9;
        }
        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(0))) return false;

        // Validação do segundo dígito
        size = size + 1;
        numbers = cleanCNPJ.substring(0, size);
        sum = 0;
        pos = size - 7;
        for (let i = size; i >= 1; i--) {
            sum += parseInt(numbers.charAt(size - i)) * pos--;
            if (pos < 2) pos = 9;
        }
        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(1))) return false;

        return true;
    }
}
