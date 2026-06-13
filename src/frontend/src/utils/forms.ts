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

/* ===========================================================
   Busca de endereço por CEP (ViaCEP)
   =========================================================== */
export interface EnderecoViaCep {
    logradouro: string;
    bairro: string;
    cidade: string;
    uf: string;
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
            uf: data.uf ?? ''
        };
    } catch {
        return null;
    }
}

/* ===========================================================
   Captura de coordenadas via GPS (com fallback demo)
   =========================================================== */
export interface Coordenada {
    latitude: number;
    longitude: number;
    accuracy?: number;
    demo?: boolean;
}

// Santo André - SP (centro aproximado)
const CENTRO_SANTO_ANDRE = { lat: -23.6633, lng: -46.5306 };

function coordenadaDemo(): Coordenada {
    return {
        latitude: Number((CENTRO_SANTO_ANDRE.lat + (Math.random() - 0.5) * 0.04).toFixed(6)),
        longitude: Number((CENTRO_SANTO_ANDRE.lng + (Math.random() - 0.5) * 0.05).toFixed(6)),
        demo: true
    };
}

export function capturarGPS(): Promise<Coordenada> {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(coordenadaDemo());
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) =>
                resolve({
                    latitude: Number(pos.coords.latitude.toFixed(6)),
                    longitude: Number(pos.coords.longitude.toFixed(6)),
                    accuracy: Math.round(pos.coords.accuracy)
                }),
            () => resolve(coordenadaDemo()),
            { enableHighAccuracy: true, timeout: 8000 }
        );
    });
}
