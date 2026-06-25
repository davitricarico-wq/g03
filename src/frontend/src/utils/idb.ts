// Wrapper mínimo de IndexedDB usado pela fila offline (outbox).
// IndexedDB é escolhido (em vez de localStorage) porque guarda objetos
// estruturados e, principalmente, Blobs/Files das fotos sem serialização.

const DB_NOME = 'georisco-offline';
const DB_VERSAO = 1;
const STORE = 'outbox';

function abrir(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NOME, DB_VERSAO);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE)) {
                db.createObjectStore(STORE, { keyPath: 'id' });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function comStore<T>(modo: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest): Promise<T> {
    return abrir().then(
        (db) =>
            new Promise<T>((resolve, reject) => {
                const tx = db.transaction(STORE, modo);
                const req = fn(tx.objectStore(STORE));
                req.onsuccess = () => resolve(req.result as T);
                req.onerror = () => reject(req.error);
                tx.oncomplete = () => db.close();
            })
    );
}

export function idbAdicionar<T extends { id: string }>(item: T): Promise<IDBValidKey> {
    return comStore<IDBValidKey>('readwrite', (store) => store.put(item));
}

export function idbListar<T>(): Promise<T[]> {
    return comStore<T[]>('readonly', (store) => store.getAll());
}

export function idbRemover(id: string): Promise<void> {
    return comStore<void>('readwrite', (store) => store.delete(id));
}

export function idbContar(): Promise<number> {
    return comStore<number>('readonly', (store) => store.count());
}
