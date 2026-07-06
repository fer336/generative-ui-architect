import React, { useState } from "react";
import { motion } from "motion/react";
import { Layers, HelpCircle, ArrowRight, Shield, Code, Server, Cpu, Layers3 } from "lucide-react";
import { ArchNode } from "../types";

export default function ArchTab() {
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>({
    id: "client-ui",
    name: "1. Cliente Frontend (React)",
    tech: "React 19, Tailwind CSS",
    description: "Captura el prompt del usuario en lenguaje natural y mantiene el estado conversacional. Cuenta con un motor de renderizado de componentes modulares del Sistema de Diseño que espera un esquema JSON válido.",
    flowStep: 1
  });

  const nodes: ArchNode[] = [
    {
      id: "client-ui",
      name: "1. Cliente Frontend (React)",
      tech: "React 19, Tailwind CSS",
      description: "Captura el prompt del usuario en lenguaje natural y mantiene el estado conversacional. Cuenta con un motor de renderizado de componentes modulares del Sistema de Diseño que espera un esquema JSON válido.",
      flowStep: 1
    },
    {
      id: "api-gateway",
      name: "2. Servidor Backend & API",
      tech: "Node.js, Express, Zod",
      description: "Actúa como intermediario seguro para no exponer las credenciales en el navegador. Recibe la consulta del usuario, le adjunta las directrices del sistema de diseño (System Instructions) y gestiona la llamada hacia el modelo.",
      flowStep: 2
    },
    {
      id: "llm-orchestrator",
      name: "3. Motor de Inteligencia Artificial",
      tech: "Gemini 3.5 Flash",
      description: "Recibe la consulta del usuario junto con las instrucciones del sistema. Evalúa las variables y los datos para clasificar el tipo de componente más adecuado. Retorna un objeto JSON estructurado que respeta exactamente el esquema (responseSchema).",
      flowStep: 3
    },
    {
      id: "dynamic-renderer",
      name: "4. Renderizador Dinámico",
      tech: "Dynamic Component Map",
      description: "El componente cliente 'DynamicRenderer' recibe el JSON validado. Busca el tipo en el mapeo (chart, table, metrics, alert, list) y dibuja el widget de forma reactiva e interactiva utilizando animaciones fluidas.",
      flowStep: 4
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="max-w-2xl">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1">
            Arquitectura de Flujo de Datos en Generative UI
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Haz clic sobre los diferentes bloques del diagrama interactivo SVG para inspeccionar sus responsabilidades técnicas, tecnologías sugeridas y cómo fluye la información de extremo a extremo.
          </p>
        </div>
        <span className="shrink-0 bg-indigo-50 text-indigo-700 text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider">
          Flujo de Datos Asíncrono
        </span>
      </div>

      {/* SVG Interactive Architecture Diagram */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center justify-center relative min-h-[300px]">
        <svg viewBox="0 0 760 260" className="w-full max-w-3xl h-auto overflow-visible">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
            </marker>
            <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <dropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Connective arrows */}
          {/* Node 1 to 2 */}
          <path d="M 170 110 L 220 110" stroke="#4f46e5" strokeWidth="2.5" markerEnd="url(#arrow)" fill="none" />
          <text x="195" y="100" textAnchor="middle" className="text-[10px] font-bold font-mono fill-indigo-400">POST</text>

          {/* Node 2 to 3 */}
          <path d="M 360 110 L 410 110" stroke="#4f46e5" strokeWidth="2.5" markerEnd="url(#arrow)" fill="none" />
          <text x="385" y="100" textAnchor="middle" className="text-[10px] font-bold font-mono fill-indigo-400">SDK</text>

          {/* Node 3 to 2 (Return) */}
          <path d="M 410 130 L 360 130" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#arrow)" fill="none" />
          <text x="385" y="145" textAnchor="middle" className="text-[10px] font-bold font-mono fill-emerald-400">JSON</text>

          {/* Node 2 to 4 (Dynamic UI response to Client) */}
          <path d="M 290 160 C 290 220, 490 220, 560 160" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrow)" fill="none" />
          <text x="425" y="215" textAnchor="middle" className="text-[10px] font-bold font-mono fill-emerald-400">Dynamic UI Response</text>

          {/* Node 1: Client Front */}
          <g 
            className="cursor-pointer group select-none"
            onClick={() => setSelectedNode(nodes[0])}
          >
            <rect 
              x="20" y="55" width="150" height="110" rx="16" 
              fill={selectedNode?.id === "client-ui" ? "#1e1b4b" : "#1e293b"} 
              stroke={selectedNode?.id === "client-ui" ? "#6366f1" : "#334155"} 
              strokeWidth={selectedNode?.id === "client-ui" ? "3" : "1.5"}
              filter="url(#shadow)"
              className="transition-all"
            />
            <text x="95" y="90" textAnchor="middle" className="text-xs font-extrabold fill-slate-200">1. CLIENTE UI</text>
            <text x="95" y="110" textAnchor="middle" className="text-[10px] font-bold font-mono fill-indigo-400">React Frontend</text>
            <text x="95" y="130" textAnchor="middle" className="text-[9px] fill-slate-400">Entrada e Historial</text>
            {selectedNode?.id === "client-ui" && <circle cx="95" cy="148" r="3" fill="#6366f1" />}
          </g>

          {/* Node 2: Express Backend */}
          <g 
            className="cursor-pointer group select-none"
            onClick={() => setSelectedNode(nodes[1])}
          >
            <rect 
              x="210" y="55" width="150" height="110" rx="16" 
              fill={selectedNode?.id === "api-gateway" ? "#1e1b4b" : "#1e293b"} 
              stroke={selectedNode?.id === "api-gateway" ? "#6366f1" : "#334155"} 
              strokeWidth={selectedNode?.id === "api-gateway" ? "3" : "1.5"}
              filter="url(#shadow)"
              className="transition-all"
            />
            <text x="285" y="90" textAnchor="middle" className="text-xs font-extrabold fill-slate-200">2. BACKEND API</text>
            <text x="285" y="110" textAnchor="middle" className="text-[10px] font-bold font-mono fill-indigo-400">Express & Server</text>
            <text x="285" y="130" textAnchor="middle" className="text-[9px] fill-slate-400">Validación y Rutas</text>
            {selectedNode?.id === "api-gateway" && <circle cx="285" cy="148" r="3" fill="#6366f1" />}
          </g>

          {/* Node 3: Gemini Model */}
          <g 
            className="cursor-pointer group select-none"
            onClick={() => setSelectedNode(nodes[2])}
          >
            <rect 
              x="400" y="55" width="150" height="110" rx="16" 
              fill={selectedNode?.id === "llm-orchestrator" ? "#1e1b4b" : "#1e293b"} 
              stroke={selectedNode?.id === "llm-orchestrator" ? "#6366f1" : "#334155"} 
              strokeWidth={selectedNode?.id === "llm-orchestrator" ? "3" : "1.5"}
              filter="url(#shadow)"
              className="transition-all"
            />
            <text x="475" y="90" textAnchor="middle" className="text-xs font-extrabold fill-slate-200">3. MODELO IA</text>
            <text x="475" y="110" textAnchor="middle" className="text-[10px] font-bold font-mono fill-indigo-400">Gemini 3.5 Flash</text>
            <text x="475" y="130" textAnchor="middle" className="text-[9px] fill-slate-400">Estructuración JSON</text>
            {selectedNode?.id === "llm-orchestrator" && <circle cx="475" cy="148" r="3" fill="#6366f1" />}
          </g>

          {/* Node 4: Dynamic Renderer */}
          <g 
            className="cursor-pointer group select-none"
            onClick={() => setSelectedNode(nodes[3])}
          >
            <rect 
              x="590" y="55" width="150" height="110" rx="16" 
              fill={selectedNode?.id === "dynamic-renderer" ? "#1e1b4b" : "#1e293b"} 
              stroke={selectedNode?.id === "dynamic-renderer" ? "#6366f1" : "#334155"} 
              strokeWidth={selectedNode?.id === "dynamic-renderer" ? "3" : "1.5"}
              filter="url(#shadow)"
              className="transition-all"
            />
            <text x="665" y="90" textAnchor="middle" className="text-xs font-extrabold fill-slate-200">4. RENDERIZADO</text>
            <text x="665" y="110" textAnchor="middle" className="text-[10px] font-bold font-mono fill-emerald-400">Dynamic Renderer</text>
            <text x="665" y="130" textAnchor="middle" className="text-[9px] fill-slate-400">Mapeo del Widget</text>
            {selectedNode?.id === "dynamic-renderer" && <circle cx="665" cy="148" r="3" fill="#6366f1" />}
          </g>
        </svg>

        {/* Floating tooltip hint */}
        <span className="absolute bottom-3 text-[10px] text-slate-400 tracking-wider uppercase font-mono font-bold animate-pulse">
          💡 Haz clic en los rectángulos para inspeccionar cada capa técnica
        </span>
      </div>

      {/* Selected Node Detailed Explanation Card */}
      {selectedNode && (
        <motion.div
          key={selectedNode.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-indigo-600/[0.02] border border-indigo-100 flex flex-col md:flex-row gap-5"
        >
          {/* Step badge */}
          <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white font-mono font-extrabold text-lg shadow-md shadow-indigo-100">
            {selectedNode.flowStep}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-extrabold text-slate-800">
                {selectedNode.name}
              </h4>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md">
                Tecnología: {selectedNode.tech}
              </span>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {selectedNode.description}
            </p>

            {/* Architectural Security Check for production design */}
            <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-indigo-500" /> Nota de Diseño Seguro: Se valida el JSON antes de inyectar datos en el componente para prevenir XSS.
            </div>
          </div>
        </motion.div>
      )}

      {/* Step by Step Flow Explanation */}
      <div className="pt-4 space-y-4">
        <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Code className="w-4 h-4 text-indigo-500" /> Flujo Técnico del Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed font-sans">
          <div className="p-4 rounded-xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-800 block">Paso 1: Traducción a Esquema</span>
            El servidor Express configura el parámetro `responseSchema` de Gemini. Esto obliga al LLM a devolver un JSON con un formato predecible (por ejemplo, con campos obligatorios como `componentType`, `title`, y `data`).
          </div>
          <div className="p-4 rounded-xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-800 block">Paso 2: Interpretación del Frontend</span>
            El Frontend lee el campo `componentType`. Si es `'chart'`, utiliza componentes SVG dinámicos. Si es `'alert'`, utiliza estilos con colores críticos de alerta. Esto protege la interfaz de desbordamientos visuales o errores de compilación.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
