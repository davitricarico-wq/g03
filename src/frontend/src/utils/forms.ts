/* ===========================================================
   Máscaras de input
   =========================================================== */
export function maskCPF(value: string): string {
    return value
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskCEP(value: string): string {
    return value
        .replace(/\D/g, '')
        .slice(0, 8)
        .replace(/(\d{5})(\d)/, '$1-$2');
}

export function maskTelefone(value: string): string {
    const d = value.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 10) {
        return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    }
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}

export function maskDataBR(value: string): string {
    return value
        .replace(/\D/g, '')
        .slice(0, 8)
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
}

export function isoParaDataBR(value: string | null | undefined): string {
    const match = String(value ?? '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
}

export function dataBRParaISO(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 8) return value;
    return `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
}

export function dataBRValida(value: string): boolean {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 8) return false;

    const dia = Number(digits.slice(0, 2));
    const mes = Number(digits.slice(2, 4));
    const ano = Number(digits.slice(4, 8));
    const data = new Date(ano, mes - 1, dia);

    return data.getFullYear() === ano
        && data.getMonth() === mes - 1
        && data.getDate() === dia;
}

export function cpfValido(value: string): boolean {
    const cpf = value.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    const calcularDigito = (base: string, pesoInicial: number) => {
        const soma = base
            .split('')
            .reduce((total, digito, index) => total + Number(digito) * (pesoInicial - index), 0);
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    const primeiro = calcularDigito(cpf.slice(0, 9), 10);
    const segundo = calcularDigito(cpf.slice(0, 10), 11);
    return primeiro === Number(cpf[9]) && segundo === Number(cpf[10]);
}

export function emailValido(value: string): boolean {
    const email = value.trim();
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/* ===========================================================
   Busca de endereço por CEP (ViaCEP)
   =========================================================== */
export interface EnderecoViaCep {
    logradouro: string;
    numero?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep?: string;
}

export async function buscarCep(cep: string): Promise<EnderecoViaCep | null> {
    const limpo = cep.replace(/\D/g, '');
    if (limpo.length !== 8) return null;
    try {
        const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
        if (!res.ok) return null;
        const data = await res.json();
        if (data?.erro) return null;
        return {
            logradouro: data.logradouro ?? '',
            bairro: data.bairro ?? '',
            cidade: data.localidade ?? '',
            uf: data.uf ?? '',
            cep: data.cep ?? ''
        };
    } catch {
        return null;
    }
}

type NominatimAddress = {
    road?: string;
    pedestrian?: string;
    footway?: string;
    residential?: string;
    house_number?: string;
    neighbourhood?: string;
    suburb?: string;
    quarter?: string;
    city_district?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    postcode?: string;
};

const UF_POR_ESTADO: Record<string, string> = {
    acre: 'AC',
    alagoas: 'AL',
    amapa: 'AP',
    amazonas: 'AM',
    bahia: 'BA',
    ceara: 'CE',
    'distrito federal': 'DF',
    'espirito santo': 'ES',
    goias: 'GO',
    maranhao: 'MA',
    'mato grosso': 'MT',
    'mato grosso do sul': 'MS',
    'minas gerais': 'MG',
    para: 'PA',
    paraiba: 'PB',
    parana: 'PR',
    pernambuco: 'PE',
    piaui: 'PI',
    'rio de janeiro': 'RJ',
    'rio grande do norte': 'RN',
    'rio grande do sul': 'RS',
    rondonia: 'RO',
    roraima: 'RR',
    'santa catarina': 'SC',
    'sao paulo': 'SP',
    sergipe: 'SE',
    tocantins: 'TO'
};

function normalizarEstado(value: string | undefined): string {
    return (value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function obterBairro(address: NominatimAddress): string {
    return address.neighbourhood ?? address.suburb ?? address.quarter ?? '';
}

export async function buscarEnderecoPorCoordenadas(latitude: number, longitude: number): Promise<EnderecoViaCep | null> {
    try {
        const params = new URLSearchParams({
            format: 'jsonv2',
            lat: String(latitude),
            lon: String(longitude),
            addressdetails: '1'
        });
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`);
        if (!res.ok) return null;

        const data = await res.json();
        const address = (data?.address ?? {}) as NominatimAddress;
        const estado = normalizarEstado(address.state);
        return {
            logradouro: address.road ?? address.pedestrian ?? address.footway ?? address.residential ?? '',
            numero: address.house_number ?? '',
            bairro: obterBairro(address),
            cidade: address.city ?? address.town ?? address.village ?? address.municipality ?? '',
            uf: UF_POR_ESTADO[estado] ?? '',
            cep: address.postcode ?? ''
        };
    } catch {
        return null;
    }
}

/* ===========================================================
   Captura de coordenadas via GPS
   =========================================================== */
export interface Coordenada {
    latitude: number;
    longitude: number;
    accuracy?: number;
}

type CoordenadaGPSCache = Coordenada & { capturadaEm: number };
let ultimaCoordenadaGPS: CoordenadaGPSCache | null = null;
const GPS_CACHE_MAX_AGE_MS = 60000;

export function registrarCoordenadaGPS(pos: GeolocationPosition): Coordenada {
    const coordenada = {
        latitude: Number(pos.coords.latitude.toFixed(6)),
        longitude: Number(pos.coords.longitude.toFixed(6)),
        accuracy: Math.round(pos.coords.accuracy)
    };
    ultimaCoordenadaGPS = { ...coordenada, capturadaEm: Date.now() };
    return coordenada;
}

function mensagemErroGPS(error: GeolocationPositionError): string {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return 'Permissão de localização negada. Autorize o acesso ao GPS no navegador e tente novamente.';
        case error.POSITION_UNAVAILABLE:
            return 'Não foi possível obter sua localização atual. Verifique se o GPS ou a rede estão disponíveis.';
        case error.TIMEOUT:
            return 'Tempo esgotado ao capturar GPS. Tente novamente em local aberto ou selecione a posição no mapa.';
        default:
            return 'Não foi possível capturar a localização atual. Se necessário, selecione a posição no mapa.';
    }
}

function obterCoordenadaGPS(options: PositionOptions): Promise<Coordenada> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve(registrarCoordenadaGPS(pos)),
            reject,
            options
        );
    });
}

export function capturarGPS(): Promise<Coordenada> {
    if (!navigator.geolocation) {
        return Promise.reject(new Error('Geolocalização não disponível neste navegador. Selecione a posição no mapa.'));
    }

    if (ultimaCoordenadaGPS && Date.now() - ultimaCoordenadaGPS.capturadaEm <= GPS_CACHE_MAX_AGE_MS) {
        const { capturadaEm: _capturadaEm, ...coordenada } = ultimaCoordenadaGPS;
        return Promise.resolve(coordenada);
    }

    return obterCoordenadaGPS({ enableHighAccuracy: true, timeout: 12000, maximumAge: GPS_CACHE_MAX_AGE_MS })
        .catch((error: GeolocationPositionError) => {
            if (error.code === error.PERMISSION_DENIED) throw error;
            return obterCoordenadaGPS({ enableHighAccuracy: false, timeout: 10000, maximumAge: GPS_CACHE_MAX_AGE_MS });
        })
        .catch((error: GeolocationPositionError) => {
            throw new Error(mensagemErroGPS(error));
        });
}
