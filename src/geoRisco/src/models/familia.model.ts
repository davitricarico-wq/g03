export interface Familia {
    id: number;
    deletedAt: Date | null;
}

export interface PessoaFamilia {
    idPessoa: number;
    idFamilia: number;
    dataEntrada: Date;
    dataSaida: Date | null;
}

export interface PessoaFamiliaRemovida extends PessoaFamilia {
    aviso?: string;
}

export interface FamiliaMoradia {
    idFamilia: number;
    idMoradia: number;
    dataEntrada: Date;
    dataSaida: Date | null;
    status: string | null;
}
