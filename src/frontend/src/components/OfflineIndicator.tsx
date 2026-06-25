import { useEffect, useState } from 'react';
import { aoMudarConectividade, estaOnline } from '../utils/connectivity.ts';
import { aoMudarPendencias, sincronizar } from '../utils/outbox.ts';
import { toast } from './feedback.tsx';

// Indicador fixo de status offline-first:
//  - mostra um aviso quando não há conexão;
//  - mostra quantos cadastros estão aguardando envio;
//  - permite sincronizar manualmente quando a conexão volta.
// Fica oculto quando está online e não há pendências.

export default function OfflineIndicator() {
    const [online, setOnline] = useState(estaOnline());
    const [pendencias, setPendencias] = useState(0);
    const [sincronizandoUi, setSincronizandoUi] = useState(false);

    useEffect(() => aoMudarConectividade(setOnline), []);
    useEffect(() => aoMudarPendencias(setPendencias), []);

    async function sincronizarAgora() {
        if (sincronizandoUi) return;
        setSincronizandoUi(true);
        try {
            const { enviados, falhas } = await sincronizar();
            if (enviados > 0) toast.success(`${enviados} cadastro(s) enviado(s).`);
            if (falhas > 0) toast.error(`${falhas} cadastro(s) ainda não puderam ser enviados.`);
            if (enviados === 0 && falhas === 0) toast.success('Nada pendente para enviar.');
        } finally {
            setSincronizandoUi(false);
        }
    }

    if (online && pendencias === 0) return null;

    const cor = online ? '#0a7d2c' : '#b25a00';
    const fundo = online ? '#e6f6ea' : '#fff3e0';

    return (
        <div
            role="status"
            style={{
                position: 'fixed',
                left: '50%',
                bottom: 'calc(var(--bottom-nav-h, 72px) + 10px)',
                transform: 'translateX(-50%)',
                zIndex: 60,
                maxWidth: '92%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 14px',
                borderRadius: 999,
                background: fundo,
                color: cor,
                border: `1px solid ${cor}33`,
                boxShadow: '0 4px 14px rgba(0,0,0,.12)',
                fontSize: 13,
                fontWeight: 600
            }}
        >
            <span style={{ width: 9, height: 9, borderRadius: 999, background: cor, flex: '0 0 auto' }} />
            <span>
                {!online && 'Sem conexão — cadastros serão salvos no aparelho. '}
                {pendencias > 0 && `${pendencias} aguardando envio`}
                {online && pendencias > 0 && '.'}
            </span>
            {online && pendencias > 0 && (
                <button
                    type="button"
                    onClick={sincronizarAgora}
                    disabled={sincronizandoUi}
                    style={{
                        border: 'none',
                        background: cor,
                        color: '#fff',
                        borderRadius: 999,
                        padding: '4px 12px',
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: sincronizandoUi ? 'default' : 'pointer',
                        opacity: sincronizandoUi ? 0.7 : 1
                    }}
                >
                    {sincronizandoUi ? 'Enviando…' : 'Enviar agora'}
                </button>
            )}
        </div>
    );
}
