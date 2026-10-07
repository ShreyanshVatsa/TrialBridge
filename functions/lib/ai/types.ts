import type { MinimizedProfile } from "@/lib/types/analysis";
import type { ServerTrial } from "../trials";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export type ProviderErrorKind = "rate_limited" | "server" | "timeout" | "network" | "client" | "invalid_output";

/** Typed provider failure; every kind triggers failover to the next provider. */
export class ProviderError extends Error {
  constructor(
    public readonly kind: ProviderErrorKind,
    message: string,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

export interface CompletionRequest {
  messages: ChatMessage[];
  /** Structured context (used by the mock provider; real providers only see `messages`). */
  profile: MinimizedProfile;
  trials: readonly ServerTrial[];
  signal?: AbortSignal;
}

export interface AiProvider {
  name: string;
  /** Mock provider: no budget, never used when a real provider is enabled. */
  isMock: boolean;
  maxInputChars: number;
  /** Returns the raw model text (expected to be JSON). Throws ProviderError on failure. */
  complete(req: CompletionRequest): Promise<string>;
}
