import { GoogleGenAI, Type } from "@google/genai";
import type { LLMProvider, JSONSchemaObject } from "./types";
import { validateGenerativeUIResponse } from "./validate";

/**
 * Recursively translates a plain JSON Schema fragment (as produced by
 * `assembleResponseSchema`) into `@google/genai`'s `Type`-enum tree.
 *
 * Gemini's `Type` doesn't have native enum support the same way plain JSON
 * Schema does, so `enum` values are folded into the field's `description`
 * text instead — this matches the prose-only pattern the pre-migration
 * `server.ts` already used for `componentType`'s description.
 */
export function jsonSchemaToGeminiType(schema: JSONSchemaObject): unknown {
  const type = schema.type as string | undefined;
  const description = schema.description as string | undefined;
  const enumValues = schema.enum as unknown[] | undefined;

  const withEnumDescription = (desc?: string): string | undefined => {
    if (!enumValues) return desc;
    const enumText = `Valores permitidos: ${enumValues.map((v) => JSON.stringify(v)).join(", ")}.`;
    return desc ? `${desc} ${enumText}` : enumText;
  };

  switch (type) {
    case "object": {
      const properties = (schema.properties as Record<string, JSONSchemaObject>) ?? {};
      const required = schema.required as string[] | undefined;
      const geminiProperties: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(properties)) {
        geminiProperties[key] = jsonSchemaToGeminiType(value);
      }
      return {
        type: Type.OBJECT,
        properties: geminiProperties,
        ...(required ? { required } : {}),
        ...(description ? { description } : {}),
      };
    }
    case "array": {
      const items = schema.items as JSONSchemaObject | undefined;
      return {
        type: Type.ARRAY,
        items: items ? jsonSchemaToGeminiType(items) : { type: Type.STRING },
        ...(description ? { description } : {}),
      };
    }
    case "number":
    case "integer":
      return {
        type: Type.NUMBER,
        ...(description ? { description: withEnumDescription(description) } : {}),
      };
    case "string":
    default:
      return {
        type: Type.STRING,
        ...(withEnumDescription(description) ? { description: withEnumDescription(description) } : {}),
      };
  }
}

export function createGeminiProvider(): LLMProvider {
  // Module-load-time client init, ported verbatim from the previous
  // `server.ts` — same eager-init lifecycle position (constructed once,
  // reused for every request).
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  return {
    name: "gemini",
    async generateStructuredUI({ prompt, systemInstruction, schema }) {
      const response = await ai.models.generateContent({
        // Pre-existing model string carried forward unchanged from the
        // previous `server.ts` implementation — not verified/updated as
        // part of this change, explicitly out of scope.
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: jsonSchemaToGeminiType(schema),
        },
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Empty response from Gemini model.");
      }

      const parsed = JSON.parse(resultText);
      return validateGenerativeUIResponse(parsed);
    },
  };
}
