import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import Icon from './Icon.tsx';
import { toast } from './feedback.tsx';

export default function PWAUpdatePrompt() {
    const [atualizar, setAtualizar] = useState<(() => Promise<void>) | null>(null);

    useEffect(() => {
        const updateSW = registerSW({
            immediate: true,
            onOfflineReady() {
                toast.success('GeoRisco pronto para uso offline.');
            },
            onNeedRefresh() {
                setAtualizar(() => updateSW);
            },
            onRegisterError(error) {
                console.error('Erro ao registrar service worker', error);
            }
        });
    }, []);

    if (!atualizar) return null;

    return (
        <div className="pwa-update" role="status">
            <Icon name="sparkle" size={18} />
            <span>Nova versão disponível.</span>
            <button type="button" onClick={() => void atualizar()}>
                Atualizar
            </button>
        </div>
    );
}
