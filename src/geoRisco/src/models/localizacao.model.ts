export interface Localizacao {
    id: number;
    logradouro: string | null;
    numero: string | null;
    bairro: string | null;
    cidade: string;
    estado: string;
    cep: string | null;
    latitude: number;
    longitude: number;
    referencia: string | null;
    complemento: string | null;
}
