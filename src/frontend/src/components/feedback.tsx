import { useEffect, useState } from 'react';

/* ===========================================================
   TOASTS — API imperativa + host
   =========================================================== */
type ToastKind = 'success' | 'error' | 'info';
interface ToastItem {
    id: number;
    kind: ToastKind;
    msg: string;
}

let toastItems: ToastItem[] = [];
let toastListeners: ((items: ToastItem[]) => void)[] = [];
let toastSeq = 0;

function emitToasts() {
    toastListeners.forEach((l) => l(toastItems));
}

function pushToast(msg: string, kind: ToastKind, ms: number) {
    const id = ++toastSeq;
    toastItems = [...toastItems, { id, kind, msg }];
    emitToasts();
    window.setTimeout(() => {
        toastItems = toastItems.filter((t) => t.id !== id);
        emitToasts();
    }, ms);
}

export const toast = {
    success: (msg: string, ms = 2600) => pushToast(msg, 'success', ms),
    error: (msg: string, ms = 4200) => pushToast(msg, 'error', ms),
    info: (msg: string, ms = 2800) => pushToast(msg, 'info', ms)
};

const TOAST_ICONS: Record<ToastKind, string> = { success: '✓', error: '✕', info: 'ℹ' };

export function ToastHost() {
    const [list, setList] = useState<ToastItem[]>(toastItems);
    useEffect(() => {
        const listener = (items: ToastItem[]) => setList([...items]);
        toastListeners.push(listener);
        return () => {
            toastListeners = toastListeners.filter((l) => l !== listener);
        };
    }, []);

    if (list.length === 0) return null;
    return (
        <div className="toast-host">
            {list.map((t) => (
                <div key={t.id} className={`toast toast-${t.kind}`}>
                    <span className="toast-ic">{TOAST_ICONS[t.kind]}</span>
                    <span>{t.msg}</span>
                </div>
            ))}
        </div>
    );
}

/* ===========================================================
   CONFIRMAÇÃO — confirmDialog() => Promise<boolean>
   =========================================================== */
interface ConfirmOpts {
    title: string;
    message: string;
    okLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
}
interface ConfirmState {
    opts: ConfirmOpts;
    resolve: (ok: boolean) => void;
}

let confirmState: ConfirmState | null = null;
let confirmListeners: ((s: ConfirmState | null) => void)[] = [];

function emitConfirm() {
    confirmListeners.forEach((l) => l(confirmState));
}

export function confirmDialog(opts: ConfirmOpts): Promise<boolean> {
    return new Promise((resolve) => {
        confirmState = { opts, resolve };
        emitConfirm();
    });
}

export function ConfirmHost() {
    const [state, setState] = useState<ConfirmState | null>(confirmState);
    useEffect(() => {
        const listener = (s: ConfirmState | null) => setState(s);
        confirmListeners.push(listener);
        return () => {
            confirmListeners = confirmListeners.filter((l) => l !== listener);
        };
    }, []);

    if (!state) return null;
    const { opts, resolve } = state;
    const close = (ok: boolean) => {
        confirmState = null;
        emitConfirm();
        resolve(ok);
    };

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && close(false)}>
            <div className="modal" role="dialog" aria-modal="true">
                <h3>{opts.title}</h3>
                <p>{opts.message}</p>
                <div className="modal-actions">
                    <button className="btn btn-outline" onClick={() => close(false)}>
                        {opts.cancelLabel ?? 'Cancelar'}
                    </button>
                    <button className={`btn ${opts.danger ? 'btn-danger' : 'btn-azul'}`} onClick={() => close(true)}>
                        {opts.okLabel ?? 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
