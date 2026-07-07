import type { GenerativeUIResponse } from "../types";

/**
 * Minimal structural JSON Schema type shared by the component registry
 * (`src/registry/componentRegistry.tsx`, `src/registry/schema.ts`) and every
 * provider adapter under `src/providers/`. This is intentionally plain,
 * provider-agnostic JSON Schema — NOT Gemini's `Type`-enum tree. That
 * translation happens only at the Gemini adapter boundary
 * (`src/providers/gemini.ts`).
 *
 * Canonical home for this type. It previously lived provisionally in
 * `registry/componentRegistry.tsx` (slice 1); that file now imports it
 * from here instead of defining its own copy.
 */
export type JSONSchemaObject = Record<string, unknown>;

/**
 * Common interface implemented by every LLM provider adapter
 * (Gemini, OpenAI, Anthropic). `server.ts` depends only on this
 * interface, never on a specific provider's SDK types.
 */
export interface LLMProvider {
  readonly name: "gemini" | "openai" | "anthropic";
  generateStructuredUI(input: {
    prompt: string;
    systemInstruction: string;
    schema: JSONSchemaObject;
  }): Promise<GenerativeUIResponse>;
}
