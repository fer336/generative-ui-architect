import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Server-side API endpoint for Generative UI Simulation
app.post("/api/generative-ui", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "El prompt es requerido." });
  }

  try {
    const systemInstruction = `Eres un motor inteligente de Generative UI. Tu trabajo consiste en recibir una solicitud del usuario (por ejemplo, reporte de finanzas, lista de tareas, alertas, KPIs) y determinar cuál es el componente de interfaz de usuario más adecuado para representarlo y proveer los datos limpios en un formato estructurado.

Tipos de componentes soportados:
1. 'chart': Ideal cuando el usuario pide visualizaciones, tendencias, desglose de gastos, comparación de valores, etc. Debes sugerir la configuración del gráfico (barras, líneas, área, pastel).
2. 'table': Ideal para listas ordenadas con múltiples columnas o datos financieros detallados con etiquetas claras.
3. 'metrics': Ideal para tableros de control con KPIs clave, resúmenes rápidos, balance general, etc.
4. 'alert': Ideal cuando el usuario reporta un problema, pide una evaluación crítica o necesita atención inmediata ante un peligro o éxito de finanzas.
5. 'list': Ideal para listas de tareas, pasos a seguir, recordatorios o descripciones simples.

Reglas para los datos:
- Retorna datos realistas que se ajusten perfectamente a la solicitud del usuario.
- En 'chartConfig', define el tipo correcto de gráfico: 'bar', 'line', 'area' o 'pie'.
- Provee un campo de explicación claro, explicando amigablemente por qué elegiste esta representación y un resumen rápido de los datos presentados.
- Las etiquetas de los items deben ser claras y cortas. Los valores numéricos deben representar cantidades reales acordes a la solicitud.
- Sugiere colores de Tailwind coherentes en el campo 'color' para cada item de datos (por ejemplo, 'emerald' para ganancias, 'rose' para gastos elevados, 'sky' para tecnología, 'amber' para advertencias).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            componentType: {
              type: Type.STRING,
              description: "The UI component type to render: 'chart', 'table', 'metrics', 'alert', or 'list'",
            },
            explanation: {
              type: Type.STRING,
              description: "A friendly, conversational explanation of why this component was chosen and a brief summary of the insights.",
            },
            title: {
              type: Type.STRING,
              description: "An elegant, descriptive title for the generated component.",
            },
            chartConfig: {
              type: Type.OBJECT,
              properties: {
                type: { 
                  type: Type.STRING, 
                  description: "The visual style of the chart: 'bar', 'line', 'pie', or 'area'" 
                },
                xAxisKey: { type: Type.STRING, description: "Name of the key used for the X-axis (usually 'label')" },
                yAxisKey: { type: Type.STRING, description: "Name of the key used for the Y-axis (usually 'value')" },
              },
              description: "Required configuration if componentType is 'chart'",
            },
            data: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "The label or categories name (e.g. 'Comida', 'Alquiler', 'Enero')" },
                  value: { type: Type.NUMBER, description: "The primary numeric value (e.g. 1500, 350)" },
                  secondaryValue: { type: Type.STRING, description: "An optional secondary text, state, or currency format (e.g. '$1,500.00', 'Completo', 'Alta')" },
                  color: { type: Type.STRING, description: "Suggested Tailwind color base name: 'emerald', 'sky', 'rose', 'amber', 'indigo', 'violet', 'orange'" }
                },
                required: ["label", "value"]
              },
              description: "The dataset to populate the UI element.",
            },
            alertConfig: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING, description: "The status indicator: 'success', 'warning', 'info', or 'error'" },
                actionLabel: { type: Type.STRING, description: "The button or link text for a suggested primary call to action" }
              },
              description: "Required configuration if componentType is 'alert'",
            }
          },
          required: ["componentType", "explanation", "title", "data"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini model.");
    }

    const parsedResponse = JSON.parse(resultText);
    res.json(parsedResponse);
  } catch (error: any) {
    console.error("Error generating UI from Gemini:", error);
    res.status(500).json({ 
      error: "Ocurrió un error al procesar tu solicitud interactiva.", 
      details: error.message 
    });
  }
});

// Configure Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static file serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
  });
}

startServer();
