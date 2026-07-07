import type { LLMProvider } from "./types";
import { createGeminiProvider } from "./gemini";
import { createOpenAIProvider } from "./openai";
import { createAnthropicProvider } from "./anthropic";

type ProviderName = "gemini" | "openai" | "anthropic";

const VALID_PROVIDERS: readonly ProviderName[] = ["gemini", "openai", "anthropic"];

const API_KEY_ENV_VAR: Record<ProviderName, string> = {
  gemini: "GEMINI_API_KEY",
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
};

function isValidProviderName(value: string | undefined): value is ProviderName {
  return VALID_PROVIDERS.includes(value as ProviderName);
}

/**
 * Reads `LLM_PROVIDER` from the environment and constructs the matching
 * `LLMProvider` adapter. No default — unset or invalid values fail fast.
 *
 * Must be callable synchronously so a throw here happens at module load
 * time in `server.ts` (`const provider = getProvider();` at the top
 * level), crashing the process before `startServer()` / `app.listen()`
 * ever runs.
 */
export function getProvider(): LLMProvider {
  const value = process.env.LLM_PROVIDER;

  if (!isValidProviderName(value)) {
    throw new Error(
      `Invalid LLM_PROVIDER "${value}". Valid values: gemini, openai, anthropic.`
    );
  }

  const envVarName = API_KEY_ENV_VAR[value];
  if (!process.env[envVarName]) {
    throw new Error(`Missing API key for provider "${value}". Set ${envVarName}.`);
  }

  switch (value) {
    case "gemini":
      return createGeminiProvider();
    case "openai":
      return createOpenAIProvider();
    case "anthropic":
      return createAnthropicProvider();
  }
}
