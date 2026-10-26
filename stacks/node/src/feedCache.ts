// The app-cache phase: the serialized feed is kept for 1 second.
//
// Single flight: when the entry expires, the first request starts the reload
// and every request arriving meanwhile awaits that same promise, instead of
// all of them hitting Postgres at once (a cache stampede).
export class FeedCache {
  private entry: { expiresAt: number; value: Promise<string> } | null = null;

  constructor(
    private readonly ttlMs: number,
    private readonly load: () => Promise<string>,
    private readonly onLookup: (hit: boolean) => void = () => {},
  ) {}

  get(): Promise<string> {
    const now = Date.now();
    if (this.entry && this.entry.expiresAt > now) {
      this.onLookup(true);
      return this.entry.value;
    }
    this.onLookup(false);

    const value = this.load();
    const entry = { expiresAt: now + this.ttlMs, value };
    this.entry = entry;
    // A failed load must not be served from cache for the next second.
    value.catch(() => {
      if (this.entry === entry) this.entry = null;
    });
    return value;
  }
}
