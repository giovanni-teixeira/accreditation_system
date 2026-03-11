export interface ICredenciadoArgs {
    nomeCompleto: string;
    cpf: string;
    rg: string;
    celular: string;
    email: string;
    municipio: string;
    uf: string;
    aceiteLgpd: boolean;
}

export class Credenciado {
    id: string;
    nomeCompleto: string;
    cpf: string;
    rg: string;
    celular: string;
    email: string;
    municipio: string;
    uf: string;
    aceiteLgpd: boolean;
    tipo: string;

    constructor(data: ICredenciadoArgs) {
        this.id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
        this.nomeCompleto = data.nomeCompleto;
        this.cpf = data.cpf;
        this.rg = data.rg;
        this.celular = data.celular;
        this.email = data.email;
        this.municipio = data.municipio;
        this.uf = data.uf;
        this.aceiteLgpd = data.aceiteLgpd;
        this.tipo = 'Credenciado';
    }

    validar() {
        if (!this.nomeCompleto || !this.cpf || !this.aceiteLgpd) {
            throw new Error("Dados básicos incompletos (Nome, CPF e aceite da LGPD são obrigatórios).");
        }
    }
}

export interface IExpositorArgs extends ICredenciadoArgs {
    cnpj: string;
    nomeEmpresa: string;
    siteEmpresa?: string;
}

export class Expositor extends Credenciado {
    cnpj: string;
    nomeEmpresa: string;
    siteEmpresa?: string;

    constructor(data: IExpositorArgs) {
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

export interface ICafeicultorArgs extends ICredenciadoArgs {
    ccir: string;
    nomePropriedade: string;
}

export class Cafeicultor extends Credenciado {
    ccir: string;
    nomePropriedade: string;

    constructor(data: ICafeicultorArgs) {
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
    constructor(data: ICredenciadoArgs) {
        super(data);
        this.tipo = 'Visitante';
    }
}

export interface IImprensaArgs extends ICredenciadoArgs {
    cnpj: string;
    nomeVeiculo: string;
    siteEmpresa?: string;
}

export class Imprensa extends Credenciado {
    cnpj: string;
    nomeVeiculo: string;
    siteEmpresa?: string;

    constructor(data: IImprensaArgs) {
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
