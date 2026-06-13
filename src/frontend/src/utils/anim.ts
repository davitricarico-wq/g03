import { useCallback, useEffect, useState } from 'react';

/* ===========================================================
   Preferência de animações — estado GLOBAL compartilhado.
   Vários componentes (header e Home) usam `useAnimacoes`; todos
   precisam refletir a mesma preferência. Por isso o estado vive
   no módulo (com listeners), e não dentro de cada componente.

   Quando desativadas, adiciona a classe `anim-off` no <html>,
   que a folha de estilo usa para zerar transições/animações
   e melhorar o desempenho em aparelhos mais simples.
   =========================================================== */
const KEY = 'georisco:animacoes';

function leituraInicial(): boolean {
    try {
        return localStorage.getItem(KEY) !== 'off';
    } catch {
        return true;
    }
}

let estado = leituraInicial();
let listeners: ((ativas: boolean) => void)[] = [];

export function animacoesAtivas(): boolean {
    return estado;
}

export function aplicarAnimacoes(ativas: boolean): void {
    document.documentElement.classList.toggle('anim-off', !ativas);
}

export function definirAnimacoes(ativas: boolean): void {
    estado = ativas;
    try {
        localStorage.setItem(KEY, ativas ? 'on' : 'off');
    } catch {
        /* ignora storage indisponível */
    }
    aplicarAnimacoes(ativas);
    listeners.forEach((l) => l(ativas));
}

/** Aplica a preferência salva no boot da aplicação. */
export function iniciarAnimacoes(): void {
    estado = leituraInicial();
    aplicarAnimacoes(estado);
}

/** Hook para qualquer botão de alternância — todos ficam sincronizados. */
export function useAnimacoes(): [boolean, () => void] {
    const [ativas, setAtivas] = useState<boolean>(estado);
    useEffect(() => {
        const listener = (v: boolean) => setAtivas(v);
        listeners.push(listener);
        // sincroniza com o estado atual no momento da montagem
        setAtivas(estado);
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    }, []);
    const alternar = useCallback(() => definirAnimacoes(!estado), []);
    return [ativas, alternar];
}
