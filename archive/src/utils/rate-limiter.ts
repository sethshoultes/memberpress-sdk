export class RateLimiter {
  private queue: Array<() => void> = [];
  private running = 0;
  private interval: NodeJS.Timeout;

  constructor(private limit: number) {
    this.interval = setInterval(() => {
      this.running = 0;
      this.processQueue();
    }, 1000); // Reset every second
  }

  async acquire(): Promise<void> {
    if (this.running < this.limit) {
      this.running++;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.queue.push(resolve);
    });
  }

  private processQueue(): void {
    while (this.queue.length > 0 && this.running < this.limit) {
      const next = this.queue.shift();
      if (next) {
        this.running++;
        next();
      }
    }
  }

  destroy(): void {
    clearInterval(this.interval);
  }
}