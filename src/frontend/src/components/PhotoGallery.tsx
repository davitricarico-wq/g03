import { useEffect, useState } from 'react';
import { listarFotosMoradia, listarFotosPet, urlAssinadaFoto } from '../api.ts';
import type { Foto } from '../types.ts';

type PhotoOwner = 'moradia' | 'pet';

interface PhotoGalleryProps {
    owner: PhotoOwner;
    ownerId: number;
    initialFotos?: Foto[];
}

interface FotoView {
    foto: Foto;
    src: string;
}

async function resolverFoto(foto: Foto): Promise<FotoView> {
    try {
        const { signedUrl } = await urlAssinadaFoto(foto.id);
        return { foto, src: signedUrl };
    } catch {
        return { foto, src: foto.url };
    }
}

export default function PhotoGallery({ owner, ownerId, initialFotos }: PhotoGalleryProps) {
    const [fotos, setFotos] = useState<FotoView[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let cancelado = false;
        async function carregar() {
            setCarregando(true);
            setErro(null);
            try {
                const registros = initialFotos ?? await (owner === 'moradia' ? listarFotosMoradia(ownerId) : listarFotosPet(ownerId));
                const resolvidas = await Promise.all(registros.map(resolverFoto));
                if (!cancelado) setFotos(resolvidas);
            } catch {
                if (!cancelado) setErro('Não foi possível carregar as imagens.');
            } finally {
                if (!cancelado) setCarregando(false);
            }
        }
        void carregar();
        return () => {
            cancelado = true;
        };
    }, [owner, ownerId, initialFotos]);

    if (carregando) return <p className="photo-gallery-state">Carregando imagens...</p>;
    if (erro) return <p className="photo-gallery-state error">{erro}</p>;
    if (fotos.length === 0) return null;

    return (
        <div className="photo-gallery">
            {fotos.map(({ foto, src }, index) => (
                <a key={foto.id} href={src} target="_blank" rel="noreferrer" className="photo-gallery-item">
                    <img src={src} alt={`Imagem ${index + 1}`} loading="lazy" />
                    <span>Abrir</span>
                </a>
            ))}
        </div>
    );
}
