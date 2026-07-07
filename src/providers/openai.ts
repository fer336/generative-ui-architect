import OpenAI from "openai";
import type { LLMProvider } from "./types";
import { validateGenerativeUIResponse } from "./validate";

export function createOpenAIProvider(): LLMProvider {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  return {
    name: "openai",
    async generateStructuredUI({ prompt, systemInstruction, schema }) {
      const response = await client.chat.completions.create({
        // `gpt-4o-2024-08-06` is the first OpenAI model documented to
        // support Structured Outputs with `strict: true` and remains a
        // well-established, stable identifier. Verify this against
        // current OpenAI docs before relying on it in production — model
        // availability/names change over time and this default is not
        // env-configurable in this change (see spec: "Hardcoded Default
        // Model Per Adapter").
        model: "gpt-4o-2024-08-06",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "generative_ui_response",
            schema,
            strict: true,
          },
        },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from OpenAI model.");
      }

      const parsed = JSON.parse(content);
      return validateGenerativeUIResponse(parsed);
    },
  };
}
