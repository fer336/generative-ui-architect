import { componentRegistry } from "./componentRegistry";
import type { JSONSchemaObject, ComponentRegistryEntry } from "./componentRegistry";

/**
 * Assembles the single provider-agnostic JSON Schema shared by every
 * `LLMProvider` adapter. This is plain JSON Schema — NOT Gemini's
 * `Type`-enum tree. The Gemini adapter is responsible for translating this
 * into its own `Type` tree at its own boundary
 * (`src/providers/gemini.ts#jsonSchemaToGeminiType`).
 *
 * The output is authored to satisfy OpenAI's `strict: true` Structured
 * Outputs requirements directly (every property in `required`,
 * `additionalProperties: false` at every level) so it can be passed
 * unmodified to all 3 provider adapters. Wired into `server.ts` as of the
 * provider-adapter slice.
 */
export function assembleResponseSchema(
  registry: Record<string, ComponentRegistryEntry> = componentRegistry
): JSONSchemaObject {
  const properties: Record<string, unknown> = {
    componentType: {
      type: "string",
      enum: Object.keys(registry),
      description: "The UI component type to render.",
    },
    explanation: {
      type: "string",
      description:
        "A friendly, conversational explanation of why this component was chosen and a brief summary of the insights.",
    },
    title: {
      type: "string",
      description: "An elegant, descriptive title for the generated component.",
    },
  };

  // Every top-level key present in `properties` must also appear in
  // `required` for OpenAI's `strict: true` Structured Outputs mode
  // (see `src/providers/openai.ts`). Keys only relevant to some component
  // types (e.g. `chartConfig`, `alertConfig`) are still added to `required`
  // but made nullable via `anyOf: [..., {type: "null"}]` below — a model
  // returns `null` instead of omitting the key when it doesn't apply.
  const required = new Set<string>(["componentType", "explanation", "title"]);
  const nullableConfigKeys = new Set<string>();

  for (const entry of Object.values(registry)) {
    const entryProperties = (entry.schema as { properties?: Record<string, unknown> }).properties;
    if (entryProperties) {
      for (const [key, value] of Object.entries(entryProperties)) {
        properties[key] = value;
        required.add(key);
      }
    }

    if (entry.configKey && entry.configSchema) {
      properties[entry.configKey] = entry.configSchema;
      nullableConfigKeys.add(entry.configKey);
    }
  }

  for (const key of nullableConfigKeys) {
    required.add(key);
    properties[key] = {
      anyOf: [properties[key], { type: "null" }],
    };
  }

  return {
    type: "object",
    properties,
    required: Array.from(required),
    additionalProperties: false,
  };
}

/**
 * Builds the Spanish system-instruction prose, keeping the existing
 * boilerplate/rules from `server.ts` but generating the per-type
 * descriptions from each registry entry's `promptDescription`.
 */
export function buildSystemInstruction(
  registry: Record<string, ComponentRegistryEntry> = componentRegistry
): string {
  const typeDescriptions = Object.values(registry)
    .map((entry, idx) => `${idx + 1}. ${entry.promptDescription}`)
    .join("\n");

  return `Eres un motor inteligente de Generative UI. Tu trabajo consiste en recibir una solicitud del usuario (por ejemplo, reporte de finanzas, lista de tareas, alertas, KPIs) y determinar cuál es el componente de interfaz de usuario más adecuado para representarlo y proveer los datos limpios en un formato estructurado.

Tipos de componentes soportados:
${typeDescriptions}

Reglas para los datos:
- Retorna datos realistas que se ajusten perfectamente a la solicitud del usuario.
- En 'chartConfig', define el tipo correcto de gráfico: 'bar', 'line', 'area' o 'pie'.
- Provee un campo de explicación claro, explicando amigablemente por qué elegiste esta representación y un resumen rápido de los datos presentados.
- Las etiquetas de los items deben ser claras y cortas. Los valores numéricos deben representar cantidades reales acordes a la solicitud.
- Sugiere colores de Tailwind coherentes en el campo 'color' para cada item de datos (por ejemplo, 'emerald' para ganancias, 'rose' para gastos elevados, 'sky' para tecnología, 'amber' para advertencias).`;
}
