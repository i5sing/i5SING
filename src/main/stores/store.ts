import { writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';
import * as mkdirp from 'mkdirp';

export class Store {
    private readonly homePath: string;
    private readonly cache = new Map<string, any>();
    private timer;

    constructor(homePath: string) {
        this.homePath = homePath;
        try {
            const path = resolve(this.homePath, 'i5sing/cache');
            mkdirp(path);
            this.cache = new Map<string, any>(JSON.parse(readFileSync(resolve(path, 'data.json')).toString()));
        } catch (e) {
        }
    }

    public clear(): void {
        this.scheduleSync();
        this.cache.clear();
    }

    public delete(key: string): boolean {
        this.scheduleSync();
        return this.cache.delete(key);
    }

    public get<T extends any>(key: string): T | undefined {
        return this.cache.get(key);
    }

    public has(key: string): boolean {
        return this.cache.has(key);
    }

    public set(key: string, value: any): this {
        this.scheduleSync();
        this.cache.set(key, value);
        return this;
    }

    public sync() {
        writeFileSync(resolve(this.homePath, 'i5sing/cache/data.json'), JSON.stringify([...this.cache]));
    }

    private scheduleSync() {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => this.sync(), 60000);
    }
}
