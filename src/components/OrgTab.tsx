import React, { useState } from "react";
import { motion } from "motion/react";
import { Users, Target, ArrowUpRight, TrendingUp, ShieldCheck, Milestone, ShoppingBag } from "lucide-react";
import { OrgNode } from "../types";

export default function OrgTab() {
  const [selectedRole, setSelectedRole] = useState<OrgNode | null>({
    id: "ceo",
    title: "CEO & Product Manager",
    role: "Liderazgo y Estrategia de Producto",
    description: "Define la visión del producto de Generative UI. Coordina los plazos entre el equipo técnico y de ventas. Asegura que el producto resuelva problemas de fatiga de información reales en la industria (ej. fintech o analíticas de datos).",
    phase: "Fase 1: Concepción y Financiamiento"
  });

  const roles: OrgNode[] = [
    {
      id: "ceo",
      title: "CEO & Product Manager",
      role: "Liderazgo y Estrategia de Producto",
      description: "Define la visión del producto de Generative UI. Coordina los plazos entre el equipo técnico y de ventas. Asegura que el producto resuelva problemas de fatiga de información reales en la industria (ej. fintech o analíticas de datos).",
      phase: "Fase 1: Concepción y Financiamiento"
    },
    {
      id: "ai-lead",
      title: "Director de IA & Prompt Engineer",
      role: "Orquestación del Modelo y Esquemas",
      description: "Encargado de diseñar los System Instructions y estructurar el 'responseSchema' de la IA (Gemini). Optimiza el tiempo de respuesta del modelo y valida la robustez de las respuestas JSON generadas por el LLM.",
      phase: "Fase 2: Prototipado y Validación del Modelo"
    },
    {
      id: "frontend-lead",
      title: "Líder Frontend (Architect)",
      role: "Estructura del Sistema de Diseño",
      description: "Diseña el catálogo de componentes atómicos reactivos (gráficos, métricas, tablas). Crea el motor de mapeo (DynamicRenderer) y asegura el rendimiento de las animaciones y la consistencia en dispositivos móviles.",
      phase: "Fase 3: Desarrollo del Sistema de Diseño"
    },
    {
      id: "qa-security",
      title: "Ingeniero de QA & Ciberseguridad",
      role: "Validación de Esquemas y Pruebas",
      description: "Realiza auditorías de seguridad para prevenir Prompt Injections y ataques de inyección de código (XSS) mediante los payloads de la IA. Diseña los flujos de contingencia (fallbacks) cuando la IA falla.",
      phase: "Fase 4: Pruebas de Estrés y Contingencia"
    },
    {
      id: "sales-marketing",
      title: "Ventas, Marketing & DevRel",
      role: "Comercialización y Puesta en Venta",
      description: "Lidera la fase final de puesta en venta. Crea la documentación para desarrolladores externos (API), diseña planes de suscripción mensual (SaaS) y gestiona la captación de clientes en sectores financieros y empresariales.",
      phase: "Fase 5: Comercialización y Puesta en Venta"
    }
  ];

  const roadmapSteps = [
    { num: "1", title: "Definición del MVP", desc: "Crear un set de 5 componentes básicos (KPI, tabla, gráfico, alerta, lista) y testear prompts consistentes." },
    { num: "2", title: "Validación Técnica", desc: "Asegurar que la latencia de generación sea menor a 1.2 segundos mediante caché inteligente e inferencia optimizada." },
    { num: "3", title: "Estrategia de Precios", desc: "Definir monetización SaaS (Software as a Service) basada en volumen de llamadas API a la interfaz generativa." },
    { num: "4", title: "Lanzamiento & Venta", desc: "Distribución directa a corporativos y publicación del SDK para que otras empresas lo integren en sus plataformas." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="max-w-xl">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1">
            Estructura Organizacional para el Desarrollo (Organigrama)
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            El desarrollo de software impulsado por IA requiere una coordinación estrecha entre especialistas en modelos de lenguaje y desarrolladores frontend. Haz clic en las casillas del organigrama SVG interactivo para explorar las responsabilidades de cada rol.
          </p>
        </div>
        <span className="shrink-0 bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider">
          Roadmap & Org Chart
        </span>
      </div>

      {/* SVG Interactive Organizational Chart */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center justify-center relative min-h-[300px]">
        <svg viewBox="0 0 760 280" className="w-full max-w-3xl h-auto overflow-visible">
          <defs>
            <filter id="shadow-org" x="-10%" y="-10%" width="120%" height="120%">
              <dropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Connective lines */}
          {/* CEO to AI Lead & Frontend Lead (Top down branching) */}
          <path d="M 380 90 L 380 120" stroke="#475569" strokeWidth="2" fill="none" />
          <path d="M 200 120 L 560 120" stroke="#475569" strokeWidth="2" fill="none" />
          
          {/* Branches down */}
          <path d="M 200 120 L 200 155" stroke="#475569" strokeWidth="2" fill="none" />
          <path d="M 380 120 L 380 155" stroke="#475569" strokeWidth="2" fill="none" />
          <path d="M 560 120 L 560 155" stroke="#475569" strokeWidth="2" fill="none" />
          
          {/* Bottom links */}
          <path d="M 200 215 L 200 230" stroke="#475569" strokeWidth="1.5" fill="none" />
          <path d="M 560 215 L 560 230" stroke="#475569" strokeWidth="1.5" fill="none" />

          {/* LEVEL 1: CEO */}
          <g 
            className="cursor-pointer select-none group"
            onClick={() => setSelectedRole(roles[0])}
          >
            <rect 
              x="280" y="20" width="200" height="70" rx="14" 
              fill={selectedRole?.id === "ceo" ? "#065f46" : "#1e293b"} 
              stroke={selectedRole?.id === "ceo" ? "#10b981" : "#334155"} 
              strokeWidth={selectedRole?.id === "ceo" ? "3" : "1.5"}
              filter="url(#shadow-org)"
              className="transition-all"
            />
            <text x="380" y="48" textAnchor="middle" className="text-xs font-extrabold fill-white">CEO & PRODUCT MANAGER</text>
            <text x="380" y="66" textAnchor="middle" className="text-[9px] font-mono fill-emerald-400 font-semibold">Visión & Dirección</text>
            {selectedRole?.id === "ceo" && <circle cx="380" cy="78" r="3" fill="#10b981" />}
          </g>

          {/* LEVEL 2: AI Lead */}
          <g 
            className="cursor-pointer select-none group"
            onClick={() => setSelectedRole(roles[1])}
          >
            <rect 
              x="100" y="155" width="200" height="60" rx="12" 
              fill={selectedRole?.id === "ai-lead" ? "#1e1b4b" : "#1e293b"} 
              stroke={selectedRole?.id === "ai-lead" ? "#6366f1" : "#334155"} 
              strokeWidth={selectedRole?.id === "ai-lead" ? "2.5" : "1.5"}
              filter="url(#shadow-org)"
              className="transition-all"
            />
            <text x="200" y="180" textAnchor="middle" className="text-[10px] font-extrabold fill-slate-200">DIR. INTELIGENCIA ARTIFICIAL</text>
            <text x="200" y="196" textAnchor="middle" className="text-[9px] font-mono fill-indigo-400 font-semibold">System Prompts & Data Schema</text>
            {selectedRole?.id === "ai-lead" && <circle cx="200" cy="206" r="3.5" fill="#6366f1" />}
          </g>

          {/* LEVEL 2: Frontend Lead */}
          <g 
            className="cursor-pointer select-none group"
            onClick={() => setSelectedRole(roles[2])}
          >
            <rect 
              x="280" y="155" width="200" height="60" rx="12" 
              fill={selectedRole?.id === "frontend-lead" ? "#1e1b4b" : "#1e293b"} 
              stroke={selectedRole?.id === "frontend-lead" ? "#6366f1" : "#334155"} 
              strokeWidth={selectedRole?.id === "frontend-lead" ? "2.5" : "1.5"}
              filter="url(#shadow-org)"
              className="transition-all"
            />
            <text x="380" y="180" textAnchor="middle" className="text-[10px] font-extrabold fill-slate-200">LÍDER FRONTEND ARCHITECT</text>
            <text x="380" y="196" textAnchor="middle" className="text-[9px] font-mono fill-indigo-400 font-semibold">Render Map & Design System</text>
            {selectedRole?.id === "frontend-lead" && <circle cx="380" cy="206" r="3.5" fill="#6366f1" />}
          </g>

          {/* LEVEL 2: Marketing & Sales (Puesta en venta) */}
          <g 
            className="cursor-pointer select-none group"
            onClick={() => setSelectedRole(roles[4])}
          >
            <rect 
              x="460" y="155" width="200" height="60" rx="12" 
              fill={selectedRole?.id === "sales-marketing" ? "#0f172a" : "#1e293b"} 
              stroke={selectedRole?.id === "sales-marketing" ? "#e2e8f0" : "#334155"} 
              strokeWidth={selectedRole?.id === "sales-marketing" ? "2.5" : "1.5"}
              filter="url(#shadow-org)"
              className="transition-all"
            />
            <text x="560" y="180" textAnchor="middle" className="text-[10px] font-extrabold fill-slate-200">COMERCIAL & MARKETING (SaaS)</text>
            <text x="560" y="196" textAnchor="middle" className="text-[9px] font-mono fill-slate-400 font-semibold">Puesta en Venta & API Growth</text>
            {selectedRole?.id === "sales-marketing" && <circle cx="560" cy="206" r="3.5" fill="#f8fafc" />}
          </g>

          {/* LEVEL 3: QA & Security (Under AI Lead / Frontend branching) */}
          <g 
            className="cursor-pointer select-none group"
            onClick={() => setSelectedRole(roles[3])}
          >
            <rect 
              x="280" y="232" width="200" height="42" rx="8" 
              fill={selectedRole?.id === "qa-security" ? "#7f1d1d" : "#1e293b"} 
              stroke={selectedRole?.id === "qa-security" ? "#f87171" : "#334155"} 
              strokeWidth={selectedRole?.id === "qa-security" ? "2" : "1"}
              filter="url(#shadow-org)"
              className="transition-all"
            />
            <text x="380" y="250" textAnchor="middle" className="text-[9px] font-extrabold fill-slate-200">SEGURIDAD & CONTROL DE CALIDAD (QA)</text>
            <text x="380" y="262" textAnchor="middle" className="text-[8px] font-mono fill-rose-400 font-semibold">Prevención XSS & Fallback Tests</text>
          </g>
        </svg>

        {/* Interactive feedback */}
        <span className="absolute bottom-2 text-[9px] text-slate-400 font-mono tracking-wider uppercase font-bold">
          👆 Haz clic en las posiciones para detallar su impacto comercial y roadmap
        </span>
      </div>

      {/* Selected Role Explanation */}
      {selectedRole && (
        <motion.div
          key={selectedRole.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-emerald-600/[0.02] border border-emerald-100 flex flex-col md:flex-row gap-5"
        >
          {/* Avatar simulation icon */}
          <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white font-mono font-extrabold text-lg shadow-md shadow-emerald-100">
            <Users className="w-6 h-6" />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800">
                  {selectedRole.title}
                </h4>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  {selectedRole.role}
                </span>
              </div>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md">
                {selectedRole.phase}
              </span>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1.5">
              {selectedRole.description}
            </p>
          </div>
        </motion.div>
      )}

      {/* Development Roadmap to Commercialization */}
      <div className="pt-4">
        <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Milestone className="w-5 h-5 text-emerald-600" /> Plan de Desarrollo hasta la Comercialización
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {roadmapSteps.map((step, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-slate-200 transition-all flex flex-col gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-mono font-bold">
                {step.num}
              </span>
              <h4 className="text-xs font-extrabold text-slate-800">{step.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Monetization Highlight */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-850 text-white rounded-2xl border border-slate-800 flex items-center gap-4">
        <span className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
          <ShoppingBag className="w-6 h-6" />
        </span>
        <div>
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Estrategia de Ventas (Puesta en Venta)
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
            Este proyecto se comercializa como un <strong>SDK Embebido</strong> o como una <strong>API de Interfaz Autogenerada</strong>. Las empresas pagan por cantidad de prompts renderizados mensualmente. El valor radica en liberar a los clientes corporativos del costo de rediseñar dashboards eternamente, reduciendo drásticamente sus tiempos de desarrollo frontend de meses a segundos.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
