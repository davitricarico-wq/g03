// Detecção de conectividade. A1 (sem service worker): usamos navigator.onLine
// + os eventos 'online'/'offline' da janela para decidir entre enviar agora ou
// enfileirar para depois. (Observação: onLine indica "tem rede", não garante
// que a internet esteja realmente acessível — suficiente para o cenário de campo
// em que o agente perde o sinal por completo.)

export function estaOnline(): boolean {
    return typeof navigator === 'undefined' ? true : navigator.onLine;
}

export function aoMudarConectividade(cb: (online: boolean) => void): () => void {
    const aoVoltar = () => cb(true);
    const aoCair = () => cb(false);
    window.addEventListener('online', aoVoltar);
    window.addEventListener('offline', aoCair);
    return () => {
        window.removeEventListener('online', aoVoltar);
        window.removeEventListener('offline', aoCair);
    };
}
