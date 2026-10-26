import { ApiError } from "./errors.js";

// Answered when the database queue is full: retry in a moment.
export class Overloaded extends ApiError {
  constructor() {
    super(503, "server busy, retry shortly");
    this.name = "Overloaded";
  }
}

// Load shedding for database work. At most `max` requests may be using or
// waiting for a database connection; the next one is answered 503 at once.
//
// Without it, every request waits in the pool's queue. At the limit, one
// hiccup can queue thousands of them: each holds memory, garbage collection
// grows, and the queue never drains even after the load drops. A short queue
// keeps latency bounded and lets the server recover by itself.
export class ConcurrencyLimit {
  private active = 0;

  constructor(readonly max: number) {}

  get inFlight(): number {
    return this.active;
  }

  async run<T>(work: () => Promise<T>): Promise<T> {
    if (this.active >= this.max) throw new Overloaded();
    this.active++;
    try {
      return await work();
    } finally {
      this.active--;
    }
  }
}
