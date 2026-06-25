// Pré-download dos tiles do mapa (OpenStreetMap) para uso OFFLINE em campo.
// Os tiles baixados aqui passam pelo service worker (runtimeCaching 'osm-tiles'),
// então o mapa do cadastro renderiza depois mesmo sem internet — permitindo
// marcar a casa no toque quando o aparelho não tem GPS ou está sem sinal.
//
// Importante:
//  - Usamos o host único `tile.openstreetmap.org` (sem o subdomínio {s}) para
//    que a chave de cache do pedido <img> do Leaflet bata com a do download.
//  - O servidor de tiles do OSM é gratuito e desencoraja download em massa; por
//    isso baixamos só a área de Santo André e de uma vez (não em segundo plano).

// Área de Santo André - SP (urbano + periferia/encostas), com folga.
const BBOX = { latMin: -23.72, latMax: -23.6, lonMin: -46.6, lonMax: -46.45 };
const ZOOMS = [13, 14, 15, 16];
const CHAVE_INFO = 'georisco:mapa-offline';

export const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

function lonParaX(lon: number, z: number): number {
    return Math.floor(((lon + 180) / 360) * 2 ** z);
}

function latParaY(lat: number, z: number): number {
    const rad = (lat * Math.PI) / 180;
    return Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z);
}

function listarTiles(): { z: number; x: number; y: number }[] {
    const tiles: { z: number; x: number; y: number }[] = [];
    for (const z of ZOOMS) {
        const xIni = lonParaX(BBOX.lonMin, z);
        const xFim = lonParaX(BBOX.lonMax, z);
        const yIni = latParaY(BBOX.latMax, z); // latitude maior => y menor
        const yFim = latParaY(BBOX.latMin, z);
        for (let x = xIni; x <= xFim; x++) {
            for (let y = yIni; y <= yFim; y++) {
                tiles.push({ z, x, y });
            }
        }
    }
    return tiles;
}

export function contarTiles(): number {
    return listarTiles().length;
}

export interface ProgressoDownload {
    baixados: number;
    total: number;
    falhas: number;
}

/** Baixa os tiles de Santo André para o cache do service worker. */
export async function baixarMapaSantoAndre(onProgress?: (p: ProgressoDownload) => void): Promise<ProgressoDownload> {
    const tiles = listarTiles();
    const total = tiles.length;
    let baixados = 0;
    let falhas = 0;
    let proximo = 0;
    const CONCORRENCIA = 5;

    async function worker(): Promise<void> {
        while (proximo < tiles.length) {
            const t = tiles[proximo++];
            const url = `https://tile.openstreetmap.org/${t.z}/${t.x}/${t.y}.png`;
            try {
                const res = await fetch(url);
                if (!res.ok) falhas++;
            } catch {
                falhas++;
            } finally {
                baixados++;
                onProgress?.({ baixados, total, falhas });
            }
        }
    }

    await Promise.all(Array.from({ length: CONCORRENCIA }, () => worker()));

    const resultado: ProgressoDownload = { baixados, total, falhas };
    try {
        localStorage.setItem(CHAVE_INFO, JSON.stringify({ em: Date.now(), total, falhas }));
    } catch {
        // sem localStorage (modo privado): segue sem registrar o histórico
    }
    return resultado;
}

export interface MapaOfflineInfo {
    em: number;
    total: number;
    falhas: number;
}

export function mapaOfflineInfo(): MapaOfflineInfo | null {
    try {
        const raw = localStorage.getItem(CHAVE_INFO);
        return raw ? (JSON.parse(raw) as MapaOfflineInfo) : null;
    } catch {
        return null;
    }
}
