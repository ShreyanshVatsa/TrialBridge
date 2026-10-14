import type { AiProviderConfig } from "@/config/ai-providers";
import { ProviderError, type AiProvider, type CompletionRequest } from "./types";

const TIMEOUT_MS = 30_000;

/** One OpenAI-compatible chat-completions client used for every real provider. */
export function createOpenAiCompatibleProvider(config: AiProviderConfig, apiKey: string, fetchImpl: typeof fetch = fetch): AiProvider {
  return {
    name: config.name,
    isMock: false,
    maxInputChars: config.maxInputChars,
    async complete(req: CompletionRequest): Promise<string> {
      const timeout = AbortSignal.timeout(TIMEOUT_MS);
      const signal = req.signal ? AbortSignal.any([req.signal, timeout]) : timeout;
      let res: Response;
      try {
        res = await fetchImpl(`${config.baseUrl}/chat/completions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: config.model,
            messages: req.messages,
            temperature: 0.1,
            max_tokens: req.maxTokens ?? 6000,
            response_format: { type: "json_object" },
            ...(req.reasoningEffort ? { reasoning_effort: req.reasoningEffort } : {}),
          }),
          signal,
        });
      } catch {
        throw new ProviderError(timeout.aborted ? "timeout" : "network", `${config.name}: request failed`);
      }
      if (res.status === 429) throw new ProviderError("rate_limited", `${config.name}: 429`);
      if (res.status >= 500) throw new ProviderError("server", `${config.name}: ${res.status}`);
      if (!res.ok) throw new ProviderError("client", `${config.name}: ${res.status}`);
      let data: { choices?: { message?: { content?: string } }[] };
      try {
        data = (await res.json()) as typeof data;
      } catch {
        throw new ProviderError("invalid_output", `${config.name}: non-JSON response`);
      }
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new ProviderError("invalid_output", `${config.name}: empty completion`);
      return content;
    },
  };
}
