import { useRef } from 'react';
import { toast } from './feedback.tsx';

export interface FotoLocal {
    key: string;
    file: File;
    url: string;
}

const MAX_MB = 8;

export function criarFotoLocal(file: File): FotoLocal {
    return { key: crypto.randomUUID(), file, url: URL.createObjectURL(file) };
}

interface PhotoPickerProps {
    fotos: FotoLocal[];
    onAdd: (novas: FotoLocal[]) => void;
    onRemove: (key: string) => void;
    label?: string;
    max?: number;
    showName?: boolean;
}

export default function PhotoPicker({ fotos, onAdd, onRemove, label = 'Adicionar foto', max = 6, showName = false }: PhotoPickerProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleFiles(lista: FileList | null) {
        if (!lista || lista.length === 0) return;
        const aceitas: FotoLocal[] = [];
        for (const file of Array.from(lista)) {
            if (!file.type.startsWith('image/')) {
                toast.error(`"${file.name}" não é uma imagem.`);
                continue;
            }
            if (file.size > MAX_MB * 1024 * 1024) {
                toast.error(`"${file.name}" excede ${MAX_MB}MB.`);
                continue;
            }
            if (fotos.length + aceitas.length >= max) {
                toast.error(`Máximo de ${max} fotos.`);
                break;
            }
            aceitas.push(criarFotoLocal(file));
        }
        if (aceitas.length) onAdd(aceitas);
        if (inputRef.current) inputRef.current.value = '';
    }

    return (
        <div className="photo-picker">
            <div className="photo-grid">
                {fotos.map((f) => (
                    <div key={f.key} className="photo-thumb anim-pop">
                        <img src={f.url} alt="pré-visualização" />
                        <button type="button" className="photo-remove" aria-label="Remover foto" onClick={() => onRemove(f.key)}>
                            ×
                        </button>
                        {showName && <span className="photo-name" title={f.file.name}>{f.file.name}</span>}
                    </div>
                ))}
                {fotos.length < max && (
                    <button type="button" className="photo-add" onClick={() => inputRef.current?.click()}>
                        <span className="photo-add-ic">＋</span>
                        <span>{label}</span>
                    </button>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                hidden
                onChange={(e) => handleFiles(e.target.files)}
            />
        </div>
    );
}
