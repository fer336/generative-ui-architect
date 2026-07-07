import type { GenerativeUIResponse } from "../types";

/**
 * Validates and narrows a raw, provider-returned value into a
 * `GenerativeUIResponse`. Every adapter (Gemini, OpenAI, Anthropic) MUST
 * route its parsed output through this function before `server.ts` responds
 * to the client.
 *
 * This guards against provider response-strictness divergence: OpenAI's
 * `strict: true` structured outputs guarantee schema conformance, but
 * Gemini's `responseSchema` and Anthropic's forced tool-use are best-effort
 * — a malformed or partially-empty response must never reach the client
 * silently.
 *
 * Throws a descriptive `Error` (not a silent empty/malformed response) on
 * any validation failure.
 */
export function validateGenerativeUIResponse(raw: unknown): GenerativeUIResponse {
  if (typeof raw !== "object" || raw === null) {
    throw new Error(
      `Invalid provider response: expected an object, got ${raw === null ? "null" : typeof raw}.`
    );
  }

  const value = raw as Record<string, unknown>;

  if (typeof value.componentType !== "string" || value.componentType.length === 0) {
    throw new Error(
      `Invalid provider response: "componentType" must be a non-empty string, got ${JSON.stringify(value.componentType)}.`
    );
  }

  if (typeof value.explanation !== "string") {
    throw new Error(
      `Invalid provider response: "explanation" must be a string, got ${typeof value.explanation}.`
    );
  }

  if (typeof value.title !== "string") {
    throw new Error(
      `Invalid provider response: "title" must be a string, got ${typeof value.title}.`
    );
  }

  if (!Array.isArray(value.data)) {
    throw new Error(
      `Invalid provider response: "data" must be an array, got ${typeof value.data}.`
    );
  }

  return value as unknown as GenerativeUIResponse;
}
