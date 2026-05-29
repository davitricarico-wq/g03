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

export interface FamiliaMoradia {
    idFamilia: number;
    idMoradia: number;
    dataEntrada: Date;
    dataSaida: Date | null;
    status: string | null;
}
