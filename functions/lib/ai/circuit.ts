/**
 * Per-provider circuit breaker. After `threshold` consecutive failures the circuit opens and the
 * provider is skipped for `cooldownMs`; then one trial request is allowed (half-open). A success
 * closes it again. State is per Worker isolate (best effort, no storage writes).
 */
export class CircuitBreaker {
  private failures = 0;
  private openedAt: number | null = null;

  constructor(
    private readonly threshold = 3,
    private readonly cooldownMs = 60_000,
    private readonly clock: () => number = () => Date.now(),
  ) {}

  canRequest(): boolean {
    if (this.openedAt === null) return true;
    return this.clock() - this.openedAt >= this.cooldownMs; // half-open after cooldown
  }

  recordSuccess(): void {
    this.failures = 0;
    this.openedAt = null;
  }

  recordFailure(): void {
    this.failures++;
    if (this.failures >= this.threshold) this.openedAt = this.clock();
  }

  get state(): "closed" | "open" | "half-open" {
    if (this.openedAt === null) return "closed";
    return this.canRequest() ? "half-open" : "open";
  }
}

const breakers = new Map<string, CircuitBreaker>();
export function breakerFor(name: string): CircuitBreaker {
  let b = breakers.get(name);
  if (!b) {
    b = new CircuitBreaker();
    breakers.set(name, b);
  }
  return b;
}
export function resetBreakersForTests(): void {
  breakers.clear();
}
