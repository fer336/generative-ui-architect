import { GenerativeUIResponse } from "./types";

/**
 * Canned/mock responses for the static GitHub Pages demo (VITE_STATIC_DEMO=true).
 *
 * GitHub Pages only serves static files, so there is no server to call Gemini
 * on. These responses mirror the shape and quality of what `server.ts`'s
 * system instruction asks Gemini to produce for the app's preset prompts,
 * so the static demo can still showcase every componentType the app
 * supports (chart, list, alert, metrics, table) without a live backend.
 */

const EXPENSES_CHART: GenerativeUIResponse = {
  componentType: "chart",
  title: "Gastos de este mes",
  explanation:
    "Elegí un gráfico circular porque tu solicitud pide comparar el peso relativo de cada categoría de gasto dentro del total del mes. El alquiler concentra la mayor parte del presupuesto, seguido de comida y servicios.",
  chartConfig: {
    type: "pie",
    xAxisKey: "label",
    yAxisKey: "value",
  },
  data: [
    { label: "Alquiler", value: 1200, secondaryValue: "$1,200.00", color: "indigo" },
    { label: "Comida", value: 450, secondaryValue: "$450.00", color: "emerald" },
    { label: "Transporte", value: 150, secondaryValue: "$150.00", color: "sky" },
    { label: "Entretenimiento", value: 200, secondaryValue: "$200.00", color: "violet" },
    { label: "Servicios", value: 300, secondaryValue: "$300.00", color: "amber" },
  ],
};

const FINANCIAL_TASKS_LIST: GenerativeUIResponse = {
  componentType: "list",
  title: "Tareas para cerrar el mes financiero",
  explanation:
    "Elegí una lista de verificación porque pediste los pasos pendientes para cerrar el mes. Prioricé las tareas por urgencia, desde la conciliación bancaria hasta el envío del reporte final.",
  data: [
    { label: "Conciliar cuentas bancarias", value: 1, secondaryValue: "Pendiente", color: "rose" },
    { label: "Revisar facturas de proveedores", value: 2, secondaryValue: "En progreso", color: "amber" },
    { label: "Aprobar reembolsos de gastos", value: 3, secondaryValue: "Pendiente", color: "amber" },
    { label: "Cerrar libro mayor del mes", value: 4, secondaryValue: "Pendiente", color: "rose" },
    { label: "Enviar reporte financiero a dirección", value: 5, secondaryValue: "No iniciado", color: "indigo" },
  ],
};

const BUDGET_ALERT: GenerativeUIResponse = {
  componentType: "alert",
  title: "Sobregiro crítico en marketing",
  explanation:
    "Elegí una alerta crítica porque reportaste un sobregiro de presupuesto, una situación que requiere atención inmediata. El monto excede el límite asignado en 1,500 USD.",
  alertConfig: {
    status: "error",
    actionLabel: "Revisar presupuesto de marketing",
  },
  data: [
    { label: "Presupuesto asignado", value: 8000, secondaryValue: "$8,000.00", color: "sky" },
    { label: "Gasto actual", value: 9500, secondaryValue: "$9,500.00", color: "rose" },
    { label: "Sobregiro", value: 1500, secondaryValue: "$1,500.00", color: "rose" },
  ],
};

const SALES_KPIS_METRICS: GenerativeUIResponse = {
  componentType: "metrics",
  title: "KPIs de ventas — Q2",
  explanation:
    "Elegí un tablero de métricas porque pediste indicadores clave de rendimiento. Resumí los KPIs más relevantes del trimestre: ingresos totales, nuevos clientes, ticket promedio y tasa de conversión.",
  data: [
    { label: "Ingresos totales", value: 245000, secondaryValue: "$245,000.00", color: "emerald" },
    { label: "Nuevos clientes", value: 312, secondaryValue: "+18% vs Q1", color: "sky" },
    { label: "Ticket promedio", value: 785, secondaryValue: "$785.00", color: "indigo" },
    { label: "Tasa de conversión", value: 4, secondaryValue: "4.2%", color: "amber" },
  ],
};

const ACCOUNT_BALANCES_TABLE: GenerativeUIResponse = {
  componentType: "table",
  title: "Detalle de saldos bancarios",
  explanation:
    "Elegí una tabla detallada porque pediste un desglose de saldos por cuenta corporativa. Cada fila representa una cuenta con su saldo actual y estado.",
  data: [
    { label: "Cuenta Operativa Principal", value: 542300, secondaryValue: "$542,300.00", color: "emerald" },
    { label: "Cuenta de Nómina", value: 128900, secondaryValue: "$128,900.00", color: "sky" },
    { label: "Cuenta de Reserva", value: 890000, secondaryValue: "$890,000.00", color: "indigo" },
    { label: "Cuenta de Impuestos", value: 76500, secondaryValue: "$76,500.00", color: "amber" },
  ],
};

const GENERIC_FALLBACK_LIST: GenerativeUIResponse = {
  componentType: "list",
  title: "Resultado de ejemplo (demo estática)",
  explanation:
    "Esta es una demo estática sin conexión a Gemini, así que no puedo interpretar libremente tu consulta. Te muestro una lista de ejemplo para ilustrar cómo se vería un componente generado dinámicamente — probá alguno de los presets para ver otros tipos de componente (gráfico, tabla, métricas, alerta).",
  data: [
    { label: "Este es un dato de muestra", value: 1, secondaryValue: "Demo", color: "indigo" },
    { label: "Otro dato de ejemplo", value: 2, secondaryValue: "Demo", color: "sky" },
    { label: "Probá uno de los presets de arriba", value: 3, secondaryValue: "Sugerido", color: "emerald" },
  ],
};

/**
 * Maps the app's 5 preset prompts (see `presets` in `src/App.tsx`) to a
 * matching canned response, with a generic list fallback for any free-text
 * prompt that doesn't match a preset.
 */
export function getMockResponse(prompt: string): GenerativeUIResponse {
  const normalized = prompt.trim().toLowerCase();

  if (normalized.includes("gastos de este mes") || normalized.includes("gráfico circular")) {
    return EXPENSES_CHART;
  }

  if (normalized.includes("tareas") && normalized.includes("financier")) {
    return FINANCIAL_TASKS_LIST;
  }

  if (normalized.includes("sobregiro") || normalized.includes("alerta")) {
    return BUDGET_ALERT;
  }

  if (normalized.includes("kpi") || normalized.includes("indicadores clave")) {
    return SALES_KPIS_METRICS;
  }

  if (normalized.includes("saldos") || normalized.includes("cuentas corporativas")) {
    return ACCOUNT_BALANCES_TABLE;
  }

  return GENERIC_FALLBACK_LIST;
}
