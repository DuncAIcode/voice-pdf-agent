/**
 * Safety Vault: IndexedDB wrapper for local audio persistence.
 * This ensures that even if transcription fails or the browser closes,
 * the raw audio remains on the device.
 */

const DB_NAME = "VoiceToPDF_Vault";
const STORE_NAME = "audio_backups";
const DB_VERSION = 1;

export interface AudioBackup {
    id: string;
    blob: Blob;
    timestamp: number;
    filename: string;
    duration?: number;
    status: 'pending' | 'synced' | 'failed';
}

class AudioStorage {
    private db: IDBDatabase | null = null;
    private channel: BroadcastChannel | null = null;
    private events = new EventTarget();

    constructor() {
        if (typeof window !== "undefined") {
            this.channel = new BroadcastChannel("audio-vault-updates");
            this.channel.onmessage = (event) => {
                if (event.data.type === "SYNC_COMPLETE") {
                    this.events.dispatchEvent(new CustomEvent("update"));
                }
            };
        }
    }

    async init(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "id" });
                }
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(request.result);
            };

            request.onerror = () => reject(request.error);
        });
    }

    async saveRecording(audioBlob: Blob, filename: string): Promise<string> {
        const db = await this.init();
        const id = crypto.randomUUID();
        const backup: AudioBackup = {
            id,
            blob: audioBlob,
            timestamp: Date.now(),
            filename,
            status: 'pending'
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(backup);

            request.onsuccess = () => {
                // Notify other tabs
                this.channel?.postMessage({ type: "SYNC_COMPLETE", id });
                // Notify this tab immediately
                this.events.dispatchEvent(new CustomEvent("update"));
                resolve(id);
            };
            request.onerror = () => reject(request.error);
        });
    }

    onUpdate(callback: () => void) {
        const handler = () => callback();
        this.events.addEventListener("update", handler);
        return () => this.events.removeEventListener("update", handler);
    }

    async getAllBackups(): Promise<AudioBackup[]> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                // Return sorted by timestamp desc
                const results = (request.result as AudioBackup[]).sort((a, b) => b.timestamp - a.timestamp);
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async deleteRecording(id: string): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async cleanupOldRecordings(maxAgeHours: number = 48): Promise<number> {
        const backups = await this.getAllBackups();
        const now = Date.now();
        const cutoff = now - (maxAgeHours * 60 * 60 * 1000);

        let deletedCount = 0;
        for (const backup of backups) {
            if (backup.timestamp < cutoff) {
                await this.deleteRecording(backup.id);
                deletedCount++;
            }
        }
        return deletedCount;
    }
}

export const audioStorage = new AudioStorage();
