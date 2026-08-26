type CacheEntry<T> = { value: T; expiresAt: number };

export class TtlCache<K, V> {
    private readonly entries = new Map<K, CacheEntry<V>>();

    constructor(
        private readonly ttlMs: number,
        private readonly maxEntries: number,
        private readonly now: () => number = Date.now,
    ) {}

    get(key: K): V | undefined {
        const entry = this.entries.get(key);
        if (!entry) return undefined;
        if (entry.expiresAt <= this.now()) {
            this.entries.delete(key);
            return undefined;
        }
        return entry.value;
    }

    set(key: K, value: V) {
        this.deleteExpired();
        this.entries.delete(key);
        while (this.entries.size >= this.maxEntries) {
            const oldestKey = this.entries.keys().next().value as K | undefined;
            if (oldestKey === undefined) break;
            this.entries.delete(oldestKey);
        }
        this.entries.set(key, { value, expiresAt: this.now() + this.ttlMs });
    }

    clear() {
        this.entries.clear();
    }

    private deleteExpired() {
        const now = this.now();
        for (const [key, entry] of this.entries) {
            if (entry.expiresAt <= now) this.entries.delete(key);
        }
    }
}
