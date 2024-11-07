import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private _storage!: Storage; // Usamos el operador de aserción no nula

    constructor(private storage: Storage) {
        this.init();
    }

    private async init() {
        this._storage = await this.storage.create();
    }

    public async set(key: string, value: any): Promise<void> {
        await this.initIfNeeded(); // Asegúrate de inicializar si no lo está
        await this._storage.set(key, value);
    }

    public async get(key: string): Promise<any> {
        await this.initIfNeeded(); // Asegúrate de inicializar si no lo está
        const value = await this._storage.get(key);
        console.log(`Getting ${key}:`, value); // Mensaje de depuración
        return value;
    }

    public async remove(key: string): Promise<void> {
        await this.initIfNeeded(); // Asegúrate de inicializar si no lo está
        await this._storage.remove(key);
    }

    public async clear(): Promise<void> {
        await this.initIfNeeded(); // Asegúrate de inicializar si no lo está
        await this._storage.clear();
    }

    public async initIfNeeded(): Promise<void> {
        if (!this._storage) {
            await this.init(); // Solo inicializa si no está
        }
    }
}
