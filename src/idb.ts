
export const dbName = "origin-chats-flufi";
export const storeName = "data";

export function open() {
    const req = indexedDB.open(dbName, 1);

    req.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
        }
    };

    return req;
}

export function openStore(callback: (db: IDBDatabase) => void) {
    let req = open();

    req.onsuccess = function(event) {
        // @ts-expect-error
        const db = event.target.result as IDBDatabase;
        callback(db);
    };
}

export function set(key: IDBValidKey, value: any) {
    openStore((db) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        store.add(value, key);
    });
}

export function get(key: IDBValidKey, callback: (value: any) => void, err_callback: () => void) {
    openStore((db) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        const request = store.get(key);

        request.onsuccess = () => callback(request.result);
        request.onerror = () => err_callback();
    })
}

open();
