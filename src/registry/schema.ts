import { componentRegistry } from "./componentRegistry";
import type { JSONSchemaObject, ComponentRegistryEntry } from "./componentRegistry";

/**
 * Assembles the single provider-agnostic JSON Schema shared by every
 * `LLMProvider` adapter. This is plain JSON Schema — NOT Gemini's
 * `Type`-enum tree. The Gemini adapter (a later slice) is responsible for
 * translating this into its own `Type` tree at its own boundary.
 *
 * Not wired into `server.ts` yet in this slice — built but unused until
 * the provider-adapter slice lands.
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

  for (const entry of Object.values(registry)) {
    const entryProperties = (entry.schema as { properties?: Record<string, unknown> }).properties;
    if (entryProperties) {
      Object.assign(properties, entryProperties);
    }

    if (entry.configKey && entry.configSchema) {
      properties[entry.configKey] = entry.configSchema;
    }
  }

  return {
    type: "object",
    properties,
    required: ["componentType", "explanation", "title", "data"],
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
