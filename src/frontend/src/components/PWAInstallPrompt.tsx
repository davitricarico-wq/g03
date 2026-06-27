import { useEffect, useState } from 'react';
import Icon from './Icon.tsx';

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches
        || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

function installDismissed(): boolean {
    try {
        return localStorage.getItem('georisco:pwa-install-dismissed') === 'true';
    } catch {
        return false;
    }
}

function setInstallDismissed(): void {
    try {
        localStorage.setItem('georisco:pwa-install-dismissed', 'true');
    } catch {
        // Sem localStorage (modo privado): apenas oculta nesta sessão.
    }
}

export default function PWAInstallPrompt() {
    const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [dispensado, setDispensado] = useState(installDismissed);

    useEffect(() => {
        const onBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            if (!isStandalone()) {
                setPromptEvent(event as BeforeInstallPromptEvent);
            }
        };

        const onInstalled = () => {
            setPromptEvent(null);
            setInstallDismissed();
            setDispensado(true);
        };

        window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
        window.addEventListener('appinstalled', onInstalled);
        return () => {
            window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    if (!promptEvent || dispensado || isStandalone()) return null;

    async function instalar() {
        if (!promptEvent) return;
        await promptEvent.prompt();
        const escolha = await promptEvent.userChoice;
        if (escolha.outcome === 'accepted') {
            setInstallDismissed();
            setDispensado(true);
        }
        setPromptEvent(null);
    }

    function dispensar() {
        setInstallDismissed();
        setDispensado(true);
    }

    return (
        <div className="pwa-install" role="status">
            <Icon name="arrow-down" size={18} />
            <span>Instale o GeoRisco para uso em campo.</span>
            <button type="button" onClick={() => void instalar()}>
                Instalar
            </button>
            <button type="button" className="pwa-install-dismiss" aria-label="Dispensar instalação" onClick={dispensar}>
                <Icon name="x-circle" size={17} />
            </button>
        </div>
    );
}
