export class Cache {
  private store: Map<string, { data: any; expires: number }> = new Map();

  constructor(private ttl: number) {
    this.startCleanup();
  }

  set<T>(key: string, value: T): void {
    this.store.set(key, {
      data: value,
      expires: Date.now() + this.ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.store.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expires) {
      this.store.delete(key);
      return null;
    }

    return item.data as T;
  }

  private startCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.store.entries()) {
        if (now > value.expires) {
          this.store.delete(key);
        }
      }
    }, Math.min(this.ttl, 60000)); // Cleanup every minute or TTL, whichever is smaller
  }

  clear(): void {
    this.store.clear();
  }
}