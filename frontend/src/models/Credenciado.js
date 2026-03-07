// src/models/Credenciado.js

export class Credenciado {
    constructor({ nomeCompleto, cpf, rg, celular, email, municipio, uf, aceitouLgpd }) {
        this.id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
        this.nomeCompleto = nomeCompleto;
        this.cpf = cpf;
        this.rg = rg;
        this.celular = celular;
        this.email = email;
        this.municipio = municipio;
        this.uf = uf;
        this.aceitouLgpd = aceitouLgpd;
        this.tipo = 'Credenciado';
    }

    validar() {
        if (!this.nomeCompleto || !this.cpf || !this.aceitouLgpd) {
            throw new Error("Dados básicos incompletos (Nome, CPF e aceite da LGPD são obrigatórios).");
        }
    }
}

export class Expositor extends Credenciado {
    constructor(data) {
        super(data);
        this.cnpj = data.cnpj;
        this.nomeEmpresa = data.nomeEmpresa;
        this.siteEmpresa = data.siteEmpresa;
        this.tipo = 'Expositor';
    }

    validar() {
        super.validar();
        if (!this.cnpj || !this.nomeEmpresa) {
            throw new Error("Expositor precisa de CNPJ e Nome da Empresa.");
        }
    }
}

export class Cafeicultor extends Credenciado {
    constructor(data) {
        super(data);
        this.ccir = data.ccir;
        this.nomePropriedade = data.nomePropriedade;
        this.tipo = 'Cafeicultor';
    }

    validar() {
        super.validar();
        if (!this.ccir || !this.nomePropriedade) {
            throw new Error("Cafeicultor precisa de CCIR e Nome da Propriedade.");
        }
    }
}

export class Visitante extends Credenciado {
    constructor(data) {
        super(data);
        this.tipo = 'Visitante';
    }
}

export class Imprensa extends Credenciado {
    constructor(data) {
        super(data);
        this.cnpj = data.cnpj;
        this.nomeVeiculo = data.nomeVeiculo;
        this.siteEmpresa = data.siteEmpresa; // opcional
        this.tipo = 'Imprensa';
    }

    validar() {
        super.validar();
        if (!this.cnpj || !this.nomeVeiculo) {
            throw new Error("Imprensa precisa de CNPJ e Nome do Veículo.");
        }
    }
}
