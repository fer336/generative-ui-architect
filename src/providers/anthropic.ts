import Anthropic from "@anthropic-ai/sdk";
import type { LLMProvider } from "./types";
import { validateGenerativeUIResponse } from "./validate";

const TOOL_NAME = "emit_generative_ui";

export function createAnthropicProvider(): LLMProvider {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  return {
    name: "anthropic",
    async generateStructuredUI({ prompt, systemInstruction, schema }) {
      const response = await client.messages.create({
        // `claude-sonnet-5` — a well-balanced current model, swappable.
        // Confirmed current at implementation time; verify against
        // current Anthropic docs before relying on it long-term, since
        // model availability changes over time and this default is not
        // env-configurable in this change (see spec: "Hardcoded Default
        // Model Per Adapter").
        model: "claude-sonnet-5",
        max_tokens: 4096,
        system: systemInstruction,
        messages: [{ role: "user", content: prompt }],
        tools: [
          {
            name: TOOL_NAME,
            description:
              "Emits the structured Generative UI response describing which component to render and its data.",
            input_schema: schema as Anthropic.Messages.Tool.InputSchema,
          },
        ],
        tool_choice: { type: "tool", name: TOOL_NAME },
      });

      const toolUseBlock = response.content.find(
        (block): block is Anthropic.Messages.ToolUseBlock => block.type === "tool_use"
      );

      if (!toolUseBlock) {
        throw new Error("Anthropic response did not contain a tool_use block.");
      }

      // `.input` is already a parsed object — no JSON.parse needed, unlike
      // the Gemini/OpenAI adapters which parse a raw JSON string.
      return validateGenerativeUIResponse(toolUseBlock.input);
    },
  };
}
