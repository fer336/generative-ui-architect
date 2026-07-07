import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { getProvider } from "./src/providers";
import { validateGenerativeUIResponse } from "./src/providers/validate";
import { componentRegistry } from "./src/registry/componentRegistry";
import { assembleResponseSchema, buildSystemInstruction } from "./src/registry/schema";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Select and validate the active LLM provider on the server side. A throw
// here (invalid/unset LLM_PROVIDER, missing API key) happens synchronously
// at module load time, before `startServer()`/`app.listen()` runs below —
// same eager-init lifecycle position as the previous Gemini-only client.
const provider = getProvider();

const systemInstruction = buildSystemInstruction(componentRegistry);
const schema = assembleResponseSchema(componentRegistry);

// Server-side API endpoint for Generative UI Simulation
app.post("/api/generative-ui", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "El prompt es requerido." });
  }

  try {
    const rawResponse = await provider.generateStructuredUI({
      prompt,
      systemInstruction,
      schema,
    });
    const parsedResponse = validateGenerativeUIResponse(rawResponse);
    res.json(parsedResponse);
  } catch (error: any) {
    console.error(`Error generating UI from ${provider.name}:`, error);
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
